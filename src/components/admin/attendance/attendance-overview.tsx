import Link from "next/link";
import {
	ArrowRightIcon,
	CalendarDaysIcon,
	ClockIcon,
	MapPinIcon,
	ShieldCheckIcon,
	UsersIcon,
} from "@heroicons/react/24/outline";

const summaries = [
	{ label: "Clocked in", icon: UsersIcon },
	{ label: "Clocked out", icon: ClockIcon },
	{ label: "Location checks", icon: MapPinIcon },
];

const workflow = [
	{ title: "Clock in or out", description: "Employees will record the start and end of their working day.", icon: ClockIcon },
	{ title: "Share location for the event", description: "The device will request location permission when an attendance event is submitted.", icon: MapPinIcon },
	{ title: "Review verified records", description: "Attendance will be checked against the configured workplace before appearing in the register.", icon: ShieldCheckIcon },
];

export function AttendanceOverview() {
	return (
		<div className="space-y-6">
			<header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="text-sm font-medium text-[#FFA64D]">People &amp; Organization</p>
					<h2 className="mt-1 break-words text-xl font-bold tracking-tight text-[#172B3A] sm:text-2xl">Attendance &amp; GPS</h2>
					<p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">A clear view of the working day, from arrival to sign-off.</p>
				</div>
				<span className="w-fit rounded-lg bg-orange-50 px-3 py-2 text-xs font-medium text-orange-800">Attendance not enabled</span>
			</header>

			<section aria-label="Attendance summary" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				{summaries.map(({ label, icon: Icon }) => (
					<article key={label} className="admin-shadow-soft rounded-2xl bg-white p-5">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFA64D]/10">
							<Icon aria-hidden="true" className="h-5 w-5 text-[#FFA64D]" />
						</div>
						<p aria-label="Unavailable" className="mt-5 text-2xl font-bold tracking-tight text-[#172B3A]">—</p>
						<p className="mt-1 text-sm font-semibold text-slate-700">{label}</p>
						<p className="mt-1 text-xs text-slate-500">Available once attendance is enabled</p>
					</article>
				))}
			</section>

			<div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
				<section aria-labelledby="attendance-register-title" className="admin-shadow-soft overflow-hidden rounded-2xl bg-white xl:col-span-8">
					<div className="flex items-start justify-between gap-4 px-5 py-5 sm:px-6">
						<div>
							<h2 id="attendance-register-title" className="text-sm font-semibold text-[#172B3A]">Attendance register</h2>
							<p className="mt-1 text-xs text-slate-500">Employee clock-in and clock-out activity</p>
						</div>
						<CalendarDaysIcon aria-hidden="true" className="h-5 w-5 shrink-0 text-slate-400" />
					</div>
					<div className="border-t border-slate-100 px-6 py-16 text-center sm:py-20">
						<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
							<ClockIcon aria-hidden="true" className="h-6 w-6 text-slate-400" />
						</div>
						<h3 className="mt-4 text-sm font-semibold text-[#172B3A]">Your attendance register starts here</h3>
						<p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-slate-500">Employee attendance is not available yet. Once enabled, this space will show recorded activity and location-check results.</p>
						<Link href="/admin/employees" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#FFA64D] px-4 py-2.5 text-xs font-semibold text-[#172B3A] transition-colors hover:bg-[#FFA64D]/80">
							View employee directory <ArrowRightIcon aria-hidden="true" className="h-3.5 w-3.5" />
						</Link>
					</div>
					<p className="border-t border-slate-100 px-5 py-3 text-xs leading-5 text-slate-500 sm:px-6">Attendance totals are unavailable. Employees are not marked absent when no records are available.</p>
				</section>

				<aside className="space-y-5 xl:col-span-4">
					<section aria-labelledby="attendance-workflow-title" className="admin-shadow-soft rounded-2xl bg-white p-5 sm:p-6">
						<h2 id="attendance-workflow-title" className="text-sm font-semibold text-[#172B3A]">Planned attendance workflow</h2>
						<p className="mt-1 text-xs text-slate-500">What to expect when attendance is enabled</p>
						<ol className="mt-6 space-y-6">
							{workflow.map(({ title, description, icon: Icon }, index) => (
								<li key={title} className="flex gap-3">
									<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#172B3A]/5"><Icon aria-hidden="true" className="h-4 w-4 text-[#172B3A]" /></div>
									<div><h3 className="text-xs font-semibold text-slate-700"><span className="mr-1 text-slate-400">{index + 1}.</span> {title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{description}</p></div>
								</li>
							))}
						</ol>
					</section>
					<section aria-labelledby="location-title" className="admin-shadow-soft rounded-2xl bg-white p-5 sm:p-6">
						<div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50"><ShieldCheckIcon aria-hidden="true" className="h-4 w-4 text-emerald-600" /></div><h2 id="location-title" className="text-sm font-semibold text-[#172B3A]">Location at clock-in</h2></div>
						<p className="mt-4 text-xs leading-6 text-slate-500">The planned workflow checks location only when recording attendance. It does not continuously track employees.</p>
						<p className="mt-3 rounded-xl bg-slate-50 px-3 py-3 text-xs leading-5 text-slate-600">This preview does not request your location or record attendance.</p>
					</section>
				</aside>
			</div>
		</div>
	);
}
