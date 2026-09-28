import type { Metadata } from "next";
import {
	ArrowLeftStartOnRectangleIcon,
	BriefcaseIcon,
	ChartBarSquareIcon,
	ChatBubbleLeftRightIcon,
	HomeIcon,
	MagnifyingGlassIcon,
	ShieldCheckIcon,
	UsersIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
	title: "Administration | SA’A SMART WORKS",
	robots: { index: false, follow: false },
};

const navigation = [
	{ label: "Overview", href: "/admin", icon: HomeIcon, active: true },
	{ label: "Clients", href: "/admin/clients", icon: UsersIcon, active: false },
	{
		label: "Projects",
		href: "/admin/projects",
		icon: BriefcaseIcon,
		active: false,
	},
	{
		label: "Reports",
		href: "/admin/reports",
		icon: ChartBarSquareIcon,
		active: false,
	},
	{
		label: "Messages",
		href: "/admin/messages",
		icon: ChatBubbleLeftRightIcon,
		active: false,
	},
	{
		label: "Security",
		href: "/admin/security",
		icon: ShieldCheckIcon,
		active: false,
	},
];

function SidebarItem({
	icon: Icon,
	label,
	active,
}: {
	icon: typeof HomeIcon;
	label: string;
	active: boolean;
}) {
	return (
		<button
			type="button"
			className={[
				"flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-200",
				active
					? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
					: "text-slate-300 hover:bg-white/5 hover:text-white",
			].join(" ")}
		>
			<Icon className="h-5 w-5 shrink-0" />
			<span>{label}</span>
		</button>
	);
}

export default function AdminLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
			<div className="flex min-h-screen">
				<aside className="hidden w-72 shrink-0 border-r border-slate-200/80 bg-slate-950 text-slate-100 lg:flex lg:flex-col">
					<div className="flex items-center gap-3 border-b border-white/10 px-6 py-7">
						<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-sm font-black text-[var(--color-ink)] shadow-[0_12px_24px_rgba(255,166,77,0.3)]">
							SA
						</div>
						<div>
							<p className="text-[10px] font-semibold tracking-[0.28em] text-slate-400 uppercase">
								Workspace
							</p>
							<p className="mt-1 text-lg font-semibold text-white">
								SA’A Admin
							</p>
						</div>
					</div>

					<nav className="space-y-2 px-4 py-5">
						{navigation.map(({ label, href, icon: Icon, active }) => (
							<div key={label}>
								<SidebarItem icon={Icon} label={label} active={active} />
							</div>
						))}
					</nav>

					<div className="mt-auto p-4">
						<div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
							<p className="text-[10px] font-semibold tracking-[0.22em] text-slate-400 uppercase">
								Status
							</p>
							<div className="mt-3 flex items-center justify-between">
								<div>
									<p className="text-sm font-semibold text-white">
										System healthy
									</p>
									<p className="text-xs text-slate-400">
										All core checks passing
									</p>
								</div>
								<div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
									<ShieldCheckIcon className="h-4 w-4" />
								</div>
							</div>
						</div>
					</div>
				</aside>

				<div className="flex min-w-0 flex-1 flex-col">
					<header className="sticky top-4 z-20 px-4 pb-4 sm:px-6 lg:px-8">
						<div className="flex h-20 items-center justify-between rounded-[999px] border border-white/80 bg-white/70 px-4 shadow-[0_18px_45px_rgba(31,41,51,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl sm:px-5">
							<div className="flex items-center gap-3">
								<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-sm font-black text-[var(--color-ink)] shadow-[0_12px_24px_rgba(255,166,77,0.28)]">
									SA
								</div>
								<div>
									<p className="text-[10px] font-semibold tracking-[0.22em] text-slate-500 uppercase">
										Administration
									</p>
									<h1 className="mt-1 text-xl font-bold text-[var(--color-ink)] sm:text-2xl">
										Overview
									</h1>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<button
									type="button"
									className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900 sm:flex"
								>
									<MagnifyingGlassIcon className="h-4 w-4" />
									Search
								</button>

								<button
									type="button"
									className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/90 p-2.5 text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
									aria-label="Notifications"
								>
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.8"
										className="h-4 w-4"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 1 1-6 0"
										/>
									</svg>
								</button>

								<div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/90 px-2.5 py-1.5 shadow-sm">
									<div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-[var(--color-ink)]">
										AD
									</div>
									<div className="hidden text-left sm:block">
										<p className="text-sm font-semibold text-slate-900">
											Admin
										</p>
										<p className="text-[11px] text-slate-500">Operations</p>
									</div>
								</div>
							</div>
						</div>
					</header>

					<main className="flex-1 p-4 sm:p-6 lg:p-8">
						<div className="mx-auto max-w-7xl">{children}</div>
					</main>
				</div>
			</div>

			<button
				type="button"
				className="fixed bottom-5 right-5 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-4 py-2.5 text-sm font-bold text-[var(--color-ink)] shadow-[0_16px_28px_rgba(255,166,77,0.25)] transition hover:-translate-y-0.5 lg:hidden"
			>
				<ArrowLeftStartOnRectangleIcon className="h-4 w-4" />
				Log out
			</button>
		</div>
	);
}
