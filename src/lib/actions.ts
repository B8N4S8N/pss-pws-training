"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { appUrl, getStripe, stripeConfigured, CHECKOUT_INTEGRATION_ID } from "@/lib/stripe";

export async function completeLessonAction(lessonId: string, score?: number) {
  const user = await requireUser(["STUDENT", "INSTRUCTOR", "ADMIN"]);
  if (!user) return { error: "Unauthorized" };

  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId } },
    update: {
      status: "COMPLETED",
      score: score ?? undefined,
      completedAt: new Date(),
    },
    create: {
      userId: user.id,
      lessonId,
      status: "COMPLETED",
      score: score ?? null,
      completedAt: new Date(),
    },
  });

  await refreshEnrollmentProgress(user.id);
  revalidatePath("/dashboard");
  revalidatePath("/learn");
  return { ok: true };
}

export async function submitQuizAction(
  lessonId: string,
  answers: Record<string, number>
) {
  const user = await requireUser(["STUDENT", "INSTRUCTOR", "ADMIN"]);
  if (!user) return { error: "Unauthorized" };

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson?.interactivePayload) return { error: "Not a quiz lesson" };

  const payload = JSON.parse(lesson.interactivePayload) as {
    questions: {
      id: string;
      correctIndex: number;
    }[];
  };

  let correct = 0;
  for (const q of payload.questions) {
    if (answers[q.id] === q.correctIndex) correct += 1;
  }
  const score = Math.round((correct / payload.questions.length) * 100);
  const passed = score >= (lesson.passScore || 80);

  const prior = await prisma.quizAttempt.count({
    where: { userId: user.id, lessonId },
  });

  await prisma.quizAttempt.create({
    data: {
      userId: user.id,
      lessonId,
      score,
      passed,
      answersJson: JSON.stringify(answers),
      attemptNum: prior + 1,
    },
  });

  if (passed) {
    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: user.id, lessonId } },
      update: {
        status: "COMPLETED",
        score,
        completedAt: new Date(),
      },
      create: {
        userId: user.id,
        lessonId,
        status: "COMPLETED",
        score,
        completedAt: new Date(),
      },
    });
    await refreshEnrollmentProgress(user.id);
  }

  revalidatePath("/learn");
  return { score, passed, correct, total: payload.questions.length };
}

export async function submitReflectionAction(lessonId: string, content: string) {
  const user = await requireUser(["STUDENT", "INSTRUCTOR", "ADMIN"]);
  if (!user) return { error: "Unauthorized" };
  if (content.trim().length < 40) {
    return { error: "Please write a more complete reflection (40+ characters)." };
  }

  await prisma.reflection.create({
    data: { userId: user.id, lessonId, content },
  });
  await completeLessonAction(lessonId);
  return { ok: true };
}

export async function submitScenarioAction(lessonId: string, choiceIndex: number) {
  const user = await requireUser(["STUDENT", "INSTRUCTOR", "ADMIN"]);
  if (!user) return { error: "Unauthorized" };
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson?.interactivePayload) return { error: "Invalid scenario" };
  const payload = JSON.parse(lesson.interactivePayload) as {
    choices: { score: number; feedback: string }[];
  };
  const choice = payload.choices[choiceIndex];
  if (!choice) return { error: "Invalid choice" };

  const passed = choice.score >= 70;
  if (passed) {
    await completeLessonAction(lessonId, choice.score);
  } else {
    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: user.id, lessonId } },
      update: { status: "NEEDS_REVIEW", score: choice.score, feedback: choice.feedback },
      create: {
        userId: user.id,
        lessonId,
        status: "NEEDS_REVIEW",
        score: choice.score,
        feedback: choice.feedback,
      },
    });
  }

  return { score: choice.score, feedback: choice.feedback, passed };
}

export async function startCheckoutAction(formData: FormData) {
  const user = await requireUser();
  if (!user) redirect("/sign-in");

  if (!stripeConfigured()) {
    return {
      error:
        "Stripe is not configured yet. Add STRIPE_SECRET_KEY to enable card + Klarna/Afterpay checkout.",
    };
  }

  const courseSlug = String(formData.get("courseSlug") || "oregon-pss-40");
  const deliveryMode = String(formData.get("deliveryMode") || "AYOP") as
    | "AYOP"
    | "HYBRID";
  const peerIdentity = String(formData.get("peerIdentity") || "").trim();

  const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
  if (!course || !course.isPublished) {
    return { error: "Course not found" };
  }

  if (peerIdentity) {
    await prisma.user.update({
      where: { id: user.id },
      data: { peerIdentity },
    });
  }

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: course.id } },
  });
  if (existing && existing.status === "ACTIVE") {
    redirect(`/learn/${course.slug}`);
  }

  const stripe = getStripe();

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { cascadeUserId: user.id },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const payment = await prisma.payment.create({
    data: {
      userId: user.id,
      courseId: course.id,
      deliveryMode,
      amountCents: course.priceCents,
      currency: "usd",
      status: "PENDING",
      stripeCustomerId: customerId,
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: customerId,
    client_reference_id: user.id,
    success_url: appUrl(`/checkout/success?session_id={CHECKOUT_SESSION_ID}`),
    cancel_url: appUrl(`/enroll?course=${course.slug}&canceled=1`),
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: course.priceCents,
          product_data: {
            name: course.title,
            description: `${course.contactHours}-hour Oregon THW-aligned training · ${deliveryMode}`,
          },
        },
      },
    ],
    metadata: {
      cascadeUserId: user.id,
      courseId: course.id,
      courseSlug: course.slug,
      deliveryMode,
      paymentId: payment.id,
      integration: CHECKOUT_INTEGRATION_ID,
    },
    payment_intent_data: {
      metadata: {
        cascadeUserId: user.id,
        courseId: course.id,
        paymentId: payment.id,
      },
    },
    allow_promotion_codes: true,
    billing_address_collection: "required",
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: { stripeCheckoutSessionId: session.id },
  });

  if (!session.url) {
    return { error: "Stripe did not return a checkout URL" };
  }

  redirect(session.url);
}

