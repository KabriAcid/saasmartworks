"use client";

import { AdminInput, AdminTextarea, AdminSelect } from "@/components/admin/shared/form-fields";
import { useState } from "react";
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ModuleHeader } from "@/components/admin/shared/module-header";

type ProjectStatus = "PLANNED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
type Project = {
  id: string;
  reference: string;
  name: string;
  client: string;
  description: string;
  manager: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
};

const statusMap: Record<ProjectStatus, { label: string; style: string }> = {
  PLANNED: { label: "Planned", style: "bg-slate-100 text-slate-600" },
  ACTIVE: { label: "Active", style: "bg-blue-50 text-blue-700" },
  COMPLETED: { label: "Completed", style: "bg-emerald-50 text-emerald-700" },
  CANCELLED: { label: "Cancelled", style: "bg-red-50 text-red-700" },
};

const initialProjects: Project[] = [
  { id: "project-1", reference: "PRJ-2026-031", name: "School Management Portal", client: "Northgate Academy", description: "A digital portal for school administration and parent services.", manager: "Abubakar Kabri", status: "ACTIVE", startDate: "2026-02-12", endDate: "2026-06-30" },
  { id: "project-2", reference: "PRJ-2026-029", name: "Corporate Website", client: "Prime Logistics", description: "A polished public website and content management experience.", manager: "Abubakar Kabri", status: "ACTIVE", startDate: "2026-01-20", endDate: "2026-05-15" },
  { id: "project-3", reference: "PRJ-2026-025", name: "Staff Training Programme", client: "Horizon Group", description: "A structured digital skills programme for internal teams.", manager: "Fatima Bello", status: "COMPLETED", startDate: "2025-11-05", endDate: "2026-02-28" },
];

const inputClass = "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-700";

