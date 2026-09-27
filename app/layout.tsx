import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'SA’A SMART WORKS', description: 'Professional and digital services in Maiduguri' };
export default function RootLayout({children}: Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>;}
