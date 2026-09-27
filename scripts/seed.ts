import { loadEnvConfig } from '@next/env';
import { openDatabase } from '../src/db/client';
import { businessUnits, serviceCategories } from '../src/db/schema';

loadEnvConfig(process.cwd());

async function main() {
  const { client, db } = openDatabase();
  try {
    await db.transaction(async (tx) => {
      await tx.insert(businessUnits).values([
        { id: 'services', slug: 'professional-services', name: 'Professional & Digital Services', active: true },
        { id: 'eatery', slug: 'eatery', name: 'SA’A Eatery', active: false },
      ]).onConflictDoNothing();
      await tx.insert(serviceCategories).values([
        { id: 'consultancy', businessUnitId: 'services', slug: 'management-consultancy', name: 'Management Consultancy' },
        { id: 'digital', businessUnitId: 'services', slug: 'digital-services', name: 'Digital Services' },
        { id: 'printing', businessUnitId: 'services', slug: 'printing-branding-design', name: 'Printing, Branding & Creative Design' },
      ]).onConflictDoNothing();
    });
    console.log('Business units and service categories seeded.');
  } finally {
    client.close();
  }
}

main().catch(() => {
  console.error('Seed failed. Check configuration and apply migrations first.');
  process.exitCode = 1;
});
