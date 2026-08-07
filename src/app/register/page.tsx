import { redirect } from "next/navigation";

/** Legacy route — sign up with Clerk, then complete paid enrollment */
export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const params = await searchParams;
  const course = params.course ? `?course=${params.course}` : "";
  redirect(`/sign-up${course ? `?redirect_url=${encodeURIComponent(`/enroll${course}`)}` : ""}`);
}
