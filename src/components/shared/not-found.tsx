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
						<div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
						<div className="order-first flex min-h-[14rem] min-w-0 items-center justify-center overflow-visible lg:min-h-[28rem]">
							{/* 3D Large Text for a 404 with text gradient of primary and secondary */}
							<h2 className="not-found-3d whitespace-nowrap text-[clamp(9rem,27vw,22rem)] font-black leading-[0.72] tracking-[-0.12em]" aria-label="404">404</h2>
						</div>
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

					</div>
				</div>
			</div>
		</main>
	);
}