export function ProjectManager() {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"ALL" | ProjectStatus>("ALL");
  const [editor, setEditor] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState<Project | null>(null);
  const [notice, setNotice] = useState("");

  const filtered = projects.filter((project) => {
    const haystack = `${project.reference} ${project.name} ${project.client} ${project.manager}`.toLowerCase();
    return (status === "ALL" || project.status === status) && haystack.includes(search.toLowerCase());
  });

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editor) return;
    setProjects((current) => current.some((item) => item.id === editor.id) ? current.map((item) => item.id === editor.id ? editor : item) : [...current, editor]);
    setNotice(`${editor.reference} saved successfully.`);
    setEditor(null);
  }

  function createProject() {
    setEditor({ id: crypto.randomUUID(), reference: `PRJ-${new Date().getFullYear()}-NEW`, name: "", client: "", description: "", manager: "", status: "PLANNED", startDate: "", endDate: "" });
  }

  return <div className="space-y-6">
    <ModuleHeader title="Projects" description="Coordinate active engagements, timelines, and delivery ownership." group="Service Operations" />
    <section aria-label="Project summary" className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {(Object.keys(statusMap) as ProjectStatus[]).map((key) => <article key={key} className="admin-shadow-soft rounded-2xl bg-white p-5"><span className={`inline-flex rounded-lg px-2 py-1 text-[10px] font-semibold ${statusMap[key].style}`}>{statusMap[key].label}</span><p className="mt-5 text-2xl font-bold text-[#172B3A]">{projects.filter((project) => project.status === key).length}</p></article>)}
    </section>
    <div className="admin-shadow-soft flex flex-col gap-3 rounded-2xl bg-white p-4 sm:flex-row">
      <div className="relative min-w-0 flex-1"><MagnifyingGlassIcon className="absolute top-3 left-3 h-4 w-4 text-slate-400" /><input aria-label="Search projects" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects, clients, or managers" className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pr-3 pl-9 text-xs" /></div>
      <select aria-label="Filter projects by status" value={status} onChange={(event) => setStatus(event.target.value as "ALL" | ProjectStatus)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-600"><option value="ALL">All statuses</option>{Object.entries(statusMap).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select>
      <button type="button" onClick={createProject} className="button"><PlusIcon className="h-4 w-4" />New project</button>
    </div>
    <p role="status" className="text-xs text-slate-500">{notice || `Showing ${filtered.length} of ${projects.length} projects`}</p>
    <section aria-label="Project directory" className="space-y-4">
      {filtered.map((project) => <article key={project.id} className="admin-shadow-soft rounded-2xl bg-white p-5 sm:p-6"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="mb-0! break-words text-xs! font-semibold text-[#172B3A] sm:text-sm!">{project.name}</h3><span className={`rounded-lg px-2 py-1 text-[10px] font-semibold ${statusMap[project.status].style}`}>{statusMap[project.status].label}</span></div><p className="mt-2 text-xs font-medium text-[#FFA64D]">{project.reference} · {project.client}</p><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{project.description}</p><div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500"><span>Manager: {project.manager || "Unassigned"}</span><span>{project.startDate || "No start date"} — {project.endDate || "No end date"}</span></div></div><div className="flex shrink-0 items-center gap-1"><button type="button" aria-label={`Edit ${project.name}`} onClick={() => setEditor({ ...project })} className="cursor-pointer rounded-lg p-2 text-slate-500 hover:bg-slate-100"><PencilSquareIcon className="h-4 w-4" /></button><button type="button" aria-label={`Delete ${project.name}`} onClick={() => setDeleting(project)} className="cursor-pointer rounded-lg p-2 text-red-600 hover:bg-red-50"><TrashIcon className="h-4 w-4" /></button></div></div></article>)}
      {!filtered.length && <div className="admin-shadow-soft rounded-2xl bg-white px-6 py-14 text-center"><p className="text-sm text-slate-600">No projects found</p><p className="mt-1 text-xs text-slate-500">Try a different search or create a new project.</p></div>}
    </section>
    {editor && <div className="fixed inset-0 z-50 grid place-items-center bg-[#172B3A]/40 p-4 backdrop-blur-sm"><div role="dialog" aria-modal="true" className="admin-shadow-popover max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 sm:p-6"><div className="flex items-start justify-between"><div><h3 className="text-sm! font-semibold text-[#172B3A]">{projects.some((item) => item.id === editor.id) ? "Edit" : "New"} project</h3><p className="mt-1 text-xs text-slate-500">Keep the project record and delivery details current.</p></div><button type="button" aria-label="Close" onClick={() => setEditor(null)} className="cursor-pointer"><XMarkIcon className="h-5 w-5 text-slate-500" /></button></div><form onSubmit={save} className="mt-5 space-y-4"><div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs font-semibold text-slate-700">Reference<AdminInput fieldLabel="Reference" required value={editor.reference} onChange={(event) => setEditor({ ...editor, reference: event.target.value })} className={inputClass} /></label><label className="block text-xs font-semibold text-slate-700">Project name<AdminInput fieldLabel="Project name" required value={editor.name} onChange={(event) => setEditor({ ...editor, name: event.target.value })} className={inputClass} /></label></div><div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs font-semibold text-slate-700">Client<AdminInput fieldLabel="Client" required value={editor.client} onChange={(event) => setEditor({ ...editor, client: event.target.value })} className={inputClass} /></label><label className="block text-xs font-semibold text-slate-700">Manager<AdminInput fieldLabel="Manager" value={editor.manager} onChange={(event) => setEditor({ ...editor, manager: event.target.value })} className={inputClass} /></label></div><label className="block text-xs font-semibold text-slate-700">Description<AdminTextarea fieldLabel="Description" required rows={3} value={editor.description} onChange={(event) => setEditor({ ...editor, description: event.target.value })} className={inputClass} /></label><div className="grid gap-4 sm:grid-cols-3"><label className="block text-xs font-semibold text-slate-700">Status<AdminSelect fieldLabel="Status" value={editor.status} onChange={(event) => setEditor({ ...editor, status: event.target.value as ProjectStatus })} className={inputClass}>{Object.entries(statusMap).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</AdminSelect></label><label className="block text-xs font-semibold text-slate-700">Start date<AdminInput fieldLabel="Start date" type="date" value={editor.startDate} onChange={(event) => setEditor({ ...editor, startDate: event.target.value })} className={inputClass} /></label><label className="block text-xs font-semibold text-slate-700">End date<AdminInput fieldLabel="End date" type="date" value={editor.endDate} onChange={(event) => setEditor({ ...editor, endDate: event.target.value })} className={inputClass} /></label></div><div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={() => setEditor(null)} className="cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100">Cancel</button><button type="submit" className="button">Save project</button></div></form></div></div>}
    {deleting && <div className="fixed inset-0 z-50 grid place-items-center bg-[#172B3A]/40 p-4 backdrop-blur-sm"><div role="alertdialog" aria-modal="true" className="admin-shadow-popover w-full max-w-md rounded-2xl bg-white p-6"><h3 className="text-sm! font-semibold text-[#172B3A]">Delete project?</h3><p className="mt-3 text-sm leading-6 text-slate-500">Remove {deleting.reference} from this session?</p><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setDeleting(null)} className="cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100">Cancel</button><button type="button" onClick={() => { setProjects((current) => current.filter((item) => item.id !== deleting.id)); setNotice(`${deleting.reference} deleted successfully.`); setDeleting(null); }} className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white">Delete</button></div></div></div>}
  </div>;
}
