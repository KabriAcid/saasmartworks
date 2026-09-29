import Link from "next/link";
import {
	ArrowRightIcon,
	BuildingOffice2Icon,
	MapPinIcon,
	ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export function BranchesOverview() {
	return (
		<div className="space-y-6">
			<header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div className="min-w-0">
					<p className="text-sm font-medium text-[#FFA64D]">People &amp; Organization</p>
					<h2 className="mt-1 break-words text-lg! leading-snug! font-bold tracking-tight text-[#172B3A] sm:text-xl! mb-0! leading-snug!">Branches / Locations</h2>
					<p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">A central place for the locations where your team works.</p>
				</div>
				<span className="w-fit shrink-0 rounded-lg bg-orange-50 px-3 py-2 text-xs font-medium text-orange-800">Workplaces</span>
			</header>

			<div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
				<section aria-labelledby="locations-directory-title" className="admin-shadow-soft overflow-hidden rounded-2xl bg-white xl:col-span-8">
					<div className="flex items-start justify-between gap-4 px-5 py-5 sm:px-6">
						<div>
							<h3 id="locations-directory-title" className="text-xs! sm:text-sm! font-semibold text-[#172B3A] mb-0! leading-snug!">Location directory</h3>
							<p className="mt-1 text-xs text-slate-500">Your branches and workplaces</p>
						</div>
						<BuildingOffice2Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-slate-400" />
					</div>
					<div className="border-t border-slate-100 px-6 py-16 text-center sm:py-20">
						<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFA64D]/10">
							<MapPinIcon aria-hidden="true" className="h-6 w-6 text-[#FFA64D]" />
						</div>
						<h4 className="mt-4 text-xs! sm:text-sm! font-semibold text-[#172B3A] mb-0! leading-snug!">A place for every workplace</h4>
						<p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-slate-500">No workplaces to display. Branch and location records will appear in this directory.</p>
						<Link href="/admin/attendance" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#FFA64D] px-4 py-2.5 text-xs font-semibold text-[#172B3A] transition-colors hover:bg-[#FFA64D]/80">
							Explore attendance <ArrowRightIcon aria-hidden="true" className="h-3.5 w-3.5" />
						</Link>
					</div>
				</section>

				<aside className="space-y-5 xl:col-span-4">
					<section aria-labelledby="workplaces-title" className="admin-shadow-soft rounded-2xl bg-white p-5 sm:p-6">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#172B3A]/5">
							<BuildingOffice2Icon aria-hidden="true" className="h-5 w-5 text-[#172B3A]" />
						</div>
						<h3 id="workplaces-title" className="mt-5 text-xs! sm:text-sm! font-semibold text-[#172B3A] mb-0! leading-snug!">Workplaces at a glance</h3>
						<p className="mt-2 text-xs leading-6 text-slate-500">Keep workplace information together, so your team can find the locations that matter to their work.</p>
					</section>
					<section aria-labelledby="location-attendance-title" className="admin-shadow-soft rounded-2xl bg-white p-5 sm:p-6">
						<div className="flex items-center gap-3">
							<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50"><ShieldCheckIcon aria-hidden="true" className="h-4 w-4 text-emerald-600" /></div>
							<h3 id="location-attendance-title" className="text-xs! sm:text-sm! font-semibold text-[#172B3A] mb-0! leading-snug!">Location-assisted attendance</h3>
						</div>
						<p className="mt-4 text-xs leading-6 text-slate-500">Workplace locations provide the context for attendance checks. Visit Attendance & GPS for an overview of the clock-in workflow.</p>
						<Link href="/admin/attendance" className="mt-4 inline-flex items-center gap-1.5 rounded-lg py-1 text-xs font-semibold text-[#172B3A] transition-opacity hover:opacity-60">
							View Attendance &amp; GPS <ArrowRightIcon aria-hidden="true" className="h-3.5 w-3.5" />
						</Link>
					</section>
				</aside>
			</div>
		</div>
	);
}