export async function issueCertificateAction(studentId: string, courseType: "PSS" | "PWS") {
  const actor = await requireUser(["ADMIN", "INSTRUCTOR"]);
  if (!actor) return { error: "Unauthorized" };

  const hours = courseType === "PSS" ? 40 : 80;
  const cert = await prisma.certificate.create({
    data: {
      userId: studentId,
      courseType,
      certificateCode: `CPA-${courseType}-${nanoid(8).toUpperCase()}`,
      hoursCompleted: hours,
      instructorName: actor.name,
      deliveryMode: "AYOP",
    },
  });

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId: studentId,
      course: { type: courseType },
    },
  });
  if (enrollment) {
    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        overallProgress: 100,
        hoursLogged: hours,
      },
    });
  }

  revalidatePath("/admin");
  return { ok: true, code: cert.certificateCode };
}

export async function saveCompetencyEvaluationAction(formData: FormData): Promise<void> {
  const actor = await requireUser(["ADMIN", "INSTRUCTOR"]);
  if (!actor) return;

  const studentId = String(formData.get("studentId"));
  const courseType = String(formData.get("courseType")) as "PSS" | "PWS";
  const narrative = String(formData.get("narrative") || "");
  const recommendation = String(formData.get("recommendation") || "PENDING");
  const liveObserved = String(formData.get("liveObserved") || "") === "on";

  await prisma.competencyEvaluation.create({
    data: {
      studentId,
      instructorId: actor.id,
      courseType,
      narrative,
      recommendation,
      liveObserved,
      domainScores: JSON.stringify({
        communication: Number(formData.get("communication") || 0),
        ethics: Number(formData.get("ethics") || 0),
        trauma: Number(formData.get("trauma") || 0),
        crisis: Number(formData.get("crisis") || 0),
        mi: Number(formData.get("mi") || 0),
        documentation: Number(formData.get("documentation") || 0),
      }),
    },
  });

  if (recommendation === "READY") {
    await issueCertificateAction(studentId, courseType);
  }

  revalidatePath("/admin");
  redirect("/admin/students");
}

export async function markAttendanceAction(formData: FormData): Promise<void> {
  const actor = await requireUser(["ADMIN", "INSTRUCTOR"]);
  if (!actor) return;
  const userId = String(formData.get("userId"));
  const cohortId = String(formData.get("cohortId"));
  const liveSessionId = String(formData.get("liveSessionId") || "") || null;
  const present = String(formData.get("present")) === "true";
  const minutes = Number(formData.get("minutes") || 0);

  await prisma.attendanceRecord.create({
    data: {
      userId,
      cohortId,
      liveSessionId,
      present,
      minutes,
      notes: String(formData.get("notes") || "") || null,
    },
  });
  revalidatePath("/admin");
}

export async function fulfillCheckoutSession(sessionId: string) {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid" && session.status !== "complete") {
    return { error: "Payment not completed" };
  }

  const paymentId = session.metadata?.paymentId;
  const courseId = session.metadata?.courseId;
  const userId = session.metadata?.cascadeUserId;
  const deliveryMode = (session.metadata?.deliveryMode || "AYOP") as
    | "AYOP"
    | "HYBRID";

  if (!paymentId || !courseId || !userId) {
    return { error: "Missing checkout metadata" };
  }

  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment) return { error: "Payment record not found" };

  if (payment.status !== "PAID") {
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "PAID",
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id || null,
        paymentMethodTypes: (session.payment_method_types || []).join(","),
        metadataJson: JSON.stringify({
          amount_total: session.amount_total,
          currency: session.currency,
        }),
      },
    });
  }

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return { error: "Course not found" };

  const cohort = await prisma.cohort.findFirst({
    where: { courseId, deliveryMode, isActive: true },
  });

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    update: {
      status: "ACTIVE",
      deliveryMode,
      cohortId: cohort?.id,
    },
    create: {
      userId,
      courseId,
      cohortId: cohort?.id,
      deliveryMode,
      status: "ACTIVE",
    },
  });

  revalidatePath("/dashboard");
  return { ok: true, courseSlug: course.slug };
}

async function refreshEnrollmentProgress(userId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId, status: "ACTIVE" },
    include: {
      course: {
        include: {
          modules: { include: { lessons: true } },
        },
      },
    },
  });

  for (const enrollment of enrollments) {
    const lessonIds = enrollment.course.modules.flatMap((m) =>
      m.lessons.map((l) => l.id)
    );
    if (!lessonIds.length) continue;
    const completed = await prisma.lessonProgress.count({
      where: {
        userId,
        lessonId: { in: lessonIds },
        status: "COMPLETED",
      },
    });
    const overallProgress = (completed / lessonIds.length) * 100;
    const hoursLogged =
      (completed / lessonIds.length) * enrollment.course.contactHours;
    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { overallProgress, hoursLogged },
    });
  }
}
