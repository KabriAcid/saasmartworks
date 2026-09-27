"use client";

import { useRouter } from "next/navigation";
import type { Metadata } from "next";
import { UserCircleIcon } from "@heroicons/react/24/outline";

export const metadata: Metadata = {
	title: "Login",
	description: "Sign in to the SA'A SMART WORKS platform.",
};

export default function LoginPage() {
	const router = useRouter();

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		router.push("/admin");
	};

	return (
		<main className="auth-page">
			<section className="auth-panel" aria-labelledby="login-heading">
				<div className="auth-icon" aria-hidden="true">
					<UserCircleIcon />
				</div>
				<p className="eyebrow">Platform access</p>
				<h1 id="login-heading">Sign in.</h1>
				<form className="auth-form" method="post" onSubmit={handleSubmit}>
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
					<button className="w-100 block button" type="submit">
						Sign in
					</button>
				</form>
			</section>
		</main>
	);
}
