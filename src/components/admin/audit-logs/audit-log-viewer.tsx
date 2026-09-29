"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ModuleHeader } from "@/components/admin/shared/module-header";

type AuditLog = { id: string; action: string; entityType: string; entityId: string; actor: string; time: string; details: string };
const logs: AuditLog[] = [
  { id: "log-1", action: "Updated", entityType: "Project", entityId: "PRJ-2026-031", actor: "Abubakar Kabri", time: "Today, 10:42 AM", details: "Project progress updated to 72%." },
  { id: "log-2", action: "Issued", entityType: "Invoice", entityId: "INV-2026-012", actor: "Amina Bello", time: "Today, 9:18 AM", details: "Invoice issued to Northgate Academy." },
  { id: "log-3", action: "Created", entityType: "Inquiry", entityId: "INQ-2026-028", actor: "System", time: "Yesterday, 4:36 PM", details: "New customer inquiry received from the website." },
  { id: "log-4", action: "Updated", entityType: "Service", entityId: "service-4", actor: "Amina Bello", time: "Yesterday, 2:11 PM", details: "Service description and publishing status changed." },
  { id: "log-5", action: "Deleted", entityType: "Site setting", entityId: "site.old_phone", actor: "Abubakar Kabri", time: "Mar 27, 2026", details: "Obsolete site setting removed." },
];

export function AuditLogViewer() {
  const [search, setSearch] = useState("");
  const [entity, setEntity] = useState("ALL");
  const visible = logs.filter((log) => (entity === "ALL" || log.entityType === entity) && `${log.action} ${log.entityType} ${log.entityId} ${log.actor} ${log.details}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="space-y-6"><ModuleHeader title="Audit Logs" description="Trace important changes made across the administration portal." group="System" /><div className="admin-shadow-soft flex flex-col gap-3 rounded-2xl bg-white p-4 sm:flex-row"><div className="relative min-w-0 flex-1"><MagnifyingGlassIcon className="absolute top-3 left-3 h-4 w-4 text-slate-400" /><input aria-label="Search audit logs" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search actions, records, or users" className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pr-3 pl-9 text-xs" /></div><select aria-label="Filter audit logs by record type" value={entity} onChange={(event) => setEntity(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-600"><option value="ALL">All record types</option>{Array.from(new Set(logs.map((log) => log.entityType))).map((type) => <option key={type} value={type}>{type}</option>)}</select></div><p className="text-xs text-slate-500">Showing {visible.length} of {logs.length} activity records</p><section aria-label="Audit activity" className="admin-shadow-soft divide-y divide-slate-100 rounded-2xl bg-white">{visible.map((log) => <article key={log.id} className="flex gap-4 p-5 sm:p-6"><div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#FFA64D]" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-x-2 gap-y-1"><p className="text-sm font-semibold text-[#172B3A]">{log.action} {log.entityType.toLowerCase()}</p><span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">{log.entityId}</span></div><p className="mt-2 text-sm leading-6 text-slate-600">{log.details}</p><p className="mt-2 text-xs text-slate-400">By {log.actor} · {log.time}</p></div></article>)}{!visible.length && <div className="px-6 py-14 text-center"><p className="text-sm text-slate-600">No audit activity found</p><p className="mt-1 text-xs text-slate-500">Try a different search or record type.</p></div>}</section></div>;
}
