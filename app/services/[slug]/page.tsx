import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { getCategoryBySlug, serviceCategories } from "@/lib/services-data";
import { ImageCarousel } from "@/components/shared/image-carousel";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
	return serviceCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const category = getCategoryBySlug(slug);
	return category
		? { title: category.shortTitle, description: category.description }
		: { title: "Service not found" };
}

export default async function ServiceDetailPage({ params }: PageProps) {
	const { slug } = await params;
	const category = getCategoryBySlug(slug);
	if (!category) notFound();

	return (
		<main>
			<ImageCarousel
				label={category.shortTitle}
				images={[
					{
						src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=85",
						alt: "Team collaborating around a table in a bright workspace",
						credit: "Collaboration",
					},
					{
						src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85",
						alt: "Modern workspace prepared for focused professional work",
						credit: "Professional practice",
					},
					{
						src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=85",
						alt: "Colleagues reviewing ideas and planning a project",
						credit: "Shared direction",
					},
				]}
			/>
			<section className="page-hero">
				<div className="shell">
					<Link className="back-link" href="/services">
						<ArrowLeftIcon aria-hidden="true" /> All services
					</Link>
					<p className="eyebrow">{category.shortTitle}</p>
					<h1>{category.title}</h1>
					<p className="hero-copy mb-5">{category.description}</p>
					<Link className="button" href="/contact">
						Discuss this service <ArrowRightIcon aria-hidden="true" />
					</Link>
				</div>
			</section>
			<section className="shell section-space detail-grid">
				<div className="section-heading">
					<p className="eyebrow">What we cover</p>
					<h2>Practical capability for your next step.</h2>
					<p>
						Our work is structured around clear deliverables, useful systems,
						and the context in which your organization operates.
					</p>
				</div>
				<div className="capability-grid">
					{category.capabilities.map((capability, index) => (
						<div className="detail-capability" key={capability}>
							<span className="service-bullet" aria-hidden="true">
								{String(index + 1).padStart(2, "0")}
							</span>
							<span>{capability}</span>
						</div>
					))}
				</div>
			</section>
			<section className="section-tint section-space">
				<div className="shell two-column">
					<div className="section-heading">
						<p className="eyebrow">Need a tailored approach?</p>
						<h2>Tell us what you are trying to achieve.</h2>
					</div>
					<Link className="button" href="/contact">
						Make an inquiry <ArrowRightIcon aria-hidden="true" />
					</Link>
				</div>
			</section>
		</main>
	);
}
