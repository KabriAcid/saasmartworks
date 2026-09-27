import type { Metadata } from 'next';
import { serviceCategories } from '@/lib/services-data';

export const metadata: Metadata = { title: 'Contact', description: 'Contact SA’A SMART WORKS about consultancy, digital services, printing, and branding.' };

export default function ContactPage() {
  return (
    <main>
      <section className="page-hero"><div className="shell"><p className="eyebrow">Contact us</p><h1>Tell us what you need.</h1><p className="hero-copy">Share a little about your project or challenge. The inquiry workflow will be connected to the database before this form is presented as live.</p></div></section>
      <section className="shell section-space contact-grid"><div className="section-heading"><p className="eyebrow">Reach SA’A SMART WORKS</p><h2>Professional support from Maiduguri.</h2><p>We serve individuals, SMEs, NGOs, CSOs, community organizations, and institutions across Borno State and beyond.</p><dl className="contact-details"><div><dt>Email</dt><dd>hello@saasmartworks.com</dd></div><div><dt>Location</dt><dd>Maiduguri, Borno State, Nigeria</dd></div><div><dt>Hours</dt><dd>Monday to Friday, 8:00 AM to 6:00 PM WAT</dd></div></dl></div><form className="inquiry-form"><label htmlFor="name">Name<input id="name" name="name" required /></label><label htmlFor="email">Email<input id="email" name="email" type="email" required /></label><label htmlFor="category">Service category<select id="category" name="category" defaultValue=""><option value="" disabled>Select a service</option>{serviceCategories.map((category) => <option value={category.id} key={category.id}>{category.shortTitle}</option>)}</select></label><label htmlFor="message">How can we help?<textarea id="message" name="message" rows={6} required /></label><button className="button" type="submit" disabled>Inquiry submission coming soon</button><p className="form-note">This form is intentionally disabled until server-side validation, storage, and notification are implemented.</p></form></section>
    </main>
  );
}
