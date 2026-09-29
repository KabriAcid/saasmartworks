"use client";

import { useState } from "react";
import {
	EnvelopeIcon,
	EyeIcon,
	EyeSlashIcon,
	LockClosedIcon,
	UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function LoginForm() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		router.push("/admin");
	};

	return (
		<main className="auth-page">
			<section className="auth-panel" aria-labelledby="login-heading">
				<div className="auth-icon" aria-hidden="true">
					<UserCircleIcon className="inline-block" />
				</div>
				<p className="eyebrow">Platform access</p>
				<h1 id="login-heading">Sign in.</h1>
				<form className="auth-form" onSubmit={handleSubmit}>
					<div className="auth-field">
						<label htmlFor="login-email">
							<EnvelopeIcon
								className="inline-block h-4 w-4"
								aria-hidden="true"
							/>
							Email address
						</label>
						<input
							id="login-email"
							name="email"
							type="email"
							autoComplete="email"
							placeholder="you@example.com"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							required
						/>
					</div>
					<div className="auth-field">
						<label htmlFor="login-password">
							<LockClosedIcon
								className="inline-block h-4 w-4"
								aria-hidden="true"
							/>
							Password
						</label>
						<div className="auth-password-field">
							<input
								id="login-password"
								name="password"
								type={showPassword ? "text" : "password"}
								autoComplete="current-password"
								placeholder="Enter your password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								required
							/>
							<button
								className="auth-password-toggle"
								type="button"
								aria-label={showPassword ? "Hide password" : "Show password"}
								aria-pressed={showPassword}
								aria-controls="login-password"
								onClick={() => setShowPassword((visible) => !visible)}
							>
								{showPassword ? (
									<EyeSlashIcon
										className="inline-block h-5 w-5"
										aria-hidden="true"
									/>
								) : (
									<EyeIcon
										className="inline-block h-5 w-5"
										aria-hidden="true"
									/>
								)}
							</button>
						</div>
					</div>
					<button className="w-100 block button" type="submit">
						Sign in
					</button>
				</form>
			</section>
		</main>
	);
}
