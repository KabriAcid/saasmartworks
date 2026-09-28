import { loadEnvConfig } from '@next/env';
import { getTableName, sql } from 'drizzle-orm';
import { openDatabase } from '../src/db/client';
import * as schema from '../src/db/schema';
import { getDashboardSummary } from '../src/db/queries/dashboard';

loadEnvConfig(process.cwd());
async function main() {
  const {client,db}=openDatabase();
  try {
    const counts: Record<string,number>={};
    for(const table of Object.values(schema)) {
      const name=getTableName(table);
      const result=await client.execute('SELECT count(*) as total FROM "'+name+'"');
      counts[name]=Number(result.rows[0].total);
    }
    const integrity=await client.execute('PRAGMA integrity_check');
    const foreignKeys=await client.execute('PRAGMA foreign_key_check');
    if(integrity.rows[0].integrity_check!=='ok'||foreignKeys.rows.length) throw new Error('Database integrity check failed');
    const invoiceMismatch=await db.all(sql`select i.id from invoices i where i.subtotal_minor != (select coalesce(sum(total_minor),0) from invoice_items x where x.invoice_id = i.id)`);
    if(invoiceMismatch.length)throw new Error('Invoice line totals do not reconcile');
    console.log(JSON.stringify({counts,integrity:'ok',foreignKeyViolations:0,dashboard:await getDashboardSummary(db,'services')},null,2));
  } finally { client.close(); }
}
main().catch(()=>{console.error('Verification failed; no credentials or record payloads logged.');process.exitCode=1});
