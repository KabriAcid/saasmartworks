import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { serviceCategories } from "@/lib/services-data";

export function SiteFooter() {
	return (
		<footer className="bg-dark pt-12 text-white">
			<div className="shell grid grid-cols-1 gap-8 pb-10 nav:grid-cols-footer">
				<div className="flex flex-col items-start">
					<Link className="wordmark" href="/">
						<Logo
							src="/favicon-trans.png"
							className="wordmark-mark"
							width={48}
							height={48}
						/>
						<span className="wordmark-name">SA'A SMART WORKS</span>
					</Link>
					<p className="mt-5 mb-6 max-w-sm text-footer-muted">
						Professional and digital services for organizations, institutions,
						and individuals across Nigeria.
					</p>
					<Link
						className="inline-flex items-center gap-2 text-sm font-extrabold text-primary transition-all hover:translate-x-0.5"
						href="/contact"
					>
						Start a conversation{" "}
						<span className="text-base" aria-hidden="true">
							↗
						</span>
					</Link>
				</div>
				<nav
					className="flex flex-col gap-2 font-label text-sm"
					aria-label="Company links"
				>
					<p className="m-0 mb-1.5 text-sm font-extrabold text-white">
						Explore
					</p>
					<Link
						className="text-footer-muted transition-all hover:translate-x-0.5 hover:text-primary"
						href="/"
					>
						Home
					</Link>
					<Link
						className="text-footer-muted transition-all hover:translate-x-0.5 hover:text-primary"
						href="/services"
					>
						Services
					</Link>
					<Link
						className="text-footer-muted transition-all hover:translate-x-0.5 hover:text-primary"
						href="/about"
					>
						About us
					</Link>
					<Link
						className="text-footer-muted transition-all hover:translate-x-0.5 hover:text-primary"
						href="/contact"
					>
						Contact
					</Link>
				</nav>
				<nav
					className="flex flex-col gap-2 font-label text-sm"
					aria-label="Service links"
				>
					<p className="m-0 mb-1.5 text-sm font-extrabold text-white">
						Services
					</p>
					{serviceCategories.map((category) => (
						<Link
							className="text-footer-muted transition-all hover:translate-x-0.5 hover:text-primary"
							href={`/services/${category.slug}`}
							key={category.id}
						>
							{category.shortTitle}
						</Link>
					))}
				</nav>
				<div className="flex flex-col gap-2 font-label text-sm">
					<p className="m-0 mb-1.5 text-sm font-extrabold text-white">
						Contact
					</p>
					<p className="m-0 max-w-sm text-footer-muted">
						Maiduguri, Borno State, Nigeria
					</p>
					<a
						className="text-footer-muted transition-all hover:translate-x-0.5 hover:text-primary"
						href="mailto:saasmartworks@gmail.com"
					>
						saasmartworks@gmail.com
					</a>
					<p className="m-0 text-footer-muted">
						Monday to Friday
						<br />
						8:00 AM to 6:00 PM WAT
					</p>
				</div>
			</div>
			<div className="shell flex flex-col gap-4 border-t border-footer-divider py-5 font-label text-xs text-footer-subtle nav:flex-row nav:justify-between">
				<span>© {new Date().getFullYear()} SA'A SMART WORKS</span>
				<span>Professional &amp; Digital Services · Maiduguri, Nigeria</span>
			</div>
		</footer>
	);
}
