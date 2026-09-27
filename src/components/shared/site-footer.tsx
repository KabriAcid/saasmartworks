import Link from "next/link";

export function SiteFooter() {
	return (
		<footer className="site-footer">
			<div className="shell footer-grid">
				<div>
					<Link className="wordmark" href="/">
						SA’A <span>SMART WORKS</span>
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
					<p>Maiduguri, Borno State, Nigeria</p>
					<p>hello@saasmartworks.com</p>
				</div>
			</div>
			<div className="shell footer-bottom">
				<span>© {new Date().getFullYear()} SA’A SMART WORKS</span>
				<span>Professional &amp; Digital Services</span>
			</div>
		</footer>
	);
}
