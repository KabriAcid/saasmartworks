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
		<main className="grid min-h-svh place-items-center px-5 py-16">
			<section className="glass-panel w-full max-w-md" aria-labelledby="login-heading">
				<Link
					className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted no-underline hover:text-ink"
					href="/"
				>
					<ArrowLeftIcon className="inline-block h-4 w-4" aria-hidden="true" />
					Back to homepage
				</Link>
				<div
					className="mb-6 grid size-13 place-items-center rounded-2xl bg-primary-tint text-primary-strong"
					aria-hidden="true"
				>
					<UserCircleIcon className="inline-block h-5 w-5" />
				</div>
				<p className="eyebrow">Platform access</p>
				<h1 className="mb-3 max-w-none text-4xl sm:text-5xl" id="login-heading">
					Sign in.
				</h1>
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
							className="input"
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
						<div className="relative">
							<input
								id="login-password"
								name="password"
								type={showPassword ? "text" : "password"}
								className="input pr-12"
								autoComplete="current-password"
								placeholder="Enter your password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								required
							/>
							<button
								className="button-icon absolute top-1/2 right-2 -translate-y-1/2"
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
					<div className="flex justify-end">
						<button
							className="button-link"
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
					<button className="button button-block" type="submit">
						Sign in
					</button>
				</form>
			</section>
			<dialog
				ref={dialogRef}
				className="dialog"
				aria-labelledby="recovery-heading"
				onClose={() => setIsForgotPasswordOpen(false)}
			>
				<div className="grid gap-4 p-6 sm:p-8">
					<div className="flex items-center justify-between gap-4">
						<h2 className="m-0 text-xl" id="recovery-heading">
							Reset your password
						</h2>
						<button
							className="button-icon button-icon-lg flex-none"
							type="button"
							aria-label="Close dialog"
							onClick={() => setIsForgotPasswordOpen(false)}
						>
							<XMarkIcon className="inline-block h-5 w-5" aria-hidden="true" />
						</button>
					</div>
					<p className="m-0 text-sm text-muted">
						Enter your account email to continue with password recovery.
					</p>
					<form className="grid gap-3" onSubmit={handleRecoverySubmit}>
						<label className="text-sm font-bold" htmlFor="recovery-email">
							Email address
						</label>
						<input
							id="recovery-email"
							className="input"
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
						<button className="button button-secondary" type="submit">
							Continue
						</button>
					</form>
				</div>
			</dialog>
		</main>
	);
}
