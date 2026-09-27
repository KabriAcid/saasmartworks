import { z } from "zod";

export type {
	BusinessUnit,
	Contact,
	Inquiry,
	InquiryInput,
	InquiryMessage,
	InquiryStatus,
	Service,
	ServiceCategory,
} from "@/types/modules";

export const businessUnitSchema = z.object({
	id: z.string().min(1),
	slug: z.string().trim().min(1).max(100),
	name: z.string().trim().min(1).max(200),
	active: z.boolean().default(false),
});

export const serviceCategorySchema = z.object({
	id: z.string().min(1),
	businessUnitId: z.string().min(1),
	slug: z.string().trim().min(1).max(100),
	name: z.string().trim().min(1).max(200),
});

export const serviceSchema = z.object({
	id: z.string().min(1),
	categoryId: z.string().min(1),
	slug: z.string().trim().min(1).max(100),
	name: z.string().trim().min(1).max(200),
	description: z.string().trim().min(1).max(2000),
	active: z.boolean().default(true),
	sortOrder: z.number().int().nonnegative().default(0),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const contactSchema = z.object({
	id: z.string().min(1),
	name: z.string().trim().min(1).max(150),
	email: z.email(),
	phone: z.string().trim().max(40).optional(),
	organization: z.string().trim().max(200).optional(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const inquiryStatusSchema = z.enum([
	"NEW",
	"OPEN",
	"AWAITING_CUSTOMER",
	"RESOLVED",
	"CLOSED",
]);

export const inquiryInputSchema = z.object({
	name: z.string().trim().min(1).max(150),
	email: z.email(),
	phone: z.string().trim().max(40).optional(),
	organization: z.string().trim().max(200).optional(),
	categoryId: z.string().min(1),
	serviceId: z.string().min(1),
	subject: z.string().trim().min(1).max(200),
	message: z.string().trim().min(1).max(10000),
});

export const inquirySchema = z.object({
	id: z.string().min(1),
	reference: z.string().trim().min(1).max(50),
	contactId: z.string().min(1),
	businessUnitId: z.string().min(1),
	categoryId: z.string().min(1),
	serviceId: z.string().min(1).optional(),
	subject: z.string().trim().min(1).max(200),
	status: inquiryStatusSchema,
	assignedTo: z.string().min(1).optional(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const inquiryMessageSchema = z.object({
	id: z.string().min(1),
	inquiryId: z.string().min(1),
	authorType: z.enum(["CONTACT", "STAFF"]),
	authorId: z.string().min(1).optional(),
	body: z.string().trim().min(1).max(10000),
	emailDeliveryStatus: z.enum(["PENDING", "SENT", "FAILED", "NOT_APPLICABLE"]),
	createdAt: z.coerce.date(),
});
