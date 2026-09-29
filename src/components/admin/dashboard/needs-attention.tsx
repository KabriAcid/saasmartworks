import {
    ArrowRightIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

import { attentionItems } from "./dashboard-data";

const attentionConfig = {
    warning: {
        icon: ClockIcon,
        iconStyle: "bg-amber-50 text-amber-600",
        dotStyle: "bg-amber-500",
    },
    danger: {
        icon: ExclamationTriangleIcon,
        iconStyle: "bg-red-50 text-red-600",
        dotStyle: "bg-red-500",
    },
    info: {
        icon: InformationCircleIcon,
        iconStyle: "bg-blue-50 text-blue-600",
        dotStyle: "bg-blue-500",
    },
};

export function NeedsAttention() {
    return (
        <section className="admin-shadow-soft rounded-2xl bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h3 className="text-sm font-semibold text-[#172B3A]">
                        Needs Attention
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                        Items that may require your action
                    </p>
                </div>

                <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-[#FFA64D]/10 px-2 text-[11px] font-bold text-[#172B3A]">
                    {attentionItems.length}
                </span>
            </div>

            <div className="mt-5 space-y-2">
                {attentionItems.length > 0 ? (
                    attentionItems.map((item) => {
                        const config = attentionConfig[item.type];
                        const Icon = config.icon;

                        return (
                            <div
                                key={item.id}
                                className="group flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-slate-50"
                            >
                                <div
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${config.iconStyle}`}
                                >
                                    <Icon className="h-4.5 w-4.5" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${config.dotStyle}`}
                                        />

                                        <p className="truncate text-xs font-semibold text-slate-700">
                                            {item.title}
                                        </p>
                                    </div>

                                    <p className="mt-1 truncate text-[11px] text-slate-400">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-8 text-center">
                        <p className="text-sm font-medium text-slate-600">
                            Nothing needs attention
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            You&apos;re all caught up.
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4">
                <Link
                    href="/admin/tasks"
                    className="group flex items-center justify-center gap-1.5 text-xs font-semibold text-[#172B3A] transition-opacity hover:opacity-60"
                >
                    View tasks

                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
            </div>
        </section>
    );
}