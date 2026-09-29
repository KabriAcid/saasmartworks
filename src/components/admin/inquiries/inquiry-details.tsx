import Link from "next/link";
import type { Inquiry } from "@/types/modules";
import { GuestInbox } from "./guest-inbox";
export function InquiryDetails({ inquiry, contact }: { inquiry: Inquiry; contact?: { name: string; email: string } }) {
  return <div className="space-y-5"><Link href="/admin/inquiries" className="text-sm text-slate-600">← All inquiries</Link><GuestInbox initialConversations={[{
    id: inquiry.id, reference: inquiry.reference, subject: inquiry.subject, status: inquiry.status,
    name: contact?.name ?? "Website visitor", email: contact?.email ?? "",
  }]} /></div>;
}
