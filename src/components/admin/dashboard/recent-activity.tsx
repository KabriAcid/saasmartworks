import {
    BanknotesIcon,
    ChatBubbleLeftRightIcon,
    DocumentTextIcon,
    FolderIcon,
} from "@heroicons/react/24/outline";

import { recentActivity } from "./dashboard-data";

const activityConfig = {
    "New inquiry received": {
        icon: ChatBubbleLeftRightIcon,
        style: "bg-orange-50 text-[#FFA64D]",
    },
    "Payment confirmed": {
        icon: BanknotesIcon,
        style: "bg-emerald-50 text-emerald-600",
    },
    "Project updated": {
        icon: FolderIcon,
        style: "bg-blue-50 text-blue-600",
    },
    "Quotation sent": {
        icon: DocumentTextIcon,
        style: "bg-violet-50 text-violet-600",
    },
};

export function RecentActivity() {
    return (
        <section className="admin-shadow-soft rounded-2xl bg-white p-5 sm:p-6">
            <div>
                <h3 className="text-sm font-semibold text-[#172B3A]">
                    Recent Activity
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                    Latest activity across SA&apos;A Smart Works
                </p>
            </div>

            <div className="mt-5">
                {recentActivity.length > 0 ? (
                    <div>
                        {recentActivity.map((activity, index) => {
                            const config =
                                activityConfig[
                                    activity.title as keyof typeof activityConfig
                                ];

                            const Icon = config?.icon ?? DocumentTextIcon;

                            return (
                                <div
                                    key={activity.id}
                                    className="relative flex gap-3 pb-5 last:pb-0"
                                >
                                    {index !== recentActivity.length - 1 && (
                                        <div className="absolute top-9 bottom-0 left-[17px] w-px bg-slate-100" />
                                    )}

                                    <div
                                        className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                            config?.style ??
                                            "bg-slate-100 text-slate-500"
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </div>

                                    <div className="min-w-0 flex-1 pt-0.5">
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="text-xs font-semibold text-slate-700">
                                                {activity.title}
                                            </p>

                                            <span className="shrink-0 text-[10px] text-slate-400">
                                                {activity.time}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-[11px] leading-5 text-slate-400">
                                            {activity.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-8 text-center">
                        <p className="text-sm font-medium text-slate-600">
                            No recent activity
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            System activity will appear here.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}