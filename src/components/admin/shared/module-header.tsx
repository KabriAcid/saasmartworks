import Link from "next/link";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

export function ModuleHeader({ title, description, group = "Website Management", href }: { title: string; description: string; group?: string; href?: string }) {
 return <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
  <div className="min-w-0"><p className="text-xs font-medium text-[#FFA64D]">{group}</p><h2 className="mt-1! mb-0! break-words text-lg! leading-snug! font-bold text-[#172B3A] sm:text-xl!">{title}</h2><p className="mt-1 max-w-xl text-xs leading-6 text-slate-500">{description}</p></div>
  {href && <Link href={href} target="_blank" rel="noopener noreferrer" className="admin-shadow-soft inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-[#172B3A]">View website<ArrowUpRightIcon aria-hidden="true" className="h-3.5 w-3.5" /></Link>}
 </header>;
}

