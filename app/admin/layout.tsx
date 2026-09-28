import type { Metadata } from "next";
import AdminShell from "@/components/admin/admin-shell";
import { requireAdminUser } from "@/lib/auth/guard";

export const metadata: Metadata = {
	title: "Administration | SA’A SMART WORKS",
	robots: { index: false, follow: false },
};

export default async function AdminLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const user = await requireAdminUser();
	return <AdminShell user={user}>{children}</AdminShell>;
}
