import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingState() {
  return (
    <main className="loading-screen" role="status" aria-live="polite">
      <div className="loading-orb loading-orb-one" aria-hidden="true" />
      <div className="loading-orb loading-orb-two" aria-hidden="true" />
      <section className="loading-panel">
        <div className="loading-brand">
          <span className="loading-brand-mark" aria-hidden="true">S</span>
          <span>SA’A SMART WORKS</span>
        </div>
        <div className="loading-copy">
          <p className="loading-kicker">Workspace</p>
          <h1>Preparing your workspace</h1>
          <p className="loading-description">Setting up your experience. This will only take a moment.</p>
        </div>
        <div className="loading-progress" aria-hidden="true"><span /></div>
        <div className="loading-skeletons" aria-hidden="true">
          <Skeleton className="loading-skeleton loading-skeleton-wide" />
          <div className="loading-skeleton-row"><Skeleton className="loading-skeleton" /><Skeleton className="loading-skeleton" /><Skeleton className="loading-skeleton" /></div>
        </div>
        <span className="sr-only">Loading application</span>
      </section>
    </main>
  );
}
