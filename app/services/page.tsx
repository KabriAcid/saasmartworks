import type { Metadata } from "next";
import Link from "next/link";
import {
	AcademicCapIcon,
	ArrowRightIcon,
	CheckCircleIcon,
	ComputerDesktopIcon,
	PrinterIcon,
} from "@heroicons/react/24/outline";
import { serviceCategories } from "@/lib/services-data";
import { ImageCarousel } from "@/components/shared/image-carousel";
import { siteCarouselImages } from "@/lib/site-media";

export const metadata: Metadata = {
	title: "Services",
	description:
		"Management consultancy, digital support, and printing and branding services from SA’A SMART WORKS.",
};

const categoryIcons = {
	"management-consultancy": AcademicCapIcon,
	"digital-services": ComputerDesktopIcon,
	"printing-branding": PrinterIcon,
} as const;

export default function ServicesPage() {
	return (
		<main>
			<ImageCarousel
				label="Our services"
				description="Practical consultancy, digital support, and creative production for the work that matters."
				images={siteCarouselImages}
			/>
			<section className="page-hero">
				<div className="shell">
					<p className="eyebrow">Our services</p>
					<h1>Professional support across three practical disciplines.</h1>
					<p className="hero-copy">
						Explore structured consultancy, hands-on digital support, and
						creative production for organizations, institutions, SMEs, and
						individuals.
					</p>
				</div>
			</section>
			<section
				className="shell section-space"
				aria-labelledby="service-list-heading"
			>
				<div className="section-heading">
					<p className="eyebrow">Service categories</p>
					<h2 id="service-list-heading">
						Support shaped around the work you need to do.
					</h2>
				</div>
				<div className="stack-list">
					{serviceCategories.map((category) => (
						<article className="service-card" key={category.id}>
							<div className="service-card-header">
								<div className="service-card-icon" aria-hidden="true">
									{(() => {
										const Icon =
											categoryIcons[category.id as keyof typeof categoryIcons];
										return <Icon />;
									})()}
								</div>
								<span className="card-number">/ {category.number}</span>
							</div>
							<div className="service-card-copy">
								<p className="service-card-kicker">{category.shortTitle}</p>
								<h2>{category.title}</h2>
								<p>{category.description}</p>
							</div>
							<ul className="service-capabilities">
								{category.capabilities.map((capability, index) => (
									<li key={capability}>
										<span className="service-bullet" aria-hidden="true">
											{String(index + 1).padStart(2, "0")}
										</span>
										<span>{capability}</span>
									</li>
								))}
							</ul>
							<div className="service-card-action">
								<span>Explore this discipline</span>
								<Link
									className="service-arrow"
									href={`/services/${category.slug}`}
									aria-label={`Explore ${category.shortTitle}`}
								>
									<ArrowRightIcon aria-hidden="true" />
								</Link>
							</div>
						</article>
					))}
				</div>
			</section>
		</main>
	);
}
