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
				<div className="mt-8 flex w-full flex-col items-stretch gap-5">
					{serviceCategories.map((category) => (
						<article
							className="service-card relative grid min-h-0 w-full grid-cols-1 items-stretch gap-6 p-service-card nav:min-h-72 nav:gap-7"
							key={category.id}
						>
							<div className="flex items-center justify-between gap-4">
								<div
									className="grid size-16 place-items-center rounded-service-icon border border-primary/30 bg-primary/15 text-primary-icon"
									aria-hidden="true"
								>
									{(() => {
										const Icon =
											categoryIcons[category.id as keyof typeof categoryIcons];
										return <Icon className="size-8" />;
									})()}
								</div>
								<span className="card-number">/ {category.number}</span>
							</div>
							<div>
								<p className="eyebrow mt-0! mb-0! text-primary-strong!">
									{category.shortTitle}
								</p>
								<h2 className="mt-2! mb-3! text-2xl! md:text-3xl!">
									{category.title}
								</h2>
								<p className="m-0 max-w-xl text-muted">
									{category.description}
								</p>
							</div>
							<ul className="m-0 grid w-full list-none grid-cols-1 gap-3 p-0 nav:grid-cols-2">
								{category.capabilities.map((capability, index) => (
									<li
										className="flex min-h-13 w-full items-center gap-3 rounded-xl border border-ink/10 bg-white/40 px-3 py-2.5 font-label text-sm leading-snug text-muted"
										key={capability}
									>
										<span className="grid size-7 shrink-0 place-items-center rounded-service-bullet bg-primary-bullet text-index font-extrabold tracking-bullet text-primary-strong" aria-hidden="true">
											{String(index + 1).padStart(2, "0")}
										</span>
										<span>{capability}</span>
									</li>
								))}
							</ul>
							<div className="flex items-center justify-between gap-3 border-t border-ink/10 pt-5 font-label text-xs font-bold text-muted">
								<span>Explore this discipline</span>
								<Link
									className="grid size-10 flex-none place-items-center rounded-full border border-primary-link/30 bg-primary text-ink transition-transform hover:translate-x-0.5"
									href={`/services/${category.slug}`}
									aria-label={`Explore ${category.shortTitle}`}
								>
									<ArrowRightIcon className="size-4" aria-hidden="true" />
								</Link>
							</div>
						</article>
					))}
				</div>
			</section>
		</main>
	);
}
