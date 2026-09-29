import { ArrowRightIcon, BriefcaseIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import { activeProjects, type ProjectStatus } from "./dashboard-data";

const statusStyles: Record<ProjectStatus, string> = {
	PLANNED: "bg-slate-100 text-slate-600",
	ACTIVE: "bg-emerald-50 text-emerald-700",
	COMPLETED: "bg-blue-50 text-blue-700",
	CANCELLED: "bg-red-50 text-red-600",
};

const statusLabels: Record<ProjectStatus, string> = {
	PLANNED: "Planned",
	ACTIVE: "Active",
	COMPLETED: "Completed",
	CANCELLED: "Cancelled",
};

export function ActiveProjects() {
	return (
		<section className="admin-shadow-soft overflow-hidden rounded-2xl bg-white">
			<div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-6">
				<div>
					<h3 className="text-sm font-semibold text-[#172B3A]">
						Active Projects
					</h3>

					<p className="mt-1 text-xs text-slate-400">
						Current projects and their progress
					</p>
				</div>

				<Link
					href="/admin/projects"
					className="group flex shrink-0 items-center gap-1.5 text-xs font-semibold text-[#172B3A] transition-opacity hover:opacity-60"
				>
					View all
					<ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
				</Link>
			</div>

			<div className="border-t border-slate-100">
				{activeProjects.length > 0 ? (
					<div className="divide-y divide-slate-100">
						{activeProjects.map((project) => (
							<Link
								key={project.id}
								href={`/admin/projects/${project.id}`}
								className="group block px-5 py-4 transition-colors hover:bg-slate-50/70 sm:px-6"
							>
								<div className="flex items-start gap-3">
									<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#172B3A]/5">
										<BriefcaseIcon className="h-4 w-4 text-[#172B3A]" />
									</div>

									<div className="min-w-0 flex-1">
										<div className="flex items-start justify-between gap-3">
											<div className="min-w-0">
												<p className="truncate text-sm font-semibold text-slate-800">
													{project.name}
												</p>

												<p className="mt-1 truncate text-xs text-slate-400">
													{project.reference} · {project.client}
												</p>
											</div>

											<span
												className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-semibold ${statusStyles[project.status]}`}
											>
												{statusLabels[project.status]}
											</span>
										</div>

										<div className="mt-4">
											<div className="mb-2 flex items-center justify-between gap-3">
												<p className="truncate text-[11px] text-slate-400">
													Managed by{" "}
													<span className="font-medium text-slate-600">
														{project.manager}
													</span>
												</p>

												<span className="text-[11px] font-semibold text-[#172B3A]">
													{project.progress}%
												</span>
											</div>

											<div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
												<div
													className="h-full rounded-full bg-[#FFA64D] transition-all duration-300"
													style={{
														width: `${Math.min(
															Math.max(project.progress, 0),
															100,
														)}%`,
													}}
												/>
											</div>
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
				) : (
					<div className="px-6 py-12 text-center">
						<div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
							<BriefcaseIcon className="h-5 w-5 text-slate-400" />
						</div>

						<p className="mt-3 text-sm font-medium text-slate-600">
							No active projects
						</p>

						<p className="mt-1 text-xs text-slate-400">
							Active projects will appear here.
						</p>
					</div>
				)}
			</div>
		</section>
	);
}
