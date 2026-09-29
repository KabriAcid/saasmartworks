import type { Metadata } from "next";
import AdminShell from "@/components/admin/admin-shell";
import { mockUser } from "@/lib/auth/mock";

export const metadata: Metadata = {
	title: "Administration | SA’A SMART WORKS",
	robots: { index: false, follow: false },
};

export default function AdminLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return <AdminShell user={mockUser}>{children}</AdminShell>;
}
