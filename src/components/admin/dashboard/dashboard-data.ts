export type DashboardKpi = {
    label: string;
    value: string;
    change: string;
    trend: "up" | "down" | "neutral";
    context: string;
};

export type InquiryStatus =
    | "NEW"
    | "OPEN"
    | "AWAITING_CUSTOMER"
    | "RESOLVED";

export type ProjectStatus =
    | "PLANNED"
    | "ACTIVE"
    | "COMPLETED"
    | "CANCELLED";

export const dashboardKpis: DashboardKpi[] = [
    {
        label: "New Inquiries",
        value: "24",
        change: "+12%",
        trend: "up",
        context: "vs. last month",
    },
    {
        label: "Active Clients",
        value: "38",
        change: "+4",
        trend: "up",
        context: "this month",
    },
    {
        label: "Active Projects",
        value: "12",
        change: "3 due soon",
        trend: "neutral",
        context: "currently in progress",
    },
    {
        label: "Payments",
        value: "₦2.48M",
        change: "+18%",
        trend: "up",
        context: "confirmed this month",
    },
];

export const revenueData = [
    { month: "Apr", revenue: 820000 },
    { month: "May", revenue: 1050000 },
    { month: "Jun", revenue: 940000 },
    { month: "Jul", revenue: 1380000 },
    { month: "Aug", revenue: 1720000 },
    { month: "Sep", revenue: 2480000 },
];

export const inquiryBreakdown = [
    { status: "NEW" as const, label: "New", count: 24 },
    { status: "OPEN" as const, label: "Open", count: 16 },
    {
        status: "AWAITING_CUSTOMER" as const,
        label: "Awaiting Customer",
        count: 8,
    },
    {
        status: "RESOLVED" as const,
        label: "Resolved",
        count: 31,
    },
];

export const recentInquiries = [
    {
        id: 1,
        reference: "INQ-2026-0142",
        customer: "Amina Yusuf",
        service: "Website Development",
        subject: "Business website development",
        status: "NEW" as InquiryStatus,
        date: "Sep 28, 2026",
    },
    {
        id: 2,
        reference: "INQ-2026-0141",
        customer: "Northgate Academy",
        service: "Software Development",
        subject: "School management system",
        status: "OPEN" as InquiryStatus,
        date: "Sep 28, 2026",
    },
    {
        id: 3,
        reference: "INQ-2026-0140",
        customer: "Hassan Musa",
        service: "Printing",
        subject: "Corporate branding materials",
        status: "AWAITING_CUSTOMER" as InquiryStatus,
        date: "Sep 27, 2026",
    },
    {
        id: 4,
        reference: "INQ-2026-0139",
        customer: "Prime Logistics",
        service: "IT Consulting",
        subject: "Infrastructure consultation",
        status: "RESOLVED" as InquiryStatus,
        date: "Sep 26, 2026",
    },
];

export const activeProjects = [
    {
        id: 1,
        reference: "PRJ-2026-031",
        name: "School Management Portal",
        client: "Northgate Academy",
        manager: "Abubakar Kabri",
        status: "ACTIVE" as ProjectStatus,
        progress: 72,
    },
    {
        id: 2,
        reference: "PRJ-2026-029",
        name: "Corporate Website",
        client: "Prime Logistics",
        manager: "Abubakar Kabri",
        status: "ACTIVE" as ProjectStatus,
        progress: 48,
    },
    {
        id: 3,
        reference: "PRJ-2026-025",
        name: "Staff Training Program",
        client: "Horizon Group",
        manager: "Fatima Bello",
        status: "ACTIVE" as ProjectStatus,
        progress: 86,
    },
];

export const financialSnapshot = [
    {
        label: "Pending Quotations",
        value: "₦1.24M",
        count: 7,
    },
    {
        label: "Unpaid Invoices",
        value: "₦860K",
        count: 5,
    },
    {
        label: "Confirmed Payments",
        value: "₦2.48M",
        count: 18,
    },
    {
        label: "Expenses",
        value: "₦640K",
        count: 11,
    },
];

export const attentionItems = [
    {
        id: 1,
        title: "3 project deadlines approaching",
        description: "Due within the next 7 days",
        type: "warning" as const,
    },
    {
        id: 2,
        title: "5 unpaid invoices",
        description: "Require payment follow-up",
        type: "danger" as const,
    },
    {
        id: 3,
        title: "8 inquiries awaiting response",
        description: "Customer response required",
        type: "info" as const,
    },
];

export const recentActivity = [
    {
        id: 1,
        title: "New inquiry received",
        description: "Amina Yusuf submitted a website development inquiry.",
        time: "5 min ago",
    },
    {
        id: 2,
        title: "Payment confirmed",
        description: "Payment for invoice INV-2026-0084 was confirmed.",
        time: "32 min ago",
    },
    {
        id: 3,
        title: "Project updated",
        description: "School Management Portal progress was updated.",
        time: "1 hr ago",
    },
    {
        id: 4,
        title: "Quotation sent",
        description: "Quotation QT-2026-0041 was sent to the client.",
        time: "2 hrs ago",
    },
];