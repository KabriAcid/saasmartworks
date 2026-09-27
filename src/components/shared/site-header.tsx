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
	return (
		<header className="site-header">
			<div className="shell header-inner">
				<Link className="wordmark" href="/">
					SA’A <span>SMART WORKS</span>
				</Link>
				<nav className="desktop-nav" aria-label="Primary navigation">
					{links.map(([href, label]) => (
						<Link
							className={pathname === href ? "active" : ""}
							href={href}
							key={href}
						>
							{label}
						</Link>
					))}
				</nav>
				<Link className="header-cta" href="/contact">
					Make an inquiry <ArrowRightIcon aria-hidden="true" />
				</Link>
				<button
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
				<nav className="mobile-nav" aria-label="Mobile navigation">
					{links.map(([href, label]) => (
						<Link href={href} key={href} onClick={() => setOpen(false)}>
							{label}
						</Link>
					))}
				</nav>
			)}
		</header>
	);
}
