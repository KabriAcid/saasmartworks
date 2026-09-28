"use client";

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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/logo";

type AccessRole = "ADMIN" | "STAFF";

type NavigationLink = {
    label: string;
    href: string;
    roles: AccessRole[];
};

type NavigationGroup = {
    label: string;
    icon: typeof HomeIcon;
    roles: AccessRole[];
    links: NavigationLink[];
};

const navigationGroups: NavigationGroup[] = [
    {
        label: "People & Organization",
        icon: UsersIcon,
        roles: ["ADMIN"],
        links: [
            { label: "Employees", href: "/admin/employees", roles: ["ADMIN"] },
            { label: "Attendance & GPS", href: "/admin/attendance", roles: ["ADMIN"] },
            { label: "Departments", href: "/admin/departments", roles: ["ADMIN"] },
            { label: "Branches / Locations", href: "/admin/branches", roles: ["ADMIN"] },
        ],
    },
    {
        label: "Customers",
        icon: UserGroupIcon,
        roles: ["ADMIN", "STAFF"],
        links: [
            { label: "Inquiries", href: "/admin/inquiries", roles: ["ADMIN", "STAFF"] },
            { label: "Contacts", href: "/admin/contacts", roles: ["ADMIN", "STAFF"] },
            { label: "Clients", href: "/admin/clients", roles: ["ADMIN", "STAFF"] },
        ],
    },
    {
        label: "Service Operations",
        icon: BriefcaseIcon,
        roles: ["ADMIN", "STAFF"],
        links: [
            { label: "Projects", href: "/admin/projects", roles: ["ADMIN", "STAFF"] },
            { label: "Training", href: "/admin/training", roles: ["ADMIN", "STAFF"] },
            { label: "Printing Jobs", href: "/admin/printing", roles: ["ADMIN", "STAFF"] },
        ],
    },
    {
        label: "Website Management",
        icon: BuildingOffice2Icon,
        roles: ["ADMIN"],
        links: [
            { label: "Services", href: "/admin/services", roles: ["ADMIN"] },
            {
                label: "Service Categories",
                href: "/admin/services/categories",
                roles: ["ADMIN"],
            },
            { label: "About Page", href: "/admin/website/about", roles: ["ADMIN"] },
            { label: "FAQs", href: "/admin/website/faqs", roles: ["ADMIN"] },
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
            { label: "Procurement", href: "/admin/procurement", roles: ["ADMIN"] },
            { label: "Tasks", href: "/admin/tasks", roles: ["ADMIN", "STAFF"] },
            { label: "Documents", href: "/admin/documents", roles: ["ADMIN", "STAFF"] },
        ],
    },
    {
        label: "Insights",
        icon: ChartBarIcon,
        roles: ["ADMIN", "STAFF"],
        links: [
            { label: "Reports", href: "/admin/reports", roles: ["ADMIN", "STAFF"] },
        ],
    },
    {
        label: "Access & Security",
        icon: ShieldCheckIcon,
        roles: ["ADMIN"],
        links: [
            { label: "User Accounts", href: "/admin/users", roles: ["ADMIN"] },
            { label: "Roles & Permissions", href: "/admin/roles", roles: ["ADMIN"] },
        ],
    },
    {
        label: "System",
        icon: Cog6ToothIcon,
        roles: ["ADMIN"],
        links: [
            { label: "Notifications", href: "/admin/notifications", roles: ["ADMIN"] },
            { label: "Settings", href: "/admin/settings", roles: ["ADMIN"] },
            { label: "Audit Logs", href: "/admin/audit-logs", roles: ["ADMIN"] },
        ],
    },
];

type AdminSidebarProps = {
    role?: AccessRole;
};

export function AdminSidebar({ role = "ADMIN" }: AdminSidebarProps) {
    const pathname = usePathname();

    const visibleGroups = navigationGroups
        .filter((group) => group.roles.includes(role))
        .map((group) => ({
            ...group,
            links: group.links.filter((link) => link.roles.includes(role)),
        }))
        .filter((group) => group.links.length > 0);

    const isRouteActive = (href: string) =>
        pathname === href || pathname.startsWith(`${href}/`);

    return (
        <aside className="hidden h-screen w-72 shrink-0 flex-col bg-[#172B3A] text-slate-100 lg:flex">
            <div className="flex shrink-0 items-center gap-3 px-6 py-7">
                <div className="admin-shadow-glow flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl">
                    <Logo
                        src="/favicon-trans.png"
                        alt="SA’A SMART WORKS"
                        className="h-8 w-8 object-contain"
                    />
                </div>

                <div>
                    <p className="text-[10px] font-semibold tracking-[0.24em] text-slate-400 uppercase">
                        SA&apos;A SMART
                    </p>
                    <p className="text-base font-semibold text-white">
                        Administration
                    </p>
                </div>
            </div>

            <nav
                aria-label="Admin navigation"
                className="flex-1 overflow-y-auto px-4 pb-6"
            >
                <Link
                    href="/admin"
                    aria-current={pathname === "/admin" ? "page" : undefined}
                    className={`relative mb-6 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        pathname === "/admin"
                            ? "admin-shadow-active bg-white/10 text-white"
                            : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                    }`}
                >
                    {pathname === "/admin" && (
                        <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-[#FFA64D]" />
                    )}

                    <HomeIcon className="h-5 w-5 shrink-0" />
                    <span>Dashboard</span>
                </Link>

                <div className="space-y-6">
                    {visibleGroups.map(({ label, icon: Icon, links }) => (
                        <section key={label}>
                            <div className="mb-2 flex items-center gap-2 px-3">
                                <Icon className="h-4 w-4 shrink-0 text-slate-500" />
                                <p className="text-[10px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
                                    {label}
                                </p>
                            </div>

                            <div className="space-y-1">
                                {links.map(({ label: linkLabel, href }) => {
                                    const isActive = isRouteActive(href);

                                    return (
                                        <Link
                                            key={href}
                                            href={href}
                                            aria-current={isActive ? "page" : undefined}
                                            className={`relative flex items-center rounded-xl px-3 py-2 text-sm transition ${
                                                isActive
                                                    ? "admin-shadow-active bg-white/10 font-medium text-white"
                                                    : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-100"
                                            }`}
                                        >
                                            {isActive && (
                                                <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-[#FFA64D]" />
                                            )}

                                            <span>{linkLabel}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>
            </nav>
        </aside>
    );
}