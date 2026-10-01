"use client";

import { ChevronDownIcon, HomeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { routePermission } from "@/lib/auth/permissions";
import { Logo } from "@/components/shared/logo";
import {
	navigationGroups,
} from "@/components/admin/navigation/admin-navigation";

type AdminSidebarProps = {
	permissions: string[];
};

export function AdminSidebar({ permissions }: AdminSidebarProps) {
	const pathname = usePathname();

	const isRouteActive = (href: string) =>
		pathname === href || pathname.startsWith(`${href}/`);

	const visibleGroups = navigationGroups
		.map((group) => ({
			...group,
			links: group.links.filter((link) => permissions.includes(routePermission(link.href) ?? "")),
		}))
		.filter((group) => group.links.length > 0);

	const activeGroup =
		visibleGroups.find((group) =>
			group.links.some(({ href }) => isRouteActive(href)),
		)?.label ?? null;

	const [openGroup, setOpenGroup] = useState<string | null>(activeGroup);

	const toggleGroup = (label: string) => {
		setOpenGroup((current) => (current === label ? null : label));
	};

	return (
		<aside className="fixed inset-y-0 left-0 z-30 hidden h-dvh w-72 flex-col overflow-hidden bg-[#172B3A] text-slate-100 lg:flex">
			<div className="flex shrink-0 items-center gap-3 border-b border-white/10 px-6 py-7">
				<div className="admin-shadow-glow flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl">
					<Logo
						src="/favicon-trans.png"
						alt="SA’A SMART WORKS"
						className="h-8 w-8 object-contain"
					/>
				</div>

				<div>
					<p className="text-[10px] font-semibold tracking-[0.24em] text-slate-400 uppercase">
						SA&apos;A SMART
					</p>

					<p className="text-base font-semibold text-white">Administration</p>
				</div>
			</div>

			<nav
				aria-label="Admin navigation"
				className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			>
				{permissions.includes("PERM-DASHBOARD-VIEW") && <Link
					href="/admin"
					aria-current={pathname === "/admin" ? "page" : undefined}
					className={`relative mb-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:pl-4 ${
						pathname === "/admin"
							? "admin-shadow-active bg-white/10 text-white"
							: "text-slate-300 hover:bg-white/[0.06] hover:text-white"
					}`}
				>
					{pathname === "/admin" && (
						<span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-[#FFA64D]" />
					)}

					<HomeIcon className="h-5 w-5 shrink-0" />
					<span>Dashboard</span>
				</Link>}

				<div className="space-y-1">
					{visibleGroups.map(({ label, icon: Icon, links }) => {
						const isOpen = openGroup === label;

						const isGroupActive = links.some(({ href }) => isRouteActive(href));

						return (
							<div key={label}>
								<button
									type="button"
									onClick={() => toggleGroup(label)}
									aria-expanded={isOpen}
									className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 hover:pl-4 ${
										isGroupActive
											? "bg-white/[0.06] text-white"
											: "text-slate-300 hover:bg-white/[0.06] hover:text-white"
									}`}
								>
									<Icon className="h-5 w-5 shrink-0" />

									<span className="flex-1">{label}</span>

									<ChevronDownIcon
										className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
											isOpen ? "rotate-0" : "rotate-180"
										}`}
									/>
								</button>

								{isOpen && (
									<div className="mt-1 ml-5 space-y-1 border-l border-white/10 pl-4">
										{links.map(({ label: linkLabel, href }) => {
											const isActive = isRouteActive(href);

											return (
												<Link
													key={href}
													href={href}
													aria-current={isActive ? "page" : undefined}
													className={`group/link relative flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-all duration-200 hover:pl-4 ${
														isActive
															? "admin-shadow-active bg-white/10 font-medium text-white"
															: "text-slate-400 hover:bg-white/[0.06] hover:text-white"
													}`}
												>
													<span
														className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
															isActive
																? "bg-[#FFA64D]"
																: "bg-slate-600 group-hover/link:bg-slate-400"
														}`}
													/>

													<span>{linkLabel}</span>
												</Link>
											);
										})}
									</div>
								)}
							</div>
						);
					})}
				</div>
			</nav>
		</aside>
	);
}
