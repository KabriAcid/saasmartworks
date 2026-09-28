"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";

export function PublicShell({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isAdminRoute = pathname?.startsWith("/admin") ?? false;
	const isLoginRoute = pathname === "/login";

	if (isAdminRoute || isLoginRoute) {
		return <>{children}</>;
	}

	return (
		<>
			<SiteHeader />
			{children}
			<SiteFooter />
		</>
	);
}
