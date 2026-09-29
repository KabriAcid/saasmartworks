"use client";

import {
    ArrowLeftStartOnRectangleIcon,
    Bars3Icon,
    BellIcon,
    ChevronDownIcon,
    Cog6ToothIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { logout } from "@/lib/auth/actions";

const notifications = [
    {
        id: 1,
        title: "New inquiry received",
        message: "A new website development inquiry was submitted.",
        time: "5 min ago",
        unread: true,
    },
    {
        id: 2,
        title: "Quotation accepted",
        message: "Quotation QT-2026-0041 has been accepted.",
        time: "28 min ago",
        unread: true,
    },
    {
        id: 3,
        title: "Project update",
        message: "A project status was recently updated.",
        time: "1 hr ago",
        unread: true,
    },
    {
        id: 4,
        title: "New client added",
        message: "A new client has been added to the system.",
        time: "2 hrs ago",
        unread: true,
    },
    {
        id: 5,
        title: "Payment recorded",
        message: "A payment was recorded successfully.",
        time: "3 hrs ago",
        unread: true,
    },
];

export function AdminTopbar({
    user,
    onOpenSidebar,
}: {
    user: {
        name: string;
        email: string;
        role: string;
    };
    onOpenSidebar?: () => void;
}) {
    const pathname = usePathname();

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] =
        useState(false);

    const profileRef = useRef<HTMLDivElement | null>(null);
    const notificationRef = useRef<HTMLDivElement | null>(null);

    const pageTitle =
        pathname === "/admin"
            ? "Dashboard"
            : pathname
                  .split("/")
                  .filter(Boolean)
                  .at(-1)
                  ?.replaceAll("-", " ")
                  .replace(/\b\w/g, (letter) =>
                      letter.toUpperCase(),
                  ) ?? "Administration";

    const initials = user.name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

    const unreadCount = notifications.filter(
        (notification) => notification.unread,
    ).length;

    useEffect(() => {
        function handlePointerDown(event: MouseEvent) {
            const target = event.target as Node;

            if (
                profileRef.current &&
                !profileRef.current.contains(target)
            ) {
                setIsProfileOpen(false);
            }

            if (
                notificationRef.current &&
                !notificationRef.current.contains(target)
            ) {
                setIsNotificationsOpen(false);
            }
        }

        document.addEventListener("mousedown", handlePointerDown);

        return () => {
            document.removeEventListener(
                "mousedown",
                handlePointerDown,
            );
        };
    }, []);

    useEffect(() => {
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
    }, [pathname]);

    return (
        <header className="sticky top-4 z-20 px-4 pb-4 sm:px-6 lg:px-8">
            <div className="admin-shadow-shell flex h-20 items-center justify-between gap-3 rounded-[999px] border border-white/80 bg-white/70 px-4 backdrop-blur-2xl sm:px-5">
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <button
                        type="button"
                        onClick={onOpenSidebar}
                        aria-label="Open sidebar"
                        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#172B3A] transition-all duration-200 hover:bg-[#172B3A]/5 active:scale-95 lg:hidden"
                    >
                        <Bars3Icon className="h-5 w-5" />
                    </button>

                    <h5 className="truncate text-sm font-semibold text-[var(--color-ink)] sm:text-base">
                        {pageTitle}
                    </h5>
                </div>

                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <div
                        ref={notificationRef}
                        className="relative"
                    >
                        <button
                            type="button"
                            onClick={() => {
                                setIsNotificationsOpen(
                                    (value) => !value,
                                );
                                setIsProfileOpen(false);
                            }}
                            aria-label={`${unreadCount} unread notifications`}
                            aria-expanded={isNotificationsOpen}
                            className="admin-shadow-soft relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/60 text-slate-700 transition-all duration-200 hover:bg-white active:scale-95"
                        >
                            <BellIcon className="h-5 w-5" />

                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FFA64D] px-1 text-[10px] font-bold text-[#172B3A] ring-2 ring-white">
                                    {unreadCount > 9
                                        ? "9+"
                                        : unreadCount}
                                </span>
                            )}
                        </button>

                        {isNotificationsOpen && (
                            <div className="admin-shadow-popover absolute top-full right-0 z-30 mt-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200/70 bg-white/95 backdrop-blur-xl">
                                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">
                                            Notifications
                                        </p>

                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {unreadCount} unread
                                        </p>
                                    </div>

                                    <Link
                                        href="/admin/notifications"
                                        className="text-xs font-semibold text-[#172B3A] transition-opacity hover:opacity-60"
                                    >
                                        View all
                                    </Link>
                                </div>

                                <div className="max-h-80 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                    {notifications.map(
                                        (notification) => (
                                            <div
                                                key={notification.id}
                                                className="flex gap-3 border-b border-slate-100/80 px-4 py-3 transition-colors last:border-0 hover:bg-slate-50"
                                            >
                                                <span
                                                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                                                        notification.unread
                                                            ? "bg-[#FFA64D]"
                                                            : "bg-slate-200"
                                                    }`}
                                                />

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <p
                                                            className={`text-sm ${
                                                                notification.unread
                                                                    ? "font-semibold text-slate-900"
                                                                    : "font-medium text-slate-600"
                                                            }`}
                                                        >
                                                            {
                                                                notification.title
                                                            }
                                                        </p>

                                                        <span className="shrink-0 text-[10px] text-slate-400">
                                                            {
                                                                notification.time
                                                            }
                                                        </span>
                                                    </div>

                                                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                                        {
                                                            notification.message
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>

                                <div className="border-t border-slate-100 p-2">
                                    <Link
                                        href="/admin/notifications"
                                        className="block rounded-xl px-3 py-2 text-center text-xs font-semibold text-[#172B3A] transition hover:bg-slate-100"
                                    >
                                        View all notifications
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        ref={profileRef}
                        className="relative"
                    >
                        <button
                            type="button"
                            onClick={() => {
                                setIsProfileOpen(
                                    (value) => !value,
                                );
                                setIsNotificationsOpen(false);
                            }}
                            aria-expanded={isProfileOpen}
                            aria-label="Open profile menu"
                            className="admin-shadow-soft flex cursor-pointer items-center gap-2 rounded-full bg-white/60 px-1.5 py-1.5 transition-all duration-200 hover:bg-white sm:gap-3 sm:px-2.5"
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-[var(--color-ink)]">
                                {initials || "AD"}
                            </div>

                            <div className="hidden max-w-36 text-left sm:block">
                                <p className="truncate text-sm font-semibold text-slate-900">
                                    {user.name}
                                </p>

                                <p className="text-[11px] font-medium text-slate-500">
                                    {user.role}
                                </p>
                            </div>

                            <ChevronDownIcon
                                className={`hidden h-4 w-4 text-slate-500 transition-transform duration-200 sm:block ${
                                    isProfileOpen
                                        ? "rotate-180"
                                        : ""
                                }`}
                            />
                        </button>

                        {isProfileOpen && (
                            <div className="admin-shadow-popover absolute top-full right-0 z-30 mt-3 w-64 rounded-2xl border border-slate-200/70 bg-white/95 p-2 backdrop-blur-xl">
                                <div className="border-b border-slate-200/80 px-3 py-3">
                                    <p className="truncate text-sm font-semibold text-slate-900">
                                        {user.name}
                                    </p>

                                    <p className="mt-0.5 truncate text-xs text-slate-500">
                                        {user.email}
                                    </p>

                                </div>

                                <div className="space-y-1 py-2">
                                    <Link
                                        href="/admin"
                                        onClick={() =>
                                            setIsProfileOpen(false)
                                        }
                                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-100 hover:pl-4"
                                    >
                                        <UserIcon className="h-4 w-4 shrink-0" />
                                        Profile
                                    </Link>

                                    <Link
                                        href="/admin/security"
                                        onClick={() =>
                                            setIsProfileOpen(false)
                                        }
                                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-100 hover:pl-4"
                                    >
                                        <Cog6ToothIcon className="h-4 w-4 shrink-0" />
                                        Security
                                    </Link>

                                    <div className="my-2 h-px bg-slate-100" />

                                    <form action={logout}>
                                        <button
                                            type="submit"
                                            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl bg-red-50 px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition-all duration-200 hover:bg-red-600 hover:pl-4 hover:text-white active:scale-[0.98]"
                                        >
                                            <ArrowLeftStartOnRectangleIcon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
                                            Log out
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
