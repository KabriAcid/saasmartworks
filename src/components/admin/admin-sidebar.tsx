"use client";

import {
	BriefcaseIcon,
	ChevronDownIcon,
	HomeIcon,
	UsersIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/logo";

const navigationGroups = [
	{
		label: "People",
		icon: UsersIcon,
		links: [
			{ label: "User accounts", href: "/admin/users" },
			{ label: "Attendance", href: "/admin/attendance" },
		],
	},
	{
		label: "Website management",
		icon: BriefcaseIcon,
		links: [
			{ label: "Services", href: "/admin/services" },
			{ label: "Service categories", href: "/admin/services/categories" },
		],
	},
];

export function AdminSidebar() {
	const pathname = usePathname();

	return (
		<aside className="hidden w-72 shrink-0 border-r border-slate-200/80 bg-slate-950 text-slate-100 lg:flex lg:flex-col">
			<div className="flex items-center gap-3 border-b border-white/10 px-6 py-7">
				<div className="admin-shadow-glow flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl">
					<Logo
						src="/favicon-trans.png"
						alt="SA’A SMART WORKS"
						className="h-8 w-8 object-contain"
					/>
				</div>
				<div>
					<p className="text-[10px] font-semibold tracking-[0.28em] text-slate-400 uppercase">
						Workspace
					</p>
					<p className="text-lg font-semibold text-white">Admin</p>
				</div>
			</div>

			<nav aria-label="Admin navigation" className="space-y-2 px-4 py-5">
				<Link
					href="/admin"
					aria-current={pathname === "/admin" ? "page" : undefined}
					className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${pathname === "/admin" ? "admin-shadow-active bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
				>
					<HomeIcon className="h-5 w-5 shrink-0" />
					<span>Dashboard</span>
				</Link>

				{navigationGroups.map(({ label, icon: Icon, links }) => {
					const isActive = links.some(({ href }) => pathname.startsWith(href));
					return (
						<details key={label} className="group" open={isActive}>
							<summary className="flex cursor-pointer list-none items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white [&::-webkit-details-marker]:hidden">
								<Icon className="h-5 w-5 shrink-0" />
								<span className="flex-1">{label}</span>
								<ChevronDownIcon className="h-4 w-4 transition-transform group-open:rotate-180" />
							</summary>
							<div className="ml-5 mt-1 space-y-1 border-l border-white/10 pl-4">
								{links.map(({ label: linkLabel, href }) => {
									const isLinkActive = pathname === href;
									return (
										<Link
											key={href}
											href={href}
											aria-current={isLinkActive ? "page" : undefined}
											className={`block rounded-xl px-3 py-2 text-sm transition ${isLinkActive ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
										>
											{linkLabel}
										</Link>
									);
								})}
							</div>
						</details>
					);
				})}
			</nav>
		</aside>
	);
}
