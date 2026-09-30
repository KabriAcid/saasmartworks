"use client";

import { useEffect, useRef, useState } from "react";
import {
	ArrowLeftIcon,
	EnvelopeIcon,
	EyeIcon,
	EyeSlashIcon,
	LockClosedIcon,
	XMarkIcon,
	UserCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
	const [recoveryEmail, setRecoveryEmail] = useState("");
	const [recoveryMessage, setRecoveryMessage] = useState("");
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		if (isForgotPasswordOpen && !dialog.open) dialog.showModal();
		if (!isForgotPasswordOpen && dialog.open) dialog.close();
	}, [isForgotPasswordOpen]);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		router.push("/admin");
	};
	const handleRecoverySubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setRecoveryMessage("Password recovery will be available soon.");
	};

	return (
		<main className="auth-page">
			<section className="auth-panel" aria-labelledby="login-heading">
				<Link className="auth-back-link" href="/">
					<ArrowLeftIcon className="inline-block h-4 w-4" aria-hidden="true" />
					Back to homepage
				</Link>
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
					<div className="auth-forgot-row">
						<button
							className="auth-forgot-link"
							type="button"
							onClick={() => {
								setRecoveryEmail(email);
								setRecoveryMessage("");
								setIsForgotPasswordOpen(true);
							}}
						>
							Forgot password?
						</button>
					</div>
					<button className="w-100 block button" type="submit">
						Sign in
					</button>
				</form>
			</section>
			<dialog
				ref={dialogRef}
				className="auth-reset-dialog"
				aria-labelledby="recovery-heading"
				onClose={() => setIsForgotPasswordOpen(false)}
			>
				<div className="auth-reset-content">
					<div className="auth-reset-header">
						<h2 id="recovery-heading">Reset your password</h2>
						<button
							className="auth-reset-close"
							type="button"
							aria-label="Close dialog"
							onClick={() => setIsForgotPasswordOpen(false)}
						>
							<XMarkIcon className="inline-block h-5 w-5" aria-hidden="true" />
						</button>
					</div>
					<p className="auth-reset-description">
						Enter your account email to continue with password recovery.
					</p>
					<form className="auth-reset-form" onSubmit={handleRecoverySubmit}>
						<label htmlFor="recovery-email">Email address</label>
						<input
							id="recovery-email"
							type="email"
							autoComplete="email"
							placeholder="you@example.com"
							value={recoveryEmail}
							onChange={(event) => setRecoveryEmail(event.target.value)}
							required
						/>
						{recoveryMessage && (
							<p className="auth-error" role="status">
								{recoveryMessage}
							</p>
						)}
						<button className="button" type="submit">
							Continue
						</button>
					</form>
				</div>
			</dialog>
		</main>
	);
}
