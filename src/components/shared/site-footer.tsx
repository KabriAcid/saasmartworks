import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export function SiteFooter() {
	return (
		<footer className="site-footer">
			<div className="shell footer-grid">
				<div>
					<Link className="wordmark" href="/">
						<Logo src="/favicon.png" className="wordmark-mark" width={36} height={36} />
						<span className="wordmark-copy">
							<span className="wordmark-name">SA’A</span>
							<span className="wordmark-subtitle">SMART WORKS</span>
						</span>
					</Link>
					<p>
						Professional and digital services for organizations, institutions,
						and individuals.
					</p>
				</div>
				<div>
					<p className="footer-label">Explore</p>
					<Link href="/services">Services</Link>
					<Link href="/about">About us</Link>
					<Link href="/contact">Contact</Link>
				</div>
				<div>
					<p className="footer-label">Based in</p>
					<p>Abuja, Nigeria</p>
					<p>saasmartworks@gmail.com</p>
				</div>
			</div>
			<div className="shell footer-bottom">
				<span>© {new Date().getFullYear()} SAASMARTWORKS</span>
				<span>Professional &amp; Digital Services</span>
			</div>
		</footer>
	);
}
