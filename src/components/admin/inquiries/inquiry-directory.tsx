"use client";
import { useState } from "react";
import Link from "next/link";
import { MagnifyingGlassIcon, ChatBubbleLeftRightIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import type { Inquiry } from "@/types/modules";
import { ModuleHeader } from "@/components/admin/shared/module-header";
import { inquiryStatuses } from "./inquiry-data";

export function InquiryDirectory({ inquiries, contacts }: { inquiries: Inquiry[]; contacts: Record<string, { name: string; email: string }> }) {
 const [search, setSearch] = useState("");
 const [status, setStatus] = useState("ALL");
 const query = search.trim().toLowerCase();
 const filtered = inquiries.filter(item => (status === "ALL" || item.status === status) && [item.reference, item.subject, contacts[item.contactId]?.name ?? ""].some(value => value.toLowerCase().includes(query)));
 return <div className="space-y-6">
  <ModuleHeader title="Inquiries" description="Keep customer conversations moving, from first contact to resolution." group="Customers" />
  <section aria-label="Inquiry summary" className="grid grid-cols-2 gap-4 xl:grid-cols-4">
   {(["NEW", "OPEN", "AWAITING_CUSTOMER", "RESOLVED"] as const).map(key => <article key={key} className="admin-shadow-soft rounded-2xl bg-white p-5"><span className={`inline-flex rounded-lg px-2 py-1 text-[10px] font-semibold ${inquiryStatuses[key].style}`}>{inquiryStatuses[key].label}</span><p className="mt-5 text-2xl font-bold text-[#172B3A]">{inquiries.filter(item => item.status === key).length}</p></article>)}
  </section>
  <section className="admin-shadow-soft overflow-hidden rounded-2xl bg-white">
   <div className="space-y-4 p-5 sm:p-6"><div><h3 className="text-xs! leading-snug! font-semibold text-[#172B3A] sm:text-sm!">Inquiry inbox</h3><p className="mt-1 text-xs text-slate-500">Find a conversation and review its details.</p></div>
    <div className="flex flex-col gap-3 sm:flex-row"><div className="relative min-w-0 flex-1"><MagnifyingGlassIcon aria-hidden="true" className="absolute top-3 left-3 h-4 w-4 text-slate-400" /><input aria-label="Search inquiries" type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search reference, subject, or customer…" className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pr-3 pl-9 text-xs text-slate-700" /></div><select aria-label="Inquiry status" value={status} onChange={event => setStatus(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-600"><option value="ALL">All statuses</option>{Object.entries(inquiryStatuses).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></div>
   </div>
   <div aria-hidden="true" className="hidden grid-cols-[2fr_1fr_1fr_auto] gap-4 border-y border-slate-100 bg-slate-50/70 px-6 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 md:grid"><span>Inquiry</span><span>Customer</span><span>Status</span><span>View</span></div>
   <ul className="divide-y divide-slate-100">{filtered.map(item => <li key={item.id}><Link href={`/admin/inquiries/${item.id}`} className="grid gap-3 px-5 py-4 transition-colors hover:bg-slate-50/70 sm:px-6 md:grid-cols-[2fr_1fr_1fr_auto] md:items-center md:gap-4"><div className="min-w-0"><p className="text-[11px] font-semibold text-[#172B3A]">{item.reference}</p><p className="mt-1 break-words text-sm text-slate-700">{item.subject}</p></div><p className="text-xs text-slate-500">{contacts[item.contactId]?.name ?? "—"}</p><div><span className={`inline-flex rounded-lg px-2 py-1 text-[10px] font-semibold ${inquiryStatuses[item.status].style}`}>{inquiryStatuses[item.status].label}</span></div><ArrowRightIcon aria-hidden="true" className="h-3.5 w-3.5 text-slate-400" /></Link></li>)}</ul>
   {!filtered.length && <div className="px-6 py-14 text-center"><ChatBubbleLeftRightIcon className="mx-auto h-8 w-8 text-slate-400" /><p className="mt-3 text-sm text-slate-600">{inquiries.length ? "No matching inquiries" : "No inquiries yet"}</p><p className="mt-1 text-xs text-slate-500">Customer conversations will appear here.</p>{inquiries.length > 0 && <button type="button" onClick={() => { setSearch(""); setStatus("ALL"); }} className="mt-4 rounded-lg bg-slate-100 px-3 py-2 text-xs text-[#172B3A]">Clear filters</button>}</div>}
   <p role="status" className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500 sm:px-6">Showing {filtered.length} of {inquiries.length} inquiries</p>
  </section>
 </div>;
}
