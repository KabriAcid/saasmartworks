import type { Inquiry } from "@/types/modules";

// Frontend fixtures, shaped by the existing database model.
export const inquiryRows: Inquiry[] = [
 { id: "1", reference: "INQ-2026-0142", contactId: "contact-1", businessUnitId: "demo", categoryId: "digital-services", serviceId: null, subject: "Business website development", status: "NEW", assignedTo: null, isDemo: true, createdAt: 1790553600000, updatedAt: 1790553600000 },
 { id: "2", reference: "INQ-2026-0141", contactId: "contact-2", businessUnitId: "demo", categoryId: "management-consultancy", serviceId: null, subject: "Team capacity building", status: "OPEN", assignedTo: null, isDemo: true, createdAt: 1790553600000, updatedAt: 1790553600000 },
 { id: "3", reference: "INQ-2026-0140", contactId: "contact-3", businessUnitId: "demo", categoryId: "printing-branding", serviceId: null, subject: "Corporate branding materials", status: "AWAITING_CUSTOMER", assignedTo: null, isDemo: true, createdAt: 1790467200000, updatedAt: 1790467200000 },
 { id: "4", reference: "INQ-2026-0139", contactId: "contact-4", businessUnitId: "demo", categoryId: "digital-services", serviceId: null, subject: "Digital support consultation", status: "RESOLVED", assignedTo: null, isDemo: true, createdAt: 1790380800000, updatedAt: 1790380800000 },
];
export const inquiryContacts: Record<string, { name: string; email: string }> = {
 "contact-1": { name: "Amina Yusuf", email: "amina@example.com" },
 "contact-2": { name: "Northgate Academy", email: "northgate@example.com" },
 "contact-3": { name: "Hassan Musa", email: "hassan@example.com" },
 "contact-4": { name: "Prime Logistics", email: "prime@example.com" },
};
export const inquiryStatuses = {
 NEW: { label: "New", style: "bg-orange-50 text-orange-700" },
 OPEN: { label: "Open", style: "bg-blue-50 text-blue-700" },
 AWAITING_CUSTOMER: { label: "Awaiting customer", style: "bg-amber-50 text-amber-700" },
 RESOLVED: { label: "Resolved", style: "bg-emerald-50 text-emerald-700" },
 CLOSED: { label: "Closed", style: "bg-slate-100 text-slate-600" },
} satisfies Record<Inquiry["status"], { label: string; style: string }>;

