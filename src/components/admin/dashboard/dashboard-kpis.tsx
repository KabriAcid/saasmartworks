import {
	BriefcaseIcon,
	ChatBubbleLeftRightIcon,
	CreditCardIcon,
	UserGroupIcon,
} from "@heroicons/react/24/outline";

import { dashboardKpis } from "./dashboard-data";

const kpiIcons = {
	"New Inquiries": ChatBubbleLeftRightIcon,
	"Active Clients": UserGroupIcon,
	"Active Projects": BriefcaseIcon,
	Payments: CreditCardIcon,
};

export function DashboardKpis() {
	return (
		<section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
			{dashboardKpis.map((kpi) => {
				const Icon = kpiIcons[kpi.label as keyof typeof kpiIcons];

				return (
					<article
						key={kpi.label}
						className="admin-shadow-soft rounded-2xl bg-white p-5"
					>
						<div className="flex items-start justify-between gap-4">
							<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFA64D]/10">
								{Icon && <Icon className="h-5 w-5 text-[#FFA64D]" />}
							</div>
						</div>

						<div className="mt-5">
							<p className="text-2xl font-bold tracking-tight text-[#172B3A]">
								{kpi.value}
							</p>

							<p className="mt-1 text-sm font-semibold text-slate-700">
								{kpi.label}
							</p>
						</div>
					</article>
				);
			})}
		</section>
	);
}
