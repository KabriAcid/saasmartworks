"use client";
import { useRef, useState } from "react";
import { Dialog, AlertDialog } from "radix-ui";
import { PlusIcon, PencilSquareIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ModuleHeader } from "@/components/admin/shared/module-header";

export type Entry = { id: string; title: string; description: string; bullets?: string[] };
const field = "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-700";
const button = "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold";
type Props = { title: string; singular: string; initialEntries: Entry[]; withBullets?: boolean; faq?: boolean };
export function CollectionManager({ title, singular, initialEntries, withBullets = false, faq = false }: Props) {
 const [entries, setEntries] = useState(initialEntries);
 const [search, setSearch] = useState("");
 const [draft, setDraft] = useState<Entry | null>(null);
 const [deleting, setDeleting] = useState<Entry | null>(null);
 const [editing, setEditing] = useState(false);
 const [error, setError] = useState("");
 const [notice, setNotice] = useState("");
 const focusTarget = useRef<HTMLElement | null>(null);
 const managerRoot = useRef<HTMLDivElement>(null);
 function captureFocus() { focusTarget.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; }
 function restoreFocus(event: Event) {
  event.preventDefault();
  const target = focusTarget.current;
  if (target?.isConnected) target.focus();
  else managerRoot.current?.querySelector<HTMLButtonElement>("button")?.focus();
 }
 const filtered = entries.filter(entry => [entry.title, entry.description, ...(entry.bullets ?? [])].join(" ").toLowerCase().includes(search.trim().toLowerCase()));
 function edit(entry?: Entry) { captureFocus(); setDraft(entry ? { ...entry, bullets: [...(entry.bullets ?? [])] } : { id: crypto.randomUUID(), title: "", description: "", bullets: [] }); setEditing(!!entry); setError(""); }
 function apply(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  if (!draft) return;
  if (!draft.title.trim() || !draft.description.trim()) { setError("Complete both required fields."); return; }
  if (entries.some(entry => entry.id !== draft.id && entry.title.trim().toLowerCase() === draft.title.trim().toLowerCase())) { setError("An entry with this name already exists."); return; }
  const value = { ...draft, title: draft.title.trim(), description: draft.description.trim(), bullets: draft.bullets?.map(item => item.trim()).filter(Boolean) };
  setEntries(current => editing ? current.map(entry => entry.id === value.id ? value : entry) : [...current, value]);
  setNotice(editing ? "Changes applied to this session." : "Entry added to this session."); setDraft(null);
 }
 return <div ref={managerRoot} className="space-y-6">
  <ModuleHeader title={title} description={faq ? "Manage the questions and answers your visitors rely on." : "Manage your website content in one place."} href={faq ? "/#faq-heading" : "/services"} />
  <div className="admin-shadow-soft flex flex-col gap-3 rounded-2xl bg-white p-4 sm:flex-row"><input aria-label={`Search ${title}`} type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder={`Search ${title.toLowerCase()}…`} className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs" /><button type="button" onClick={() => edit()} className={button + " bg-[#FFA64D] text-[#172B3A]"}><PlusIcon className="h-4 w-4" />Add {singular}</button></div>
  <p className="text-xs text-slate-500">Changes stay on this page for this session; they do not publish to the website.</p>
  <p role="status" className="text-xs text-slate-600">{notice || `${filtered.length} of ${entries.length} entries`}</p>
  <div className="space-y-4">{filtered.map(entry => <article key={entry.id} className="admin-shadow-soft overflow-hidden rounded-2xl bg-white">
   <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6"><div className="min-w-0 flex-1"><h3 className="mb-0! break-words text-xs! leading-snug! font-semibold text-[#172B3A] sm:text-sm!">{entry.title}</h3><p className="mt-2 whitespace-pre-wrap break-words text-xs leading-6 text-slate-500">{entry.description}</p></div><div className="flex shrink-0 gap-1"><button type="button" aria-label={`Edit ${entry.title}`} onClick={() => edit(entry)} className={button + " text-slate-600 hover:bg-slate-50"}><PencilSquareIcon className="h-4 w-4" />Edit</button><button type="button" aria-label={`Delete ${entry.title}`} onClick={() => setDeleting(entry)} className={button + " text-red-600 hover:bg-red-50"}><TrashIcon className="h-4 w-4" />Delete</button></div></div>
   {withBullets && <ul className="grid list-disc gap-x-8 gap-y-2 border-t border-slate-100 px-10 py-5 text-xs leading-6 text-slate-600 sm:grid-cols-2">{entry.bullets?.map((bullet, index) => <li key={index} className="break-words pl-1 marker:text-[#FFA64D]">{bullet}</li>)}{!entry.bullets?.length && <li className="list-none text-slate-400">No bullet points added.</li>}</ul>}
  </article>)}</div>
  {!filtered.length && <div className="admin-shadow-soft rounded-2xl bg-white p-12 text-center"><p className="text-sm text-slate-600">{entries.length ? "No matching results" : "No entries yet"}</p><button type="button" onClick={() => search ? setSearch("") : edit()} className={button + " mt-4 bg-slate-100"}>{search ? "Clear search" : `Add ${singular}`}</button></div>}
  <Dialog.Root open={!!draft} onOpenChange={open => { if (!open) setDraft(null); }}><Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-40 bg-[#172B3A]/40 backdrop-blur-sm" /><Dialog.Content className="admin-shadow-popover fixed top-1/2 left-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-5 sm:p-6">
   <Dialog.Title className="pr-8 text-sm! font-semibold text-[#172B3A]">{editing ? "Edit" : "Add"} {singular}</Dialog.Title><Dialog.Description className="mt-2 text-xs text-slate-500">Complete the information below. Required fields are marked *.</Dialog.Description><Dialog.Close aria-label="Close editor" className="absolute top-4 right-4 rounded-lg p-2 hover:bg-slate-100"><XMarkIcon className="h-4 w-4" /></Dialog.Close>
   {draft && <form onSubmit={apply} className="mt-5 space-y-4">
    <label className="block text-xs font-semibold text-slate-700">{faq ? "Question" : "Name"} *<input required value={draft.title} onChange={event => setDraft({ ...draft, title: event.target.value })} className={field} /></label>
    <label className="block text-xs font-semibold text-slate-700">{faq ? "Answer" : "Description"} *<textarea required rows={4} value={draft.description} onChange={event => setDraft({ ...draft, description: event.target.value })} className={field} /></label>
    {withBullets && <label className="block text-xs font-semibold text-slate-700">Bullet points<textarea rows={6} value={draft.bullets?.join("\n") ?? ""} onChange={event => setDraft({ ...draft, bullets: event.target.value.split("\n") })} className={field} /><span className="mt-1 block font-normal text-slate-500">One bullet point per line. Remove a line to delete it.</span></label>}
    {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
    <div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><Dialog.Close type="button" className={button + " hover:bg-slate-100"}>Cancel</Dialog.Close><button type="submit" className={button + " bg-[#FFA64D] text-[#172B3A]"}>{editing ? "Apply changes" : `Add ${singular}`}</button></div>
   </form>}
  </Dialog.Content></Dialog.Portal></Dialog.Root>
  <AlertDialog.Root open={!!deleting} onOpenChange={open => { if (!open) setDeleting(null); }}><AlertDialog.Portal><AlertDialog.Overlay className="fixed inset-0 z-40 bg-[#172B3A]/40 backdrop-blur-sm" /><AlertDialog.Content className="admin-shadow-popover fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6"><AlertDialog.Title className="text-sm! font-semibold text-[#172B3A]">Delete {singular}?</AlertDialog.Title><AlertDialog.Description className="mt-3 break-words text-sm leading-6 text-slate-500">Remove “{deleting?.title}” from this list? Published website content will not change.</AlertDialog.Description><div className="mt-6 flex justify-end gap-2"><AlertDialog.Cancel className={button + " hover:bg-slate-100"}>Cancel</AlertDialog.Cancel><AlertDialog.Action onClick={() => { setEntries(current => current.filter(entry => entry.id !== deleting?.id)); setNotice("Entry removed from this session."); }} className={button + " bg-red-600 text-white"}>Delete</AlertDialog.Action></div></AlertDialog.Content></AlertDialog.Portal></AlertDialog.Root>
 </div>;
}
