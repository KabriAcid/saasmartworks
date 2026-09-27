import { ArrowRightIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { serviceCategories, trainingAreas } from "@/lib/services-data";

export default function HomePage() {
	return (
		<main>
			<section className="hero-band">
				<div className="shell hero-content">
					<p className="eyebrow">
						Professional &amp; Digital Services · Maiduguri
					</p>
					<h1>Practical support for organizations doing meaningful work.</h1>
					<p className="hero-copy">
						Consultancy, capacity building, digital support, and creative
						services for individuals, SMEs, NGOs, CSOs, and institutions across
						Borno State and beyond.
					</p>
					<div className="action-row">
						<Link className="button button-secondary" href="/services">
							Explore services
						</Link>
						<Link className="button" href="/contact">
							Make an inquiry <ArrowRightIcon aria-hidden="true" />
						</Link>
					</div>
				</div>
			</section>

			<section
				className="shell section-space"
				aria-labelledby="services-heading"
			>
				<div className="section-heading">
					<p className="eyebrow">What we do</p>
					<h2 id="services-heading">
						Three areas of expertise, one trusted partner.
					</h2>
					<p>
						Structured support for the practical needs of modern organizations.
					</p>
				</div>
				<div className="card-grid">
					{serviceCategories.map((category) => (
						<Link
							className="content-card"
							href={`/services/${category.slug}`}
							key={category.id}
						>
							<span className="card-number">{category.number}</span>
							<h3>{category.shortTitle}</h3>
							<p>{category.tagline}</p>
							<span className="text-link">
								Explore category <ArrowRightIcon aria-hidden="true" />
							</span>
						</Link>
					))}
				</div>
			</section>

			<section className="section-tint section-space">
				<div className="shell two-column">
					<div className="section-heading">
						<p className="eyebrow">Why work with us</p>
						<h2>Organized, professional, and capable.</h2>
						<p>
							We bring structure, modern tools, and practical local
							understanding to every engagement.
						</p>
					</div>
					<div className="check-list">
						{[
							"Context-aware solutions",
							"Professional documentation",
							"Hands-on digital support",
							"Support across sectors",
						].map((item) => (
							<p key={item}>
								<CheckCircleIcon aria-hidden="true" />
								{item}
							</p>
						))}
					</div>
				</div>
			</section>

			<section className="shell section-space">
				<div className="dark-band">
					<div>
						<p className="eyebrow">Training expertise</p>
						<h2>Specialized knowledge for complex contexts.</h2>
					</div>
					<div className="tag-list">
						{trainingAreas.slice(0, 8).map((area) => (
							<span key={area}>{area}</span>
						))}
					</div>
				</div>
			</section>
		</main>
	);
}
