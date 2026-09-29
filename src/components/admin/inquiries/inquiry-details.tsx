import Link from "next/link";
import { ArrowLeftIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import type { Inquiry } from "@/types/modules";
import { serviceCategories } from "@/lib/services-data";
import { ModuleHeader } from "@/components/admin/shared/module-header";
import { inquiryStatuses } from "./inquiry-data";

export function InquiryDetails({ inquiry, contact }: { inquiry: Inquiry; contact?: { name: string; email: string } }) {
 const status = inquiryStatuses[inquiry.status];
 const fields = [["Reference", inquiry.reference], ["Customer", contact?.name], ["Email", contact?.email], ["Category", serviceCategories.find(category => category.id === inquiry.categoryId)?.title], ["Assigned to", inquiry.assignedTo ?? "Unassigned"]];
 return <div className="space-y-6">
  <Link href="/admin/inquiries" className="inline-flex items-center gap-2 rounded-lg text-xs font-semibold text-slate-500"><ArrowLeftIcon className="h-3.5 w-3.5" />All inquiries</Link>
  <ModuleHeader title={inquiry.subject} description={inquiry.reference} group="Customers" />
  <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
   <section className="admin-shadow-soft overflow-hidden rounded-2xl bg-white"><div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6"><h3 className="text-xs! font-semibold text-[#172B3A] sm:text-sm!">Conversation</h3><span className={`rounded-lg px-2 py-1 text-[10px] font-semibold ${status.style}`}>{status.label}</span></div><div className="px-6 py-16 text-center"><ChatBubbleLeftRightIcon className="mx-auto h-8 w-8 text-slate-400" /><p className="mt-3 text-sm font-medium text-slate-600">No messages to display</p><p className="mt-1 text-xs text-slate-500">Messages associated with this inquiry will appear here.</p></div></section>
   <section className="admin-shadow-soft rounded-2xl bg-white p-5 sm:p-6"><h3 className="text-xs! font-semibold text-[#172B3A] sm:text-sm!">Inquiry details</h3><dl className="mt-4 divide-y divide-slate-100">{fields.map(([label, value]) => <div key={label} className="py-3"><dt className="text-[11px] text-slate-500">{label}</dt><dd className="mt-1 break-words text-xs font-medium text-slate-700">{value || "—"}</dd></div>)}</dl></section>
  </div>
 </div>;
}
