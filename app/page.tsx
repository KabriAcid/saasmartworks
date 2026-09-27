import {
	AcademicCapIcon,
	ArrowRightIcon,
	CheckBadgeIcon,
	ComputerDesktopIcon,
	DocumentTextIcon,
	GlobeAltIcon,
	PrinterIcon,
	WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { serviceCategories, trainingAreas } from "@/lib/services-data";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { ImageCarousel } from "@/components/shared/image-carousel";
import { eateryPreviewImage, siteCarouselImages } from "@/lib/site-media";

const categoryIcons = {
	"management-consultancy": AcademicCapIcon,
	"digital-services": ComputerDesktopIcon,
	"printing-branding": PrinterIcon,
} as const;

const whyProofs = [
	{ label: "Context-aware solutions", Icon: GlobeAltIcon },
	{ label: "Professional documentation", Icon: DocumentTextIcon },
	{ label: "Hands-on digital support", Icon: WrenchScrewdriverIcon },
	{ label: "Support across sectors", Icon: CheckBadgeIcon },
];

export default function HomePage() {
	return (
		<main>
			<section className="hero-band">
				<div className="shell hero-content">
					<p className="eyebrow">Professional &amp; Digital Services</p>
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
							{(() => {
								const Icon =
									categoryIcons[category.id as keyof typeof categoryIcons];
								return (
									<span className="content-card-icon">
										<Icon aria-hidden="true" />
									</span>
								);
							})()}
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

			<ImageCarousel
				contained
				label="How we work"
				description="A thoughtful, practical approach to helping people and organizations move forward."
				images={siteCarouselImages}
			/>

			<section className="why-section section-space">
				<div className="shell why-layout">
					<div className="why-content">
						<p className="eyebrow">Why work with us</p>
						<h2>Organized, professional, and capable.</h2>
						<p className="why-lead">
							We bring structure, modern tools, and practical local
							understanding to every engagement, whether you need one focused
							service or a joined-up solution.
						</p>
						<div className="why-proof-grid">
							{whyProofs.map(({ label, Icon }, index) => (
								<div className="why-proof" key={label}>
									<span className="why-proof-icon">
										<Icon aria-hidden="true" />
									</span>
									<span>{String(index + 1).padStart(2, "0")}</span>
									<strong>{label}</strong>
								</div>
							))}
						</div>
					</div>
					<aside className="eatery-preview">
						<Image
							src={eateryPreviewImage.src}
							alt={eateryPreviewImage.alt}
							fill
							sizes="(max-width: 768px) 100vw, 420px"
						/>
						<div className="eatery-preview-shade" />
						<div className="eatery-preview-copy">
							<span className="eyebrow">Another side of SA'A SMART WORKS</span>
							<h3>SA’A Eatery</h3>
							<p>
								A future business unit for good food, warm hospitality, and a
								different kind of shared experience.
							</p>
							<span className="eatery-status">Coming later</span>
						</div>
					</aside>
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

			<FaqAccordion />
		</main>
	);
}
