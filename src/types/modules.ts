export interface BusinessUnit {
	id: string;
	slug: string;
	name: string;
	active: boolean;
}

export interface ServiceCategory {
	id: string;
	businessUnitId: string;
	slug: string;
	name: string;
}

export interface Service {
	id: string;
	categoryId: string;
	slug: string;
	name: string;
	description: string;
	active: boolean;
	sortOrder: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface Contact {
	id: string;
	name: string;
	email: string;
	phone?: string;
	organization?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface InquiryInput {
	name: string;
	email: string;
	phone?: string;
	organization?: string;
	categoryId: string;
	serviceId: string;
	subject: string;
	message: string;
}

export type InquiryStatus =
	| "NEW"
	| "OPEN"
	| "AWAITING_CUSTOMER"
	| "RESOLVED"
	| "CLOSED";

export interface Inquiry {
	id: string;
	reference: string;
	contactId: string;
	businessUnitId: string;
	categoryId: string;
	serviceId?: string;
	subject: string;
	status: InquiryStatus;
	assignedTo?: string;
	createdAt: Date;
	updatedAt: Date;
}

export type InquiryAuthorType = "CONTACT" | "STAFF";
export type EmailDeliveryStatus =
	| "PENDING"
	| "SENT"
	| "FAILED"
	| "NOT_APPLICABLE";

export interface InquiryMessage {
	id: string;
	inquiryId: string;
	authorType: InquiryAuthorType;
	authorId?: string;
	body: string;
	emailDeliveryStatus: EmailDeliveryStatus;
	createdAt: Date;
}
