"use client";

import {
  ArrowLeftStartOnRectangleIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function AdminTopbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <header className="sticky top-4 z-20 px-4 pb-4 sm:px-6 lg:px-8">
      <div className="flex h-20 items-center justify-between rounded-[999px] border border-white/80 bg-white/70 px-4 shadow-[0_18px_45px_rgba(31,41,51,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl sm:px-5">
          <div>
            <span className="mt-1 text-lg font-bold text-[var(--color-ink)] sm:text-xl">
              Dashboard
            </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden items-center gap-2 rounded-full bg-white/60 px-3 py-2 text-sm font-medium text-slate-600 shadow-[0_8px_18px_rgba(15,23,42,0.04)] transition hover:bg-white sm:flex"
          >
            <MagnifyingGlassIcon className="h-4 w-4" />
            Search
          </button>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full bg-white/60 p-2.5 text-slate-700 shadow-[0_8px_18px_rgba(15,23,42,0.04)] transition hover:bg-white"
            aria-label="Notifications"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 1 1-6 0" />
            </svg>
          </button>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              className="flex items-center gap-3 rounded-full bg-white/60 px-2.5 py-1.5 shadow-[0_8px_18px_rgba(15,23,42,0.04)] transition hover:bg-white"
              onClick={() => setIsProfileOpen((value) => !value)}
              aria-expanded={isProfileOpen}
              aria-label="Open profile menu"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-[var(--color-ink)]">
                AD
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-slate-900">Admin</p>
                <p className="text-[11px] text-slate-500">Operations</p>
              </div>
              <ChevronDownIcon className="h-4 w-4 text-slate-500" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full z-30 mt-3 w-56 rounded-2xl border border-slate-200/70 bg-white/90 p-2 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl">
                <div className="border-b border-slate-200/80 px-3 py-2">
                  <p className="text-sm font-semibold text-slate-900">Admin</p>
                  <p className="text-xs text-slate-500">operations@saasmartworks.com</p>
                </div>
                <div className="space-y-1 py-2">
                  <Link href="/admin" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100">
                    <ShieldCheckIcon className="h-4 w-4" />
                    Overview
                  </Link>
                  <Link href="/admin/security" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100">
                    <Cog6ToothIcon className="h-4 w-4" />
                    Security
                  </Link>
                  <Link href="/login" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100">
                    <ArrowLeftStartOnRectangleIcon className="h-4 w-4" />
                    Log out
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
