import { redirect } from "next/navigation";

/** Legacy route — Clerk handles authentication */
export default function LoginPage() {
  redirect("/sign-in");
}
