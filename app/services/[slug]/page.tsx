import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { getCategoryBySlug, serviceCategories } from "@/lib/services-data";

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
			<section className="page-hero">
				<div className="shell">
					<Link className="back-link" href="/services">
						<ArrowLeftIcon aria-hidden="true" /> All services
					</Link>
					<p className="eyebrow">{category.shortTitle}</p>
					<h1>{category.title}</h1>
					<p className="hero-copy">{category.description}</p>
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
					{category.capabilities.map((capability) => (
						<div className="content-card capability" key={capability}>
							<CheckCircleIcon aria-hidden="true" />
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
