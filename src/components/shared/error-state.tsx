"use client";
import { Button } from "@/components/ui/button";
export default function ErrorState({ reset }: { reset: () => void }) {
	return (
		<main className="shell">
			<h1>Something went wrong</h1>
			<Button onClick={reset}>Try again</Button>
		</main>
	);
}
