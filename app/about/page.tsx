import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { ImageCarousel } from "@/components/shared/image-carousel";
import { siteCarouselImages } from "@/lib/site-media";

export const metadata: Metadata = {
	title: "About",
	description:
		"Learn about SA’A SMART WORKS and the people and organizations we serve.",
};

const principles = [
	[
		"Practical over theoretical",
		"We focus on approaches that work in the real conditions organizations face in Borno State and beyond.",
	],
	[
		"Capacity over dependency",
		"We strengthen teams and systems so useful knowledge stays with the people doing the work.",
	],
	[
		"Quality without pretense",
		"We bring professional standards to every deliverable, from a proposal to a printed campaign material.",
	],
];

export default function AboutPage() {
	return (
		<main>
			<ImageCarousel
				label="About SA'A SMART WORKS"
				description="Professional standards, local understanding, and useful support from Maiduguri."
				images={siteCarouselImages}
			/>
			<section className="page-hero">
				<div className="shell">
					<p className="eyebrow">About us</p>
					<h1>A modern professional services company rooted in Maiduguri.</h1>
					<p className="hero-copy">
						SA’A SMART WORKS was established in 2025 to help individuals, SMEs,
						NGOs, CSOs, community organizations, and institutions work more
						effectively.
					</p>
				</div>
			</section>
			<section className="shell section-space two-column">
				<div className="section-heading">
					<p className="eyebrow">Who we are</p>
					<h2>Professional services with local understanding.</h2>
					<p>
						We combine practical consultancy, capacity building, digital
						assistance, and creative production with an understanding of the
						operating context in Borno State and Northeast Nigeria.
					</p>
					<p>
						Our goal is straightforward: help people and organizations present
						themselves professionally, improve their systems, and deliver their
						work with greater confidence.
					</p>
				</div>
				<aside className="dark-band compact-band">
					<p className="eyebrow">At a glance</p>
					<p>
						<strong>Established</strong>
						<br />
						2025
					</p>
					<p>
						<strong>Based in</strong>
						<br />
						Maiduguri, Borno State
					</p>
					<p>
						<strong>Serving</strong>
						<br />
						Borno State and beyond
					</p>
				</aside>
			</section>
			<section className="section-tint section-space">
				<div className="shell">
					<div className="section-heading">
						<p className="eyebrow">Our principles</p>
						<h2>How we think about the work.</h2>
					</div>
					<div className="card-grid">
						{principles.map(([title, description]) => (
							<article className="content-card" key={title}>
								<CheckCircleIcon aria-hidden="true" />
								<h3>{title}</h3>
								<p>{description}</p>
							</article>
						))}
					</div>
				</div>
			</section>
			<section className="shell section-space action-panel">
				<div>
					<p className="eyebrow">Start a conversation</p>
					<h2>Have a practical challenge to solve?</h2>
				</div>
				<Link className="button" href="/contact">
					Contact us <ArrowRightIcon aria-hidden="true" />
				</Link>
			</section>
		</main>
	);
}
