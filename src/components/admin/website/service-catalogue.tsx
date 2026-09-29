"use client";
import { useState } from "react";
import Link from "next/link";
import { MagnifyingGlassIcon, ArrowRightIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { serviceCategories } from "@/lib/services-data";
import { ModuleHeader } from "@/components/admin/shared/module-header";

export function ServiceCatalogue({ categoriesOnly = false }: { categoriesOnly?: boolean }) {
 const [search, setSearch] = useState("");
 const [categoryId, setCategoryId] = useState("");
 const query = search.trim().toLowerCase();
 const categories = serviceCategories.filter(category => (!categoryId || category.id === categoryId) && (categoriesOnly ? category.title.toLowerCase().includes(query) : category.capabilities.some(name => name.toLowerCase().includes(query))));
 const count = categoriesOnly ? categories.length : categories.reduce((sum, category) => sum + category.capabilities.filter(name => name.toLowerCase().includes(query)).length, 0);
 return <div className="space-y-6">
  <ModuleHeader title={categoriesOnly ? "Service Categories" : "Services"} description={categoriesOnly ? "Organize the areas of expertise visitors explore." : "Browse the services presented across your website."} href="/services" />
  <div className="admin-shadow-soft flex flex-col gap-3 rounded-2xl bg-white p-4 sm:flex-row sm:items-center">
   <div className="relative min-w-0 flex-1"><MagnifyingGlassIcon aria-hidden="true" className="absolute top-3 left-3 h-4 w-4 text-slate-400" /><input aria-label={categoriesOnly ? "Search categories" : "Search services"} type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder={categoriesOnly ? "Search categories…" : "Search services…"} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pr-3 pl-9 text-xs text-slate-700" /></div>
   {!categoriesOnly && <select aria-label="Service category" value={categoryId} onChange={event => setCategoryId(event.target.value)} className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700"><option value="">All categories</option>{serviceCategories.map(category => <option key={category.id} value={category.id}>{category.shortTitle}</option>)}</select>}
   <span role="status" className="shrink-0 text-xs text-slate-500">{count} {categoriesOnly ? "categories" : "services"}</span>
  </div>
  <div className={categoriesOnly ? "grid gap-5 md:grid-cols-2 xl:grid-cols-3" : "space-y-5"}>
   {categories.map(category => <section key={category.id} className="admin-shadow-soft min-w-0 overflow-hidden rounded-2xl bg-white">
    <div className="flex items-start gap-3 p-5 sm:p-6"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFA64D]/10 text-xs font-semibold text-[#172B3A]">{category.number}</span><div className="min-w-0"><h3 className="mb-0! text-xs! leading-snug! font-semibold text-[#172B3A] sm:text-sm!">{category.title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{category.tagline}</p></div></div>
    {categoriesOnly ? <div className="px-5 pb-5 sm:px-6"><p className="text-xs leading-6 text-slate-500">{category.description}</p><div className="mt-5 flex flex-wrap items-center justify-between gap-3"><span className="rounded-lg bg-slate-50 px-2 py-1 text-[11px] text-slate-500">{category.capabilities.length} services</span><Link href={`/services/${category.slug}`} className="inline-flex items-center gap-1.5 rounded-lg text-xs font-semibold text-[#172B3A]">View category<ArrowRightIcon className="h-3.5 w-3.5" /></Link></div></div> :
     <ul className="divide-y divide-slate-100 border-t border-slate-100">{category.capabilities.filter(name => name.toLowerCase().includes(query)).map(name => <li key={name}><Link href={`/services/${category.slug}`} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50/70 sm:px-6"><span className="text-xs font-medium text-slate-700">{name}</span><ArrowRightIcon aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-slate-400" /></Link></li>)}</ul>}
   </section>)}
  </div>
  {count === 0 && <div className="admin-shadow-soft rounded-2xl bg-white px-6 py-14 text-center"><Squares2X2Icon className="mx-auto h-8 w-8 text-slate-400" /><p className="mt-3 text-sm text-slate-600">No matching results</p><button type="button" onClick={() => { setSearch(""); setCategoryId(""); }} className="mt-4 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-[#172B3A]">Clear filters</button></div>}
 </div>;
}

