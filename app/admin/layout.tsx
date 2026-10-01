import type { Metadata } from "next";
import AdminShell from "@/components/admin/admin-shell";
import { requireSession, AuthError } from "@/lib/auth/authorization";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Administration | SA’A SMART WORKS",
	robots: { index: false, follow: false },
};

export default async function AdminLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const identity = await requireSession().catch(error => {
		if (error instanceof AuthError && error.status === 401) redirect("/login");
		throw error;
	});
	if (identity.user.mustChangePassword) redirect("/change-password");
	return <AdminShell user={{ ...identity.user, role: identity.roles.join(", ") }} permissions={identity.permissions}>{children}</AdminShell>;
}
