"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LockClosedIcon } from "@heroicons/react/24/outline";
export function ChangePasswordForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = new FormData(event.currentTarget);
    if (data.get("newPassword") !== data.get("confirmation")) { setError("Passwords must match."); return; }
    setPending(true); setError("");
    try {
      const response = await fetch("/api/auth/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: data.get("currentPassword"), newPassword: data.get("newPassword") }) });
      const body = await response.json();
      if (!response.ok) { setError(body.error?.message ?? "Unable to change password."); return; }
      router.replace("/admin"); router.refresh();
    } catch { setError("Unable to change password. Please try again."); } finally { setPending(false); }
  }
  return <main className="auth-page"><section className="auth-panel"><h1>Change password</h1><p>Choose a new password with at least 12 characters.</p><form className="auth-form" onSubmit={submit}>
    {[["currentPassword", "Current password"], ["newPassword", "New password"], ["confirmation", "Confirm new password"]].map(([name, label]) => <div className="auth-field" key={name}><label htmlFor={name}><LockClosedIcon className="h-4 w-4" aria-hidden="true" />{label}</label><input id={name} name={name} type="password" autoComplete={name === "currentPassword" ? "current-password" : "new-password"} required minLength={name === "currentPassword" ? 1 : 12} maxLength={name === "currentPassword" ? 1024 : 72} placeholder={label} /></div>)}
    {error && <p role="alert">{error}</p>}<button className="button" disabled={pending}>{pending ? "Saving…" : "Change password"}</button>
  </form></section></main>;
}
