"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	ArrowRightIcon,
	Bars3Icon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

const links = [
	["/", "Home"],
	["/services", "Services"],
	["/about", "About"],
	["/contact", "Contact"],
];

export function SiteHeader() {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const isActive = (href: string) =>
		href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

	return (
		<header className="site-header">
			<div className="shell header-inner">
				<Link className="wordmark" href="/">
					<span className="wordmark-name">SA’A</span>
					<span className="wordmark-subtitle">SMART WORKS</span>
				</Link>
				<nav className="desktop-nav" aria-label="Primary navigation">
					{links.map(([href, label]) => (
						<Link
							aria-current={isActive(href) ? "page" : undefined}
							className={isActive(href) ? "active" : ""}
							href={href}
							key={href}
						>
							{label}
						</Link>
					))}
				</nav>
				<Link className="header-cta" href="/contact">
					<span>Start a conversation</span>
					<ArrowRightIcon aria-hidden="true" />
				</Link>
				<button
					aria-controls="mobile-navigation"
					className="menu-button"
					type="button"
					aria-label={open ? "Close menu" : "Open menu"}
					aria-expanded={open}
					onClick={() => setOpen(!open)}
				>
					{open ? <XMarkIcon /> : <Bars3Icon />}
				</button>
			</div>
			{open && (
				<nav className="shell mobile-nav" id="mobile-navigation" aria-label="Mobile navigation">
					{links.map(([href, label]) => (
						<Link
							aria-current={isActive(href) ? "page" : undefined}
							className={isActive(href) ? "active" : ""}
							href={href}
							key={href}
							onClick={() => setOpen(false)}
						>
							{label}
						</Link>
					))}
				</nav>
			)}
		</header>
	);
}
