"use client";
import { AdminFieldIcon } from "@/components/admin/shared/form-fields";
import { useState } from "react";
import type { Inquiry } from "@/types/modules";
import { ModuleHeader } from "@/components/admin/shared/module-header";
import { AdminSelect, AdminTextarea } from "@/components/admin/shared/form-fields";
import { inquiryStatuses } from "./inquiry-data";

export type GuestConversation = { id: string; reference: string; subject: string; name: string; email: string; body?: string; status: Inquiry["status"] };
export function GuestInbox({ initialConversations, title = "Inquiries" }: { initialConversations: GuestConversation[]; title?: string }) {
  const [rows, setRows] = useState(initialConversations);
  const [selected, setSelected] = useState(initialConversations[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const visible = rows.filter(item => (filter === "ALL" || item.status === filter) && `${item.reference} ${item.subject} ${item.name} ${item.email}`.toLowerCase().includes(search.trim().toLowerCase()));
  const current = visible.find(item => item.id === selected) ?? visible[0];
  return <div className="space-y-6">
    <ModuleHeader title={title} description="Review messages from website visitors, track follow-ups, and prepare replies." group="Customers" />
    <div className="admin-shadow-soft flex flex-col gap-3 rounded-2xl bg-white p-4 sm:flex-row">
      <input type="search" aria-label="Search guest messages" placeholder="Search sender, email, subject, or reference" value={search} onChange={event => setSearch(event.target.value)} className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
      <select aria-label="Filter message status" value={filter} onChange={event => setFilter(event.target.value)} className="cursor-pointer rounded-xl border border-slate-200 px-3 py-2.5 text-sm"><option value="ALL">All statuses</option>{Object.entries(inquiryStatuses).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select>
    </div>
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <section aria-label="Incoming messages" className="admin-shadow-soft overflow-hidden rounded-2xl bg-white">
        <h3 className="m-0! border-b border-slate-100 p-5 text-sm! font-semibold">Inbox · {visible.length}</h3>
        {visible.map(item => <button key={item.id} type="button" aria-pressed={current?.id === item.id} onClick={() => { setSelected(item.id); setNotice(""); }} className={`block w-full cursor-pointer border-b border-slate-100 p-5 text-left hover:bg-orange-50/50 ${current?.id === item.id ? "bg-orange-50/70" : ""}`}>
          <span className="block text-sm font-semibold text-[#172B3A]">{item.name}</span><span className="mt-1 block break-words text-xs text-slate-600">{item.subject}</span><span className={`mt-3 inline-block rounded-lg px-2 py-1 text-[10px] font-semibold ${inquiryStatuses[item.status].style}`}>{inquiryStatuses[item.status].label}</span>
        </button>)}
        {!visible.length && <p className="p-8 text-center text-sm text-slate-500">No incoming messages match this view.</p>}
      </section>
      {current && <section aria-label="Selected conversation" className="admin-shadow-soft min-w-0 rounded-2xl bg-white p-5 sm:p-6">
        <p className="text-xs text-slate-500">{current.reference}</p>
        <h3 className="mt-2! break-words text-sm! font-semibold text-[#172B3A]">{current.subject}</h3>
        <p className="mt-2 break-words text-xs text-slate-600">From {current.name} · {current.email}</p>
        <div className="my-5 whitespace-pre-wrap break-words rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{current.body || "No message text is available for this submission."}</div>
        <label className="block text-xs font-semibold text-slate-700"><AdminFieldIcon fieldLabel="Conversation status" />Conversation status<AdminSelect fieldLabel="Conversation status" value={current.status} onChange={event => { const status = event.target.value as Inquiry["status"]; setRows(items => items.map(item => item.id === current.id ? { ...item, status } : item)); setNotice("Conversation status updated."); }} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm">{Object.entries(inquiryStatuses).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</AdminSelect></label>
        <form className="mt-6 space-y-4 border-t border-slate-100 pt-5" onSubmit={event => { event.preventDefault(); if (!(drafts[current.id] ?? "").trim()) return; setNotice("Reply draft retained for this page session. No email has been sent."); }}>
          <label className="block text-xs font-semibold text-slate-700"><AdminFieldIcon fieldLabel="Reply" />Reply to {current.name}<AdminTextarea fieldLabel="Reply" required maxLength={10000} rows={5} value={drafts[current.id] ?? ""} onChange={event => { setDrafts(previous => ({ ...previous, [current.id]: event.target.value })); setNotice(""); }} placeholder="Write a helpful response to the visitor…" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" /></label>
          <button className="button" type="submit">Save reply draft</button>
        </form>
        <p role="status" className="mt-4 text-xs text-slate-500">{notice}</p>
      </section>}
    </div>
  </div>;
}
