import { redirect } from "next/navigation";
import { requireSession, AuthError } from "@/lib/auth/authorization";
import { ChangePasswordForm } from "@/components/auth/change-password-form";
export default async function ChangePasswordPage() {
  await requireSession().catch(error => { if (error instanceof AuthError && error.status === 401) redirect("/login"); throw error; });
  return <ChangePasswordForm />;
}
