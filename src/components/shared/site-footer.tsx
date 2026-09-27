import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { serviceCategories } from "@/lib/services-data";

export function SiteFooter() {
	return (
		<footer className="site-footer">
			<div className="shell footer-grid">
				<div className="footer-brand">
					<Link className="wordmark" href="/">
						<Logo
							src="/favicon.png"
							className="wordmark-mark"
							width={48}
							height={48}
						/>
						<span className="wordmark-name">SAASMARTWORKS</span>
					</Link>
					<p className="footer-intro">
						Professional and digital services for organizations, institutions,
						and individuals across Nigeria.
					</p>
					<Link className="footer-cta" href="/contact">
						Start a conversation <span aria-hidden="true">↗</span>
					</Link>
				</div>
				<nav aria-label="Company links">
					<p className="footer-label">Explore</p>
					<Link href="/">Home</Link>
					<Link href="/services">Services</Link>
					<Link href="/about">About us</Link>
					<Link href="/contact">Contact</Link>
				</nav>
				<nav aria-label="Service links">
					<p className="footer-label">Services</p>
					{serviceCategories.map((category) => (
						<Link href={`/services/${category.slug}`} key={category.id}>
							{category.shortTitle}
						</Link>
					))}
				</nav>
				<div className="footer-contact">
					<p className="footer-label">Contact</p>
					<p>Maiduguri, Borno State, Nigeria</p>
					<a href="mailto:saasmartworks@gmail.com">saasmartworks@gmail.com</a>
					<p>
						Monday to Friday
						<br />
						8:00 AM to 6:00 PM WAT
					</p>
				</div>
			</div>
			<div className="shell footer-bottom">
				<span>© {new Date().getFullYear()} SAASMARTWORKS</span>
				<span>Professional &amp; Digital Services · Maiduguri, Nigeria</span>
			</div>
		</footer>
	);
}
