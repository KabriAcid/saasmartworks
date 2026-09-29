import Link from "next/link";
import { ArrowRightIcon, BuildingOffice2Icon, UsersIcon, Squares2X2Icon } from "@heroicons/react/24/outline";

export function DepartmentsOverview() {
	return (
		<div className="space-y-6">
			<header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div className="min-w-0">
					<p className="text-sm font-medium text-[#FFA64D]">People &amp; Organization</p>
					<h2 className="mt-1 break-words text-lg! leading-snug! font-bold tracking-tight text-[#172B3A] sm:text-xl! mb-0! leading-snug!">Departments</h2>
					<p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">Bring your teams and organizational structure into focus.</p>
				</div>
				<span className="w-fit shrink-0 rounded-lg bg-orange-50 px-3 py-2 text-xs font-medium text-orange-800">Organization</span>
			</header>

			<div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
				<section aria-labelledby="departments-directory-title" className="admin-shadow-soft overflow-hidden rounded-2xl bg-white xl:col-span-8">
					<div className="flex items-start justify-between gap-4 px-5 py-5 sm:px-6">
						<div><h3 id="departments-directory-title" className="text-xs! sm:text-sm! font-semibold text-[#172B3A] mb-0! leading-snug!">Department directory</h3><p className="mt-1 text-xs text-slate-500">A place for your organization’s teams</p></div>
						<Squares2X2Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-slate-400" />
					</div>
					<div className="border-t border-slate-100 px-6 py-16 text-center sm:py-20">
						<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFA64D]/10"><BuildingOffice2Icon aria-hidden="true" className="h-6 w-6 text-[#FFA64D]" /></div>
						<h4 className="mt-4 text-xs! sm:text-sm! font-semibold text-[#172B3A] mb-0! leading-snug!">Room for every team</h4>
						<p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-slate-500">No departments to display. Your teams will appear in this directory.</p>
						<Link href="/admin/employees" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#FFA64D] px-4 py-2.5 text-xs font-semibold text-[#172B3A] transition-colors hover:bg-[#FFA64D]/80">Browse employees<ArrowRightIcon aria-hidden="true" className="h-3.5 w-3.5" /></Link>
					</div>
				</section>

				<aside className="space-y-5 xl:col-span-4">
					<section aria-labelledby="organization-title" className="admin-shadow-soft rounded-2xl bg-white p-5 sm:p-6">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#172B3A]/5"><BuildingOffice2Icon aria-hidden="true" className="h-5 w-5 text-[#172B3A]" /></div>
						<h3 id="organization-title" className="mt-5 text-xs! sm:text-sm! font-semibold text-[#172B3A] mb-0! leading-snug!">Your organization, clearly arranged</h3>
						<p className="mt-2 text-xs leading-6 text-slate-500">Keep your organizational structure easy to explore. Find individual roles and contact details in the employee directory.</p>
					</section>
					<section aria-labelledby="employee-directory-title" className="admin-shadow-soft rounded-2xl bg-white p-5 sm:p-6">
						<div className="flex items-center gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFA64D]/10"><UsersIcon aria-hidden="true" className="h-4 w-4 text-[#FFA64D]" /></div><h3 id="employee-directory-title" className="text-xs! sm:text-sm! font-semibold text-[#172B3A] mb-0! leading-snug!">Looking for someone?</h3></div>
						<p className="mt-4 text-xs leading-6 text-slate-500">Find names, job titles, and contact details in the employee directory.</p>
						<Link href="/admin/employees" className="mt-4 inline-flex items-center gap-1.5 rounded-lg py-1 text-xs font-semibold text-[#172B3A] transition-opacity hover:opacity-60">View employees<ArrowRightIcon aria-hidden="true" className="h-3.5 w-3.5" /></Link>
					</section>
				</aside>
			</div>
		</div>
	);
}
