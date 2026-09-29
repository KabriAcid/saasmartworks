import { notFound } from "next/navigation";
import { inquiryRows, inquiryContacts } from "@/components/admin/inquiries/inquiry-data";
import { InquiryDetails } from "@/components/admin/inquiries/inquiry-details";

export default async function InquiryPage({ params }: { params: Promise<{ id: string }> }) {
 const { id } = await params;
 const inquiry = inquiryRows.find(item => item.id === id);
 if (!inquiry) notFound();
 return <InquiryDetails inquiry={inquiry} contact={inquiryContacts[inquiry.contactId]} />;
}
