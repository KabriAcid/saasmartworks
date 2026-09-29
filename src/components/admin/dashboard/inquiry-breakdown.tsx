import { inquiryBreakdown } from "./dashboard-data";

const statusStyles = {
    NEW: {
        dot: "bg-[#FFA64D]",
        bar: "bg-[#FFA64D]",
        badge: "bg-orange-50 text-orange-700",
    },
    OPEN: {
        dot: "bg-blue-500",
        bar: "bg-blue-500",
        badge: "bg-blue-50 text-blue-700",
    },
    AWAITING_CUSTOMER: {
        dot: "bg-amber-500",
        bar: "bg-amber-500",
        badge: "bg-amber-50 text-amber-700",
    },
    RESOLVED: {
        dot: "bg-emerald-500",
        bar: "bg-emerald-500",
        badge: "bg-emerald-50 text-emerald-700",
    },
};

export function InquiryBreakdown() {
    const totalInquiries = inquiryBreakdown.reduce(
        (total, item) => total + item.count,
        0,
    );

    return (
        <section className="admin-shadow-soft rounded-2xl bg-white p-5 sm:p-6">
            <div>
                <p className="text-sm font-semibold text-[#172B3A]">
                    Inquiry Breakdown
                </p>

                <p className="mt-1 text-xs text-slate-400">
                    Current inquiry status overview
                </p>
            </div>

            <div className="mt-6">
                <div className="flex items-end gap-2">
                    <p className="text-3xl font-bold tracking-tight text-[#172B3A]">
                        {totalInquiries}
                    </p>

                    <p className="pb-1 text-xs text-slate-400">
                        total inquiries
                    </p>
                </div>

                <div className="mt-5 flex h-2.5 overflow-hidden rounded-full bg-slate-100">
                    {inquiryBreakdown.map((item) => {
                        const percentage =
                            totalInquiries > 0
                                ? (item.count / totalInquiries) * 100
                                : 0;

                        return (
                            <div
                                key={item.status}
                                className={
                                    statusStyles[item.status].bar
                                }
                                style={{
                                    width: `${percentage}%`,
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            <div className="mt-6 space-y-3">
                {inquiryBreakdown.map((item) => {
                    const styles = statusStyles[item.status];

                    const percentage =
                        totalInquiries > 0
                            ? Math.round(
                                  (item.count / totalInquiries) * 100,
                              )
                            : 0;

                    return (
                        <div
                            key={item.status}
                            className="flex items-center justify-between gap-4 rounded-xl px-2 py-2 transition-colors hover:bg-slate-50"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <span
                                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${styles.dot}`}
                                />

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-slate-700">
                                        {item.label}
                                    </p>

                                    <p className="mt-0.5 text-[11px] text-slate-400">
                                        {percentage}% of inquiries
                                    </p>
                                </div>
                            </div>

                            <span
                                className={`min-w-9 rounded-lg px-2 py-1 text-center text-xs font-semibold ${styles.badge}`}
                            >
                                {item.count}
                            </span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
