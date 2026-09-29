import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";

export default function AdminShell({
	children,
	user,
}: {
	children: React.ReactNode;
	user: { id: string; name: string; email: string; role: string };
}) {
	return (
		<div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
			<div className="flex min-h-screen">
				<AdminSidebar />

				<div className="flex min-w-0 flex-1 flex-col lg:ml-72">
					<AdminTopbar user={user} />

					<main className="flex-1 p-4 sm:p-6 lg:p-8">
						<div className="mx-auto max-w-7xl">{children}</div>
					</main>
				</div>
			</div>
		</div>
	);
}
