import type { Metadata } from "next";
import AdminShell from "@/components/admin/admin-shell";

export const metadata: Metadata = {
	title: "Administration | SA’A SMART WORKS",
	robots: { index: false, follow: false },
};

export default function AdminLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return <AdminShell>{children}</AdminShell>;
}
