"use client";

import { useActionState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { login } from "@/app/auth/actions";

export default function LoginForm() {
	const [state, formAction, pending] = useActionState(login, { message: null });

	return (
		<main className="auth-page">
			<section className="auth-panel" aria-labelledby="login-heading">
				<div className="auth-icon" aria-hidden="true">
					<UserCircleIcon />
				</div>
				<p className="eyebrow">Platform access</p>
				<h1 id="login-heading">Sign in.</h1>
				<form className="auth-form" action={formAction}>
					<label htmlFor="login-email">
						Email address
						<input
							id="login-email"
							name="email"
							type="email"
							autoComplete="email"
							placeholder="you@example.com"
							required
						/>
					</label>
					<label htmlFor="login-password">
						Password
						<input
							id="login-password"
							name="password"
							type="password"
							autoComplete="current-password"
							placeholder="Enter your password"
							required
						/>
					</label>
					{state.message && (
						<p className="auth-error" role="alert">
							{state.message}
						</p>
					)}
					<button
						className="w-100 block button"
						type="submit"
						disabled={pending}
					>
						{pending ? "Signing in..." : "Sign in"}
					</button>
				</form>
			</section>
		</main>
	);
}
