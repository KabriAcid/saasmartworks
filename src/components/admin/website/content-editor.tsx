"use client";
import { useState } from "react";
import { ArrowDownTrayIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { ModuleHeader } from "@/components/admin/shared/module-header";

export type ContentField = { key: string; label: string; value: string; multiline?: boolean };
export function ContentEditor({ title, description, href, fields }: { title: string; description: string; href: string; fields: ContentField[] }) {
 const [values, setValues] = useState(() => Object.fromEntries(fields.map(field => [field.key, field.value])));
 const [view, setView] = useState<"edit" | "review">("edit");
 const [notice, setNotice] = useState("");
 const dirty = fields.some(field => values[field.key] !== field.value);
 function download() {
  const url = URL.createObjectURL(new Blob([JSON.stringify(values, null, 2)], { type: "application/json" }));
  const link = document.createElement("a"); link.href = url; link.download = title.toLowerCase().replaceAll(" ", "-") + "-draft.json"; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  setNotice("Draft downloaded. Website content has not changed.");
 }
 return <div className="space-y-6">
  <ModuleHeader title={title} description={description} href={href} />
  <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
   <section className="admin-shadow-soft min-w-0 overflow-hidden rounded-2xl bg-white">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
     <h3 className="mb-0! text-xs! font-semibold text-[#172B3A] sm:text-sm!">Page content</h3>
     <div className="flex gap-1 rounded-lg bg-slate-50 p-1">{(["edit", "review"] as const).map(mode => <button key={mode} type="button" aria-pressed={view === mode} onClick={() => setView(mode)} className={`rounded-md px-3 py-1.5 text-xs font-medium ${view === mode ? "bg-white text-[#172B3A] shadow-sm" : "text-slate-500"}`}>{mode === "edit" ? "Edit content" : "Review"}</button>)}</div>
    </div>
    <div className="space-y-5 p-5 sm:p-6">{fields.map(field => <div key={field.key}>
     <label htmlFor={field.key} className="mb-2 block text-xs font-semibold text-slate-700">{field.label}</label>
     {view === "review" ? <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">{values[field.key] || "—"}</p> : field.multiline ? <textarea id={field.key} rows={4} value={values[field.key]} onChange={event => setValues({ ...values, [field.key]: event.target.value })} className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm leading-6 text-slate-700" /> : <input id={field.key} value={values[field.key]} onChange={event => setValues({ ...values, [field.key]: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-700" />}
    </div>)}</div>
   </section>
   <aside className="admin-shadow-soft rounded-2xl bg-white p-5 sm:p-6">
    <h3 className="text-xs! font-semibold text-[#172B3A] sm:text-sm!">Content workspace</h3>
    <p className="mt-2 text-xs leading-6 text-slate-500">Review wording and download your changes as a draft. Edits stay on this page until you leave; they do not update the website.</p>
    <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600" role="status">{dirty ? "You have unsaved changes." : "No changes to this content."}</p>
    <button type="button" onClick={download} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#FFA64D] px-3 py-2.5 text-xs font-semibold text-[#172B3A]"><ArrowDownTrayIcon className="h-4 w-4" />Download draft</button>
    <button type="button" disabled={!dirty} onClick={() => { setValues(Object.fromEntries(fields.map(field => [field.key, field.value]))); setNotice(""); }} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-40"><ArrowPathIcon className="h-4 w-4" />Reset changes</button>
    <p role="status" className="mt-3 text-xs leading-5 text-slate-500">{notice}</p>
   </aside>
  </div>
 </div>;
}

