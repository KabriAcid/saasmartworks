import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import {
    type InquiryStatus,
    recentInquiries,
} from "./dashboard-data";

const statusStyles: Record<InquiryStatus, string> = {
    NEW: "bg-orange-50 text-orange-700",
    OPEN: "bg-blue-50 text-blue-700",
    AWAITING_CUSTOMER: "bg-amber-50 text-amber-700",
    RESOLVED: "bg-emerald-50 text-emerald-700",
};

const statusLabels: Record<InquiryStatus, string> = {
    NEW: "New",
    OPEN: "Open",
    AWAITING_CUSTOMER: "Awaiting",
    RESOLVED: "Resolved",
};

export function RecentInquiries() {
    return (
        <section className="admin-shadow-soft overflow-hidden rounded-2xl bg-white">
            <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-6">
                <div>
                    <h3 className="text-sm font-semibold text-[#172B3A]">
                        Recent Inquiries
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                        Latest customer inquiries received
                    </p>
                </div>

                <Link
                    href="/admin/inquiries"
                    className="group flex shrink-0 items-center gap-1.5 text-xs font-semibold text-[#172B3A] transition-opacity hover:opacity-60"
                >
                    View all

                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
            </div>

            <div className="border-t border-slate-100">
                {recentInquiries.length > 0 ? (
                    <>
                        <div className="hidden grid-cols-[1.1fr_1.3fr_1.3fr_0.8fr_0.8fr] gap-4 bg-slate-50/70 px-6 py-2.5 text-[10px] font-semibold tracking-wide text-slate-400 uppercase md:grid">
                            <span>Reference</span>
                            <span>Customer</span>
                            <span>Service</span>
                            <span>Status</span>
                            <span className="text-right">
                                Date
                            </span>
                        </div>

                        <div>
                            {recentInquiries.map((inquiry) => (
                                <Link
                                    key={inquiry.id}
                                    href={`/admin/inquiries/${inquiry.id}`}
                                    className="group block border-b border-slate-100 px-5 py-4 transition-colors last:border-b-0 hover:bg-slate-50/70 sm:px-6"
                                >
                                    <div className="md:grid md:grid-cols-[1.1fr_1.3fr_1.3fr_0.8fr_0.8fr] md:items-center md:gap-4">
                                        <div>
                                            <p className="text-xs font-semibold text-[#172B3A]">
                                                {inquiry.reference}
                                            </p>

                                            <p className="mt-1 truncate text-xs text-slate-400 md:hidden">
                                                {inquiry.subject}
                                            </p>
                                        </div>

                                        <p className="mt-2 truncate text-sm font-medium text-slate-700 md:mt-0">
                                            {inquiry.customer}
                                        </p>

                                        <p className="hidden truncate text-xs text-slate-500 md:block">
                                            {inquiry.service}
                                        </p>

                                        <div className="mt-3 md:mt-0">
                                            <span
                                                className={`inline-flex rounded-lg px-2 py-1 text-[10px] font-semibold ${statusStyles[inquiry.status]}`}
                                            >
                                                {
                                                    statusLabels[
                                                        inquiry
                                                            .status
                                                    ]
                                                }
                                            </span>
                                        </div>

                                        <p className="mt-2 text-xs text-slate-400 md:mt-0 md:text-right">
                                            {inquiry.date}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="px-6 py-12 text-center">
                        <p className="text-sm font-medium text-slate-600">
                            No inquiries yet
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            New customer inquiries will appear
                            here.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}