import type { Inquiry } from "@/types/modules";
import { GuestInbox } from "./guest-inbox";
export function InquiryDirectory({ inquiries, contacts }: { inquiries: Inquiry[]; contacts: Record<string, { name: string; email: string }> }) {
  return <GuestInbox initialConversations={inquiries.map(item => ({
    id: item.id, reference: item.reference, subject: item.subject, status: item.status,
    name: contacts[item.contactId]?.name ?? "Website visitor", email: contacts[item.contactId]?.email ?? "",
  }))} />;
}
