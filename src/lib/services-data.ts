export type ServiceCategory = {
	id: string;
	number: string;
	slug: string;
	title: string;
	shortTitle: string;
	tagline: string;
	description: string;
	capabilities: string[];
};

export const serviceCategories: ServiceCategory[] = [
	{
		id: "management-consultancy",
		number: "01",
		slug: "management-consultancy",
		shortTitle: "Management Consultancy",
		title: "Management Consultancy",
		tagline: "Strengthening organizations and building capability.",
		description:
			"Practical consultancy, training, policy, documentation, and institutional support for organizations operating in demanding contexts.",
		capabilities: [
			"Capacity building and structured training",    
			"Training of Trainers",
			"Policy development and review",
			"Proposal and concept note development",
			"Project monitoring and management",
			"Reporting and regulatory compliance",
		],
	},
	{
		id: "digital-services",
		number: "02",
		slug: "digital-services",
		shortTitle: "Digital Services",
		title: "Digital Services",
		tagline: "Practical digital support for everyday operations.",
		description:
			"Hands-on assistance that helps individuals and organizations work more efficiently with technology.",
		capabilities: [
			"Digital support and troubleshooting",
			"Online applications and e-registration",
			"Data entry and form processing",
			"Document formatting and editing",
			"Digital literacy training",
			"System upgrades and optimization",
		],
	},
	{
		id: "printing-branding",
		number: "03",
		slug: "printing-branding",
		shortTitle: "Printing & Branding",
		title: "Printing, Branding & Creative Design",
		tagline: "Professional materials that make an impression.",
		description:
			"Clean, purposeful design and reliable print support from official documents to campaign materials.",
		capabilities: [
			"Document printing and photocopying",
			"Scanning and official layout",
			"Logo and profile design",
			"Banner design and printing",
			"T-shirt branding",
			"Promotional materials",
		],
	},
];

export const trainingAreas = [
	"Child Protection",
	"GBV prevention",
	"Gender mainstreaming",
	"Inclusion",
	"Education in Emergencies",
	"WASH",
	"Livelihoods",
	"Nutrition",
	"Community sensitization",
];

export function getCategoryBySlug(slug: string) {
	return serviceCategories.find((category) => category.slug === slug);
}
