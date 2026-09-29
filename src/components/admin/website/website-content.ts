import type { ContentField } from "./content-editor";
export const aboutFields: ContentField[] = [
 { key: "headline", label: "Headline", value: "A modern professional services company rooted in Maiduguri." },
 { key: "introduction", label: "Introduction", multiline: true, value: "SA’A SMART WORKS was established in 2025 to help individuals, SMEs, NGOs, CSOs, community organizations, and institutions work more effectively." },
 { key: "section-heading", label: "Who we are — heading", value: "Professional services with local understanding." },
 { key: "body", label: "Who we are — description", multiline: true, value: "We combine practical consultancy, capacity building, digital assistance, and creative production with an understanding of the operating context in Borno State and Northeast Nigeria." },
 { key: "goal", label: "Our goal", multiline: true, value: "Our goal is straightforward: help people and organizations present themselves professionally, improve their systems, and deliver their work with greater confidence." },
];
export const contactFields: ContentField[] = [
 { key: "email", label: "Email address", value: "saasmartworks@gmail.com" },
 { key: "location", label: "Location", value: "Maiduguri, Borno State, Nigeria" },
 { key: "hours", label: "Opening hours", value: "Monday to Friday, 8:00 AM to 6:00 PM WAT" },
];
export const faqFields: ContentField[] = [
 { key: "question-1", label: "Question 01", value: "What kind of organizations do you support?" },
 { key: "answer-1", label: "Answer 01", multiline: true, value: "We support individuals, SMEs, NGOs, CSOs, community organizations, and institutions with practical consultancy, digital, training, documentation, and creative services." },
 { key: "question-2", label: "Question 02", value: "Can I request more than one service?" },
 { key: "answer-2", label: "Answer 02", multiline: true, value: "Yes. Many projects benefit from a combination of services. Tell us what you are trying to achieve and we will help shape the right scope." },
 { key: "question-3", label: "Question 03", value: "Do you work outside Maiduguri?" },
 { key: "answer-3", label: "Answer 03", multiline: true, value: "We are based in Maiduguri and support clients across Borno State and beyond. Some work can be delivered remotely, depending on the service and project requirements." },
 { key: "question-4", label: "Question 04", value: "How do I start an engagement?" },
 { key: "answer-4", label: "Answer 04", multiline: true, value: "Start with an inquiry. Share your needs, timeline, and any relevant context, and our team can help identify the most practical next step." },
];

