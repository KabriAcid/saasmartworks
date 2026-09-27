import type { Metadata } from 'next';
import './globals.css';
import { SiteFooter } from '@/components/shared/site-footer';
import { SiteHeader } from '@/components/shared/site-header';

export const metadata: Metadata = {
	title: { default: 'SA’A SMART WORKS', template: '%s | SA’A SMART WORKS' },
	description: 'Professional and digital services in Maiduguri, Borno State, Nigeria.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
			<body>
				<SiteHeader />
				{children}
				<SiteFooter />
			</body>
		</html>
	);
}
