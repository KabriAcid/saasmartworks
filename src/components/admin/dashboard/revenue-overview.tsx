import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";

import { revenueData } from "./dashboard-data";

function formatCurrency(value: number) {
    if (value >= 1_000_000) {
        return `₦${(value / 1_000_000).toFixed(1)}M`;
    }

    if (value >= 1_000) {
        return `₦${Math.round(value / 1_000)}K`;
    }

    return `₦${value}`;
}

export function RevenueOverview() {
    const maxRevenue = Math.max(
        ...revenueData.map((item) => item.revenue),
    );

    const totalRevenue = revenueData.reduce(
        (total, item) => total + item.revenue,
        0,
    );

    const latestRevenue =
        revenueData[revenueData.length - 1]?.revenue ?? 0;

    const previousRevenue =
        revenueData[revenueData.length - 2]?.revenue ?? 0;

    const percentageChange =
        previousRevenue > 0
            ? Math.round(
                  ((latestRevenue - previousRevenue) /
                      previousRevenue) *
                      100,
              )
            : 0;

    return (
        <section className="admin-shadow-soft rounded-2xl bg-white p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-[#172B3A]">
                        Revenue Overview
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                        Confirmed payments over the last 6 months
                    </p>
                </div>

                <div className="sm:text-right">
                    <p className="text-xl font-bold tracking-tight text-[#172B3A]">
                        {formatCurrency(totalRevenue)}
                    </p>

                    <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-600 sm:justify-end">
                        <ArrowTrendingUpIcon className="h-3.5 w-3.5" />
                        <span>
                            {percentageChange}% from last month
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <div className="flex h-56 items-end gap-3 sm:gap-5">
                    {revenueData.map((item) => {
                        const height =
                            maxRevenue > 0
                                ? (item.revenue / maxRevenue) * 100
                                : 0;

                        return (
                            <div
                                key={item.month}
                                className="group flex h-full min-w-0 flex-1 flex-col justify-end"
                            >
                                <div className="relative flex flex-1 items-end justify-center">
                                    <div className="pointer-events-none absolute bottom-[calc(var(--bar-height)+8px)] left-1/2 z-10 -translate-x-1/2 rounded-lg bg-[#172B3A] px-2 py-1 text-[10px] font-semibold whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                                        {formatCurrency(
                                            item.revenue,
                                        )}
                                    </div>

                                    <div
                                        className="w-full max-w-12 rounded-t-xl bg-[#FFA64D]/20 transition-all duration-300 group-hover:bg-[#FFA64D]"
                                        style={{
                                            height: `${height}%`,
                                            minHeight: "8px",
                                            ["--bar-height" as string]:
                                                `${height}%`,
                                        }}
                                    />
                                </div>

                                <p className="mt-3 text-center text-[11px] font-medium text-slate-400">
                                    {item.month}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}