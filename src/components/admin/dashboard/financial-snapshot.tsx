import {
	ArrowRightIcon,
	BanknotesIcon,
	CheckCircleIcon,
	DocumentTextIcon,
	ReceiptPercentIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

import { financialSnapshot } from "./dashboard-data";

const financeConfig = {
	"Pending Quotations": {
		icon: DocumentTextIcon,
		href: "/admin/quotations",
		iconStyle: "bg-amber-50 text-amber-600",
	},
	"Unpaid Invoices": {
		icon: ReceiptPercentIcon,
		href: "/admin/invoices",
		iconStyle: "bg-red-50 text-red-600",
	},
	"Confirmed Payments": {
		icon: CheckCircleIcon,
		href: "/admin/payments",
		iconStyle: "bg-emerald-50 text-emerald-600",
	},
	Expenses: {
		icon: BanknotesIcon,
		href: "/admin/expenses",
		iconStyle: "bg-blue-50 text-blue-600",
	},
};

export function FinancialSnapshot() {
	return (
		<section className="admin-shadow-soft rounded-2xl bg-white p-5 sm:p-6">
			<div className="flex items-center justify-between gap-4">
				<div>
					<h3 className="text-sm font-semibold text-[#172B3A]">
						Financial Snapshot
					</h3>

					<p className="mt-1 text-xs text-slate-400">
						Current financial activity at a glance
					</p>
				</div>

				<Link
					href="/admin/payments"
					className="group flex shrink-0 items-center gap-1.5 text-xs font-semibold text-[#172B3A] transition-opacity hover:opacity-60"
				>
					Finance
					<ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
				</Link>
			</div>

			<div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
				{financialSnapshot.map((item) => {
					const config =
						financeConfig[item.label as keyof typeof financeConfig];

					const Icon = config.icon;

					return (
						<Link
							key={item.label}
							href={config.href}
							className="group rounded-xl bg-slate-50/80 p-4 transition-all duration-200 hover:bg-slate-100"
						>
							<div className="flex items-start justify-between gap-3">
								<div
									className={`flex h-9 w-9 items-center justify-center rounded-xl ${config.iconStyle}`}
								>
									<Icon className="h-4.5 w-4.5" />
								</div>

								<span className="rounded-lg bg-white px-2 py-1 text-[10px] font-semibold text-slate-500">
									{item.count}
								</span>
							</div>

							<div className="mt-4">
								<p className="text-lg font-bold tracking-tight text-[#172B3A]">
									{item.value}
								</p>

								<p className="mt-1 text-xs font-medium text-slate-500">
									{item.label}
								</p>
							</div>
						</Link>
					);
				})}
			</div>
		</section>
	);
}
