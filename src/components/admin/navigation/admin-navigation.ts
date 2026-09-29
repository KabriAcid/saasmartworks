import {
    BanknotesIcon,
    BriefcaseIcon,
    BuildingOffice2Icon,
    ChartBarIcon,
    ClipboardDocumentListIcon,
    Cog6ToothIcon,
    HomeIcon,
    ShieldCheckIcon,
    UserGroupIcon,
    UsersIcon,
} from "@heroicons/react/24/outline";

export type AccessRole = "ADMIN" | "STAFF";

export type NavigationLink = {
    label: string;
    href: string;
    roles: AccessRole[];
};

export type NavigationGroup = {
    label: string;
    icon: typeof HomeIcon;
    roles: AccessRole[];
    links: NavigationLink[];
};

export const navigationGroups: NavigationGroup[] = [
    {
        label: "People & Organization",
        icon: UsersIcon,
        roles: ["ADMIN"],
        links: [
            { label: "Employees", href: "/admin/employees", roles: ["ADMIN"] },
            {
                label: "Attendance & GPS",
                href: "/admin/attendance",
                roles: ["ADMIN"],
            },
            {
                label: "Departments",
                href: "/admin/departments",
                roles: ["ADMIN"],
            },
            {
                label: "Branches / Locations",
                href: "/admin/branches",
                roles: ["ADMIN"],
            },
        ],
    },
    {
        label: "Customers",
        icon: UserGroupIcon,
        roles: ["ADMIN", "STAFF"],
        links: [
            {
                label: "Inquiries",
                href: "/admin/inquiries",
                roles: ["ADMIN", "STAFF"],
            },
            {
                label: "Contacts",
                href: "/admin/contacts",
                roles: ["ADMIN", "STAFF"],
            },
            {
                label: "Clients",
                href: "/admin/clients",
                roles: ["ADMIN", "STAFF"],
            },
        ],
    },
    {
        label: "Service Operations",
        icon: BriefcaseIcon,
        roles: ["ADMIN", "STAFF"],
        links: [
            {
                label: "Projects",
                href: "/admin/projects",
                roles: ["ADMIN", "STAFF"],
            },
            {
                label: "Training",
                href: "/admin/training",
                roles: ["ADMIN", "STAFF"],
            },
            {
                label: "Printing Jobs",
                href: "/admin/printing",
                roles: ["ADMIN", "STAFF"],
            },
        ],
    },
    {
        label: "Website Management",
        icon: BuildingOffice2Icon,
        roles: ["ADMIN"],
        links: [
            {
                label: "Services",
                href: "/admin/services",
                roles: ["ADMIN"],
            },
            {
                label: "Service Categories",
                href: "/admin/services/categories",
                roles: ["ADMIN"],
            },
            {
                label: "About Page",
                href: "/admin/website/about",
                roles: ["ADMIN"],
            },
            {
                label: "FAQs",
                href: "/admin/website/faqs",
                roles: ["ADMIN"],
            },
            {
                label: "Contact Information",
                href: "/admin/website/contact",
                roles: ["ADMIN"],
            },
        ],
    },
    {
        label: "Finance",
        icon: BanknotesIcon,
        roles: ["ADMIN"],
        links: [
            { label: "Quotations", href: "/admin/quotations", roles: ["ADMIN"] },
            { label: "Invoices", href: "/admin/invoices", roles: ["ADMIN"] },
            { label: "Payments", href: "/admin/payments", roles: ["ADMIN"] },
            { label: "Expenses", href: "/admin/expenses", roles: ["ADMIN"] },
        ],
    },
    {
        label: "Operations",
        icon: ClipboardDocumentListIcon,
        roles: ["ADMIN", "STAFF"],
        links: [
            { label: "Vendors", href: "/admin/vendors", roles: ["ADMIN"] },
            {
                label: "Procurement",
                href: "/admin/procurement",
                roles: ["ADMIN"],
            },
            {
                label: "Tasks",
                href: "/admin/tasks",
                roles: ["ADMIN", "STAFF"],
            },
            {
                label: "Documents",
                href: "/admin/documents",
                roles: ["ADMIN", "STAFF"],
            },
        ],
    },
    {
        label: "Insights",
        icon: ChartBarIcon,
        roles: ["ADMIN", "STAFF"],
        links: [
            {
                label: "Reports",
                href: "/admin/reports",
                roles: ["ADMIN", "STAFF"],
            },
        ],
    },
    {
        label: "Access & Security",
        icon: ShieldCheckIcon,
        roles: ["ADMIN"],
        links: [
            { label: "User Accounts", href: "/admin/users", roles: ["ADMIN"] },
            {
                label: "Roles & Permissions",
                href: "/admin/roles",
                roles: ["ADMIN"],
            },
        ],
    },
    {
        label: "System",
        icon: Cog6ToothIcon,
        roles: ["ADMIN"],
        links: [
            {
                label: "Notifications",
                href: "/admin/notifications",
                roles: ["ADMIN"],
            },
            { label: "Settings", href: "/admin/settings", roles: ["ADMIN"] },
            {
                label: "Audit Logs",
                href: "/admin/audit-logs",
                roles: ["ADMIN"],
            },
        ],
    },
];

