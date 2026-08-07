import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import type { Role } from "@/generated/prisma/enums";
import type { User } from "@/generated/prisma/client";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

function adminEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS || "admin@cascadepeer.academy")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  );
}

function instructorEmails(): Set<string> {
  return new Set(
    (process.env.INSTRUCTOR_EMAILS || "instructor@cascadepeer.academy")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  );
}

function resolveRole(email: string, metadataRole?: string): Role {
  const normalized = email.toLowerCase();
  if (metadataRole === "ADMIN" || metadataRole === "INSTRUCTOR" || metadataRole === "STUDENT") {
    return metadataRole;
  }
  if (adminEmails().has(normalized)) return "ADMIN";
  if (instructorEmails().has(normalized)) return "INSTRUCTOR";
  return "STUDENT";
}

export async function upsertUserFromClerk(
  clerkUser: NonNullable<Awaited<ReturnType<typeof currentUser>>>
): Promise<User> {
  const email =
    clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)
      ?.emailAddress ||
    clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("Clerk user is missing an email address");
  }

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim() ||
    clerkUser.username ||
    email.split("@")[0];

  const metadataRole = (clerkUser.publicMetadata?.role as string | undefined) || undefined;
  const role = resolveRole(email, metadataRole);

  const existingByClerk = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });
  if (existingByClerk) {
    return prisma.user.update({
      where: { id: existingByClerk.id },
      data: {
        email,
        name,
        avatarUrl: clerkUser.imageUrl,
        role: existingByClerk.role === "STUDENT" ? role : existingByClerk.role,
      },
    });
  }

  const existingByEmail = await prisma.user.findUnique({ where: { email } });
  if (existingByEmail) {
    return prisma.user.update({
      where: { id: existingByEmail.id },
      data: {
        clerkId: clerkUser.id,
        name,
        avatarUrl: clerkUser.imageUrl,
        role:
          existingByEmail.role === "ADMIN" || existingByEmail.role === "INSTRUCTOR"
            ? existingByEmail.role
            : role,
      },
    });
  }

  return prisma.user.create({
    data: {
      clerkId: clerkUser.id,
      email,
      name,
      avatarUrl: clerkUser.imageUrl,
      role,
    },
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const { userId } = await auth();
  if (!userId) return null;
  const clerkUser = await currentUser();
  if (!clerkUser) return null;
  const user = await upsertUserFromClerk(clerkUser);
  if (!user.isActive) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export async function requireUser(roles?: Role[]) {
  const { userId } = await auth();
  if (!userId) return null;
  const clerkUser = await currentUser();
  if (!clerkUser) return null;
  const user = await upsertUserFromClerk(clerkUser);
  if (!user.isActive) return null;
  if (roles && !roles.includes(user.role)) return null;
  return user;
}

/** @deprecated Clerk handles sessions — kept as no-op for gradual migration */
export async function createSession(_user?: SessionUser) {
  void _user;
  return;
}

/** @deprecated Use Clerk SignOutButton / UserButton */
export async function destroySession() {
  return;
}

export async function hashPassword(password: string) {
  void password;
  throw new Error("Password auth retired — use Clerk");
}

export async function verifyPassword(password: string, hash: string) {
  void password;
  void hash;
  return false;
}

export type { User as DbUser };
