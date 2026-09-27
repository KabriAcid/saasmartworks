import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { serviceCategories } from '@/lib/services-data';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Management consultancy, digital support, and printing and branding services from SA’A SMART WORKS.',
};

export default function ServicesPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="shell">
          <p className="eyebrow">Our services</p>
          <h1>Professional support across three practical disciplines.</h1>
          <p className="hero-copy">Explore structured consultancy, hands-on digital support, and creative production for organizations, institutions, SMEs, and individuals.</p>
        </div>
      </section>
      <section className="shell section-space" aria-labelledby="service-list-heading">
        <div className="section-heading"><p className="eyebrow">Service categories</p><h2 id="service-list-heading">Support shaped around the work you need to do.</h2></div>
        <div className="stack-list">
          {serviceCategories.map((category) => (
            <article className="content-card service-row" key={category.id}>
              <div><span className="card-number">{category.number}</span><h2>{category.title}</h2><p>{category.description}</p></div>
              <ul className="check-list compact">{category.capabilities.map((capability) => <li key={capability}><CheckCircleIcon aria-hidden="true" />{capability}</li>)}</ul>
              <Link className="text-link" href={`/services/${category.slug}`}>View category <ArrowRightIcon aria-hidden="true" /></Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
