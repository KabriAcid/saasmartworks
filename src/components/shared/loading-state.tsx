import { Skeleton } from '@/components/ui/skeleton';
export default function LoadingState(){return <main className="shell" role="status"><p>Loading…</p><Skeleton style={{height:'3rem',maxWidth:'28rem'}}/></main>;}
