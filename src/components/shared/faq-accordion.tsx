"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

type FaqItem = {
	question: string;
	answer: string;
};

const faqItems: FaqItem[] = [
	{
		question: "What kind of organizations do you support?",
		answer:
			"We support individuals, SMEs, NGOs, CSOs, community organizations, and institutions with practical consultancy, digital, training, documentation, and creative services.",
	},
	{
		question: "Can I request more than one service?",
		answer:
			"Yes. Many projects benefit from a combination of services. Tell us what you are trying to achieve and we will help shape the right scope.",
	},
	{
		question: "Do you work outside Maiduguri?",
		answer:
			"We are based in Maiduguri and support clients across Borno State and beyond. Some work can be delivered remotely, depending on the service and project requirements.",
	},
	{
		question: "How do I start an engagement?",
		answer:
			"Start with an inquiry. Share your needs, timeline, and any relevant context, and our team can help identify the most practical next step.",
	},
];

export function FaqAccordion() {
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	return (
		<section
			className="faq-section shell section-space"
			aria-labelledby="faq-heading"
		>
			<div className="faq-intro">
				<p className="eyebrow">Common questions</p>
				<h2 id="faq-heading">A clearer path to the right support.</h2>
				<p>
					Some useful answers before you make an inquiry. We are happy to
					discuss the details of your specific situation.
				</p>
			</div>
			<div className="faq-list">
				{faqItems.map((item, index) => {
					const isOpen = openIndex === index;
					const panelId = `faq-panel-${index}`;
					return (
						<div
							className={`faq-item${isOpen ? " is-open" : ""}`}
							key={item.question}
						>
							<button
								className="faq-trigger"
								type="button"
								aria-controls={panelId}
								aria-expanded={isOpen}
								onClick={() => setOpenIndex(isOpen ? null : index)}
							>
								<span>{item.question}</span>
								<span className="faq-icon" aria-hidden="true">
									<PlusIcon />
								</span>
							</button>
							<div
								className="faq-panel"
								id={panelId}
								role="region"
								aria-hidden={!isOpen}
							>
								<div className="faq-answer">
									<p>{item.answer}</p>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
