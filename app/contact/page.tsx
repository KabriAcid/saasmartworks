import type { Metadata } from "next";
import { serviceCategories } from "@/lib/services-data";
import { ImageCarousel } from "@/components/shared/image-carousel";
import { siteCarouselImages } from "@/lib/site-media";

export const metadata: Metadata = {
	title: "Contact",
	description:
		"Contact SA’A SMART WORKS about consultancy, digital services, printing, and branding.",
};

export default function ContactPage() {
	return (
		<main>
			<ImageCarousel
				label="Start a conversation"
				description="Tell us what you are trying to achieve and let us help shape the next step."
				images={siteCarouselImages}
			/>
			<section className="page-hero">
				<div className="shell">
					<p className="eyebrow">Contact us</p>
					<h1>Tell us what you need.</h1>
					<p className="hero-copy">
						Share a little about your project or challenge. The inquiry workflow
						will be connected to the database before this form is presented as
						live.
					</p>
				</div>
			</section>
			<section className="shell section-space contact-grid">
				<div className="section-heading">
					<p className="eyebrow">Reach SA’A SMART WORKS</p>
					<h2>Professional support from Maiduguri.</h2>
					<p>
						We serve individuals, SMEs, NGOs, CSOs, community organizations, and
						institutions across Borno State and beyond.
					</p>
					<dl className="contact-details">
						<div>
							<dt>Email</dt>
							<dd>saasmartworks@gmail.com</dd>
						</div>
						<div>
							<dt>Location</dt>
							<dd>Maiduguri, Borno State, Nigeria</dd>
						</div>
						<div>
							<dt>Hours</dt>
							<dd>Monday to Friday, 8:00 AM to 6:00 PM WAT</dd>
						</div>
					</dl>
				</div>
				<form className="inquiry-form" aria-describedby="inquiry-status">
					<label htmlFor="name">
						<span className="field-label">Name</span>
						<input
							id="name"
							name="name"
							autoComplete="name"
							placeholder="Your full name"
							required
						/>
					</label>
					<label htmlFor="organization">
						<span className="field-label">
							Organization <span className="field-optional">(optional)</span>
						</span>
						<input
							id="organization"
							name="organization"
							autoComplete="organization"
							placeholder="Organization or institution"
						/>
					</label>
					<label htmlFor="email">
						<span className="field-label">Email</span>
						<input
							id="email"
							name="email"
							type="email"
							autoComplete="email"
							placeholder="you@example.com"
							required
						/>
					</label>
					<label htmlFor="phone">
						<span className="field-label">
							Phone <span className="field-optional">(optional)</span>
						</span>
						<input
							id="phone"
							name="phone"
							type="tel"
							autoComplete="tel"
							placeholder="+234 800 000 0000"
						/>
					</label>
					<label htmlFor="categoryId">
						<span className="field-label">Service category</span>
						<select id="categoryId" name="categoryId" defaultValue="" required>
							<option value="" disabled>
								Select a service
							</option>
							{serviceCategories.map((category) => (
								<option value={category.id} key={category.id}>
									{category.shortTitle}
								</option>
							))}
						</select>
					</label>
					<label htmlFor="serviceId">
						<span className="field-label">Specific service</span>
						<select id="serviceId" name="serviceId" defaultValue="" required>
							<option value="" disabled>
								Select an area of help
							</option>
							{serviceCategories.flatMap((category) =>
								category.capabilities.map((capability) => (
									<option
										value={capability}
										key={`${category.id}-${capability}`}
									>
										{capability}
									</option>
								)),
							)}
						</select>
					</label>
					<label className="field-wide" htmlFor="subject">
						<span className="field-label">Subject</span>
						<input
							id="subject"
							name="subject"
							placeholder="What would you like help with?"
							required
						/>
					</label>
					<label className="field-wide" htmlFor="message">
						<span className="field-label">How can we help?</span>
						<textarea
							id="message"
							name="message"
							rows={6}
							placeholder="Tell us about your project, timeline, or challenge."
							required
						/>
					</label>
					<button className="button" type="submit" disabled>
						Inquiry submission coming soon
					</button>
					<p className="form-note" id="inquiry-status" role="status">
						This form is intentionally disabled until server-side validation,
						storage, and notification are implemented.
					</p>
				</form>
			</section>
		</main>
	);
}
