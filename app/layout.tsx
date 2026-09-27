import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";

export const metadata: Metadata = {
	title: { default: "SAASMARTWORKS", template: "%s | SAASMARTWORKS" },
	description:
		"Professional and digital services in Maiduguri, Borno State, Nigeria.",
	icons: {
		icon: "/favicon.png",
		shortcut: "/favicon.png",
		apple: "/favicon.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
			<body>
				<NextTopLoader color="#ffa64d" showSpinner={false} height={3} />
				<SiteHeader />
				{children}
				<SiteFooter />
			</body>
		</html>
	);
}
