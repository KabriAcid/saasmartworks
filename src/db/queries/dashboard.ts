import { eq, sql, count } from 'drizzle-orm';
import { openDatabase } from '../client';
import { inquiries, clients, projects, printingJobs, payments, expenses } from '../schema';

// Internal repository query. Call only after server-side actor permission/unit checks.
// Financial totals are grouped by currency; never add different currencies together.
export async function getDashboardSummary(db: ReturnType<typeof openDatabase>['db'], businessUnitId: string) {
  const [inquiryCounts,clientCount,projectCounts,printingCounts,paymentTotals,expenseTotals]=await Promise.all([
    db.select({status:inquiries.status,count:count()}).from(inquiries).where(eq(inquiries.businessUnitId,businessUnitId)).groupBy(inquiries.status),
    db.select({count:count()}).from(clients).where(eq(clients.businessUnitId,businessUnitId)),
    db.select({status:projects.status,count:count()}).from(projects).where(eq(projects.businessUnitId,businessUnitId)).groupBy(projects.status),
    db.select({status:printingJobs.status,count:count()}).from(printingJobs).where(eq(printingJobs.businessUnitId,businessUnitId)).groupBy(printingJobs.status),
    db.select({currency:payments.currency,amountMinor:sql<number>`coalesce(sum(case when ${payments.status} = 'CONFIRMED' then ${payments.amountMinor} else 0 end),0)`.mapWith(Number)}).from(payments).where(eq(payments.businessUnitId,businessUnitId)).groupBy(payments.currency),
    db.select({currency:expenses.currency,amountMinor:sql<number>`coalesce(sum(case when ${expenses.status} = 'PAID' then ${expenses.amountMinor} else 0 end),0)`.mapWith(Number)}).from(expenses).where(eq(expenses.businessUnitId,businessUnitId)).groupBy(expenses.currency),
  ]);
  return {inquiryCounts,clients:clientCount[0].count,projectCounts,printingCounts,paymentTotals,expenseTotals};
}
