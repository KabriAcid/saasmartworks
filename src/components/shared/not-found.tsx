import {
	ArrowLeftIcon,
	HomeIcon,
	MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function NotFound() {
	return (
		<main className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center overflow-hidden px-4 py-16">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,166,77,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(23,43,58,0.08),transparent_28%)]" />

			<div className="shell relative">
				<div className="mx-auto max-w-5xl rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl sm:p-8 lg:p-12">
					<div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
						<div>
							<div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-3 py-1.5 text-[11px] font-bold tracking-[0.24em] text-[var(--color-ink)] uppercase">
								<span>404 Error</span>
							</div>

							<h1 className="mt-5 text-4xl font-black tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
								This page wandered off.
							</h1>

							<p className="mt-4 max-w-xl text-base text-slate-600 sm:text-lg">
								The page you were trying to reach does not exist, may have
								moved, or is temporarily unavailable.
							</p>

							<div className="mt-8 flex flex-col gap-3 sm:flex-row">
								<Link
									href="/"
									className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-[var(--color-ink)] shadow-[0_16px_32px_rgba(255,166,77,0.25)] transition-transform duration-200 hover:-translate-y-0.5"
								>
									<HomeIcon className="h-4 w-4" />
									Return home
								</Link>

								<Link
									href="/contact"
									className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-900"
								>
									<ArrowLeftIcon className="h-4 w-4" />
									Contact us
								</Link>
							</div>
						</div>

						<div className="relative">
							<div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-5 text-slate-100 shadow-[0_28px_60px_rgba(15,23,42,0.2)]">
								<div className="flex items-center justify-between border-b border-white/10 pb-4">
									<div>
										<p className="text-[10px] font-semibold tracking-[0.28em] text-slate-400 uppercase">
											Status
										</p>
										<p className="mt-2 text-2xl font-bold text-white">404</p>
									</div>
									<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-[var(--color-ink)] shadow-[0_12px_24px_rgba(255,166,77,0.28)]">
										<MagnifyingGlassIcon className="h-5 w-5" />
									</div>
								</div>

								<div className="mt-5 space-y-3">
									<Link
										href="/services"
										className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10"
									>
										Explore services
									</Link>
									<Link
										href="/about"
										className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10"
									>
										Learn about SA’A
									</Link>
									<Link
										href="/login"
										className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10"
									>
										Platform sign in
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
