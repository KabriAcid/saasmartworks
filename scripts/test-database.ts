import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { eq, getTableName } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { openDatabase } from '../src/db/client';
import * as s from '../src/db/schema';
import * as contracts from '../src/validation/module-schemas';
import { verifyPassword, hashPassword } from '../src/lib/passwords';
import { seedDatabase } from './seeds';
import { getDashboardSummary } from '../src/db/queries/dashboard';

async function main() {
  mkdirSync('.db-work',{recursive:true});
  process.env.DB_TARGET='local';
  process.env.DATABASE_URL='file:./.db-work/test-'+randomUUID()+'.sqlite';
  const {client,db}=openDatabase();
  const password=process.env.SEED_PASSWORD;
  assert.ok(password,'Supply SEED_PASSWORD to test seed hashes');
  try {
    await migrate(db,{migrationsFolder:'./drizzle'});
    await seedDatabase(db,password);
    const before:Record<string,number>={};
    for(const table of Object.values(s)) {
      const name=getTableName(table);
      before[name]=Number((await client.execute('SELECT count(*) as n FROM "'+name+'"')).rows[0].n);
    }
    const user=(await db.select().from(s.users).where(eq(s.users.id,'demo-admin')))[0];
    assert.ok(await verifyPassword(password,user.passwordHash));
    assert.equal(await verifyPassword('incorrect-password',user.passwordHash),false);
    assert.equal(await verifyPassword(password,'not-a-hash'),false);
    assert.notEqual(await hashPassword(password),user.passwordHash);
    await db.update(s.clients).set({notes:'Preserve edited data'}).where(eq(s.clients.id,'demo-client-1'));
    await seedDatabase(db,password);
    for(const table of Object.values(s)) {
      const name=getTableName(table);
      assert.equal(Number((await client.execute('SELECT count(*) as n FROM "'+name+'"')).rows[0].n),before[name]);
    }
    assert.equal((await db.select().from(s.users).where(eq(s.users.id,'demo-admin')))[0].passwordHash,user.passwordHash);
    assert.equal((await db.select().from(s.clients).where(eq(s.clients.id,'demo-client-1')))[0].notes,'Preserve edited data');
    await assert.rejects(client.execute("UPDATE inquiries SET status='INVALID' WHERE id='demo-inquiry-1'"));
    await assert.rejects(client.execute("UPDATE inquiries SET business_unit_id='eatery' WHERE id='demo-inquiry-1'"));
    await assert.rejects(client.execute("UPDATE inquiries SET service_id='digital-service-1' WHERE id='demo-inquiry-1'"));
    await assert.rejects(client.execute("UPDATE payments SET amount_minor=-1 WHERE id='demo-payment-1'"));
    await assert.rejects(client.execute("UPDATE payments SET currency='USD' WHERE id='demo-payment-1'"));
    await assert.rejects(client.execute("UPDATE invoice_items SET total_minor=1 WHERE id='demo-invoice-item-1'"));
    await assert.rejects(client.execute("UPDATE invoices SET total_minor=1 WHERE id='demo-invoice-1'"));
    await assert.rejects(client.execute("UPDATE training_sessions SET end_date=0 WHERE id='demo-training-1'"));
    await assert.rejects(client.execute("UPDATE inquiry_messages SET staff_author_id='demo-admin' WHERE id='demo-message-0'"));
    await assert.rejects(client.execute("DELETE FROM clients WHERE id='demo-client-1'"));
    const checks: Array<[unknown[], {parse:(value:unknown)=>unknown}]> = [
      [await db.select().from(s.users),contracts.userSchema],
      [await db.select().from(s.inquiries),contracts.inquirySchema],
      [await db.select().from(s.inquiryMessages),contracts.inquiryMessageSchema],
      [await db.select().from(s.invoices),contracts.invoiceSchema],
      [await db.select().from(s.trainingSessions),contracts.trainingSessionSchema],
    ];
    for(const [rows,contract] of checks)for(const row of rows)contract.parse(row);
    assert.equal((await client.execute('PRAGMA foreign_key_check')).rows.length,0);
    const summary=await getDashboardSummary(db,'services');
    assert.equal(summary.clients,2);
    assert.equal(summary.paymentTotals[0].amountMinor,5000000);
    assert.equal((await getDashboardSummary(db,'eatery')).clients,0);
    console.log('PASS: migration, 28-table seed repeatability, password verification, edited-record preservation, scoped dashboard queries, record schemas, FK/status/money/date constraints.');
  } finally {client.close();}
}
main().catch(error=>{console.error(error instanceof Error ? error.message : 'Database test failed');process.exitCode=1});
