import type { Metadata } from "next";
import { UserCircleIcon } from "@heroicons/react/24/outline";

export const metadata: Metadata = {
	title: "Login",
	description: "Sign in to the SAASMARTWORKS platform.",
};

export default function LoginPage() {
	return (
		<main className="auth-page">
			<section className="auth-panel" aria-labelledby="login-heading">
				<div className="auth-icon" aria-hidden="true">
					<UserCircleIcon />
				</div>
				<p className="eyebrow">Platform access</p>
				<h1 id="login-heading">Welcome back.</h1>
				<p className="auth-lead">
					Sign in to access your SAASMARTWORKS workspace.
				</p>
				<form className="auth-form">
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
					<button className="button" type="submit" disabled>
						Sign in coming soon
					</button>
					<p className="form-note">
						Authentication is not active yet. This page is ready for the
						approved auth implementation.
					</p>
				</form>
			</section>
		</main>
	);
}
