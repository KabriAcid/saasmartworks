import { ActiveProjects } from "@/components/admin/dashboard/active-projects";
import { DashboardHeader } from "@/components/admin/dashboard/dashboard-header";
import { DashboardKpis } from "@/components/admin/dashboard/dashboard-kpis";
import { FinancialSnapshot } from "@/components/admin/dashboard/financial-snapshot";
import { InquiryBreakdown } from "@/components/admin/dashboard/inquiry-breakdown";
import { NeedsAttention } from "@/components/admin/dashboard/needs-attention";
import { RecentActivity } from "@/components/admin/dashboard/recent-activity";
import { RecentInquiries } from "@/components/admin/dashboard/recent-inquiries";
import { RevenueOverview } from "@/components/admin/dashboard/revenue-overview";

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <DashboardHeader userName="Abdullahi" />

            <DashboardKpis />

            <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
                <div className="min-w-0 space-y-5 xl:col-span-7">
                    <RevenueOverview />

                    <RecentInquiries />

                    <FinancialSnapshot />

                    <RecentActivity />
                </div>

                <div className="min-w-0 space-y-5 xl:col-span-5">
                    <InquiryBreakdown />

                    <ActiveProjects />

                    <NeedsAttention />
                </div>
            </div>
        </div>
    );
}
