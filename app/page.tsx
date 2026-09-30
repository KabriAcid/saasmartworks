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
			<section className="hero-band py-28 pb-24 max-compact:py-18">
				<div className="shell hero-content">
					<p className="eyebrow">Professional &amp; Digital Services</p>
					<h1>Practical support for organizations doing meaningful work.</h1>
					<p className="hero-copy">
						Consultancy, capacity building, digital support, and creative
						services for individuals, SMEs, NGOs, CSOs, and institutions across
						Borno State and beyond.
					</p>
					<div className="mt-8 flex flex-wrap gap-action-gap">
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
				<div className="shell grid grid-cols-1 items-stretch gap-8 nav:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)] nav:gap-feature-gap">
					<div className="py-4 max-nav:py-0">
						<p className="eyebrow">Why work with us</p>
						<h2>Organized, professional, and capable.</h2>
						<p className="max-w-copy text-muted text-lead">
							We bring structure, modern tools, and practical local
							understanding to every engagement, whether you need one focused
							service or a joined-up solution.
						</p>
						<div className="mt-8 grid grid-cols-2 gap-3">
							{whyProofs.map(({ label, Icon }, index) => (
								<div
									className="grid min-h-28 content-between gap-proof-gap rounded-2xl border border-glass-border bg-glass p-4 shadow-proof backdrop-blur-[16px]"
									key={label}
								>
									<span className="grid size-9 place-items-center rounded-icon bg-primary/[0.16] text-primary-icon">
										<Icon className="h-[1.15rem] w-[1.15rem]" aria-hidden="true" />
									</span>
									<span className="font-label text-primary-icon text-index font-extrabold tracking-[0.1em]">
										{String(index + 1).padStart(2, "0")}
									</span>
									<strong>{label}</strong>
								</div>
							))}
						</div>
					</div>
					<aside className="group relative min-h-96 overflow-hidden rounded-3xl bg-dark shadow-feature nav:min-h-112">
						<Image
							src={eateryPreviewImage.src}
							alt={eateryPreviewImage.alt}
							className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
							fill
							sizes="(max-width: 768px) 100vw, 420px"
						/>
						<div className="eatery-preview-shade" />
						<div className="absolute inset-x-6 bottom-6 text-white">
							<span className="eyebrow mb-[0.65rem] text-primary-soft">Another side of SA'A SMART WORKS</span>
							<h3 className="mb-[0.6rem] text-feature">SA’A Eatery</h3>
							<p className="m-0 max-w-preview-copy text-on-image-muted">
								A future business unit for good food, warm hospitality, and a
								different kind of shared experience.
							</p>
							<span className="mt-status-top inline-flex rounded-full border border-white/30 px-status-x py-status-y font-label text-index font-extrabold tracking-[0.08em] uppercase">
								Coming later
							</span>
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
