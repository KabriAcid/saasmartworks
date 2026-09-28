import { loadEnvConfig } from '@next/env';
import { Client } from 'pg';
import { hashPassword } from '../src/lib/passwords';

loadEnvConfig(process.cwd());

const requiredDatabaseUrl = process.env.POSTGRES_URL || process.env.SUPABASE_URL;
if (!requiredDatabaseUrl) {
	throw new Error('Missing Supabase Postgres connection. Set POSTGRES_URL or SUPABASE_URL.');
}

const schemaStatements = [
	`CREATE TABLE IF NOT EXISTS business_units (
		id TEXT PRIMARY KEY,
		slug TEXT NOT NULL UNIQUE,
		name TEXT NOT NULL,
		active BOOLEAN NOT NULL DEFAULT FALSE,
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);`,
	`CREATE TABLE IF NOT EXISTS users (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL,
		email TEXT NOT NULL UNIQUE,
		password_hash TEXT NOT NULL,
		status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'DISABLED')),
		must_change_password BOOLEAN NOT NULL DEFAULT TRUE,
		is_demo BOOLEAN NOT NULL DEFAULT FALSE,
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		CHECK (email = LOWER(TRIM(email)))
	);`,
	`CREATE TABLE IF NOT EXISTS roles (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL UNIQUE,
		description TEXT NOT NULL,
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);`,
	`CREATE TABLE IF NOT EXISTS permissions (
		id TEXT PRIMARY KEY,
		description TEXT NOT NULL
	);`,
	`CREATE TABLE IF NOT EXISTS role_permissions (
		role_id TEXT NOT NULL REFERENCES roles(id),
		permission_id TEXT NOT NULL REFERENCES permissions(id),
		PRIMARY KEY (role_id, permission_id)
	);`,
	`CREATE TABLE IF NOT EXISTS user_roles (
		user_id TEXT NOT NULL REFERENCES users(id),
		role_id TEXT NOT NULL REFERENCES roles(id),
		business_unit_id TEXT NOT NULL REFERENCES business_units(id),
		PRIMARY KEY (user_id, role_id, business_unit_id)
	);`,
	`CREATE INDEX IF NOT EXISTS user_roles_unit_idx ON user_roles (business_unit_id);`,
	`CREATE TABLE IF NOT EXISTS employees (
		id TEXT PRIMARY KEY,
		business_unit_id TEXT NOT NULL REFERENCES business_units(id),
		user_id TEXT UNIQUE REFERENCES users(id),
		employee_number TEXT NOT NULL UNIQUE,
		name TEXT NOT NULL,
		email TEXT NOT NULL,
		job_title TEXT NOT NULL,
		status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
		is_demo BOOLEAN NOT NULL DEFAULT FALSE,
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);`,
	`CREATE INDEX IF NOT EXISTS employees_unit_idx ON employees (business_unit_id);`,
	`CREATE TABLE IF NOT EXISTS service_categories (
		id TEXT PRIMARY KEY,
		business_unit_id TEXT NOT NULL REFERENCES business_units(id),
		slug TEXT NOT NULL UNIQUE,
		name TEXT NOT NULL,
		UNIQUE (id, business_unit_id)
	);`,
	`CREATE TABLE IF NOT EXISTS services (
		id TEXT PRIMARY KEY,
		category_id TEXT NOT NULL REFERENCES service_categories(id),
		slug TEXT NOT NULL,
		name TEXT NOT NULL,
		description TEXT NOT NULL,
		active BOOLEAN NOT NULL DEFAULT TRUE,
		sort_order INTEGER NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		UNIQUE (category_id, slug),
		UNIQUE (id, category_id)
	);`,
	`CREATE TABLE IF NOT EXISTS contacts (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL,
		email TEXT NOT NULL,
		phone TEXT,
		organization TEXT,
		is_demo BOOLEAN NOT NULL DEFAULT FALSE,
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);`,
	`CREATE INDEX IF NOT EXISTS contacts_email_idx ON contacts (email);`,
	`CREATE TABLE IF NOT EXISTS clients (
		id TEXT PRIMARY KEY,
		business_unit_id TEXT NOT NULL REFERENCES business_units(id),
		contact_id TEXT NOT NULL REFERENCES contacts(id),
		reference TEXT NOT NULL UNIQUE,
		status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
		notes TEXT,
		is_demo BOOLEAN NOT NULL DEFAULT FALSE,
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		UNIQUE (contact_id, business_unit_id),
		UNIQUE (id, business_unit_id)
	);`,
	`CREATE TABLE IF NOT EXISTS inquiries (
		id TEXT PRIMARY KEY,
		reference TEXT NOT NULL UNIQUE,
		contact_id TEXT NOT NULL REFERENCES contacts(id),
		business_unit_id TEXT NOT NULL REFERENCES business_units(id),
		category_id TEXT NOT NULL,
		service_id TEXT,
		subject TEXT NOT NULL,
		status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'OPEN', 'AWAITING_CUSTOMER', 'RESOLVED', 'CLOSED')),
		assigned_to TEXT REFERENCES users(id),
		is_demo BOOLEAN NOT NULL DEFAULT FALSE,
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		FOREIGN KEY (category_id, business_unit_id) REFERENCES service_categories(id, business_unit_id),
		FOREIGN KEY (service_id, category_id) REFERENCES services(id, category_id)
	);`,
	`CREATE INDEX IF NOT EXISTS inquiries_unit_status_date_idx ON inquiries (business_unit_id, status, created_at);`,
	`CREATE INDEX IF NOT EXISTS inquiries_contact_idx ON inquiries (contact_id);`,
	`CREATE INDEX IF NOT EXISTS inquiries_assignee_idx ON inquiries (assigned_to);`,
	`CREATE TABLE IF NOT EXISTS inquiry_messages (
		id TEXT PRIMARY KEY,
		inquiry_id TEXT NOT NULL REFERENCES inquiries(id),
		author_type TEXT NOT NULL CHECK (author_type IN ('CONTACT', 'STAFF')),
		contact_author_id TEXT REFERENCES contacts(id),
		staff_author_id TEXT REFERENCES users(id),
		body TEXT NOT NULL,
		email_delivery_status TEXT NOT NULL DEFAULT 'NOT_APPLICABLE' CHECK (email_delivery_status IN ('PENDING', 'SENT', 'FAILED', 'NOT_APPLICABLE')),
		is_demo BOOLEAN NOT NULL DEFAULT FALSE,
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		CHECK ((author_type = 'CONTACT' AND contact_author_id IS NOT NULL AND staff_author_id IS NULL) OR (author_type = 'STAFF' AND staff_author_id IS NOT NULL AND contact_author_id IS NULL))
	);`,
	`CREATE INDEX IF NOT EXISTS messages_inquiry_date_idx ON inquiry_messages (inquiry_id, created_at);`,
	`CREATE TABLE IF NOT EXISTS inquiry_assignments (
		id TEXT PRIMARY KEY,
		inquiry_id TEXT NOT NULL REFERENCES inquiries(id),
		assigned_to TEXT NOT NULL REFERENCES users(id),
		assigned_by TEXT NOT NULL REFERENCES users(id),
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);`,
	`CREATE TABLE IF NOT EXISTS projects (
		id TEXT PRIMARY KEY,
		business_unit_id TEXT NOT NULL REFERENCES business_units(id),
		client_id TEXT NOT NULL,
		reference TEXT NOT NULL UNIQUE,
		name TEXT NOT NULL,
		description TEXT NOT NULL,
		manager_id TEXT REFERENCES users(id),
		status TEXT NOT NULL DEFAULT 'PLANNED' CHECK (status IN ('PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED')),
		start_date TIMESTAMPTZ,
		end_date TIMESTAMPTZ,
		is_demo BOOLEAN NOT NULL DEFAULT FALSE,
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		UNIQUE (id, business_unit_id),
		FOREIGN KEY (client_id, business_unit_id) REFERENCES clients(id, business_unit_id),
		CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
	);`,
	`CREATE INDEX IF NOT EXISTS projects_unit_status_idx ON projects (business_unit_id, status);`,
	`CREATE TABLE IF NOT EXISTS training_sessions (
		id TEXT PRIMARY KEY,
		business_unit_id TEXT NOT NULL REFERENCES business_units(id),
		client_id TEXT REFERENCES clients(id),
		project_id TEXT,
		title TEXT NOT NULL,
		theme TEXT NOT NULL,
		venue TEXT,
		facilitator_id TEXT REFERENCES users(id),
		start_date TIMESTAMPTZ NOT NULL,
		end_date TIMESTAMPTZ NOT NULL,
		status TEXT NOT NULL DEFAULT 'PLANNED' CHECK (status IN ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
		is_demo BOOLEAN NOT NULL DEFAULT FALSE,
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		FOREIGN KEY (client_id, business_unit_id) REFERENCES clients(id, business_unit_id),
		FOREIGN KEY (project_id, business_unit_id) REFERENCES projects(id, business_unit_id),
		CHECK (end_date >= start_date)
	);`,
	`CREATE INDEX IF NOT EXISTS training_unit_date_idx ON training_sessions (business_unit_id, start_date);`,
	`CREATE TABLE IF NOT EXISTS training_participants (
		training_id TEXT NOT NULL REFERENCES training_sessions(id),
		contact_id TEXT NOT NULL REFERENCES contacts(id),
		attendance TEXT NOT NULL DEFAULT 'REGISTERED' CHECK (attendance IN ('REGISTERED', 'ATTENDED', 'ABSENT')),
		PRIMARY KEY (training_id, contact_id)
	);`,
	`CREATE TABLE IF NOT EXISTS printing_jobs (
		id TEXT PRIMARY KEY,
		business_unit_id TEXT NOT NULL REFERENCES business_units(id),
		client_id TEXT NOT NULL,
		reference TEXT NOT NULL UNIQUE,
		title TEXT NOT NULL,
		specifications TEXT NOT NULL,
		quantity INTEGER NOT NULL CHECK (quantity > 0),
		assigned_to TEXT REFERENCES users(id),
		due_at TIMESTAMPTZ,
		status TEXT NOT NULL DEFAULT 'QUEUED' CHECK (status IN ('QUEUED', 'IN_PROGRESS', 'READY', 'DELIVERED', 'CANCELLED')),
		is_demo BOOLEAN NOT NULL DEFAULT FALSE,
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		FOREIGN KEY (client_id, business_unit_id) REFERENCES clients(id, business_unit_id)
	);`,
	`CREATE INDEX IF NOT EXISTS printing_unit_status_idx ON printing_jobs (business_unit_id, status);`,
	`CREATE TABLE IF NOT EXISTS quotations (
		id TEXT PRIMARY KEY,
		business_unit_id TEXT NOT NULL REFERENCES business_units(id),
		client_id TEXT NOT NULL,
		project_id TEXT,
		reference TEXT NOT NULL UNIQUE,
		currency TEXT NOT NULL DEFAULT 'NGN' CHECK (LENGTH(currency) = 3 AND currency = UPPER(currency)),
		status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SENT', 'ACCEPTED', 'DECLINED', 'EXPIRED')),
		subtotal_minor INTEGER NOT NULL CHECK (subtotal_minor >= 0),
		discount_minor INTEGER NOT NULL DEFAULT 0 CHECK (discount_minor >= 0),
		tax_minor INTEGER NOT NULL DEFAULT 0 CHECK (tax_minor >= 0),
		total_minor INTEGER NOT NULL CHECK (total_minor >= 0),
		due_at TIMESTAMPTZ,
		is_demo BOOLEAN NOT NULL DEFAULT FALSE,
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		FOREIGN KEY (client_id, business_unit_id) REFERENCES clients(id, business_unit_id),
		FOREIGN KEY (project_id, business_unit_id) REFERENCES projects(id, business_unit_id),
		UNIQUE (id, business_unit_id, currency),
		CHECK (discount_minor <= subtotal_minor AND total_minor = subtotal_minor - discount_minor + tax_minor)
	);`,
	`CREATE INDEX IF NOT EXISTS quotations_unit_status_idx ON quotations (business_unit_id, status);`,
	`CREATE TABLE IF NOT EXISTS quotation_items (
		id TEXT PRIMARY KEY,
		quotation_id TEXT NOT NULL REFERENCES quotations(id),
		description TEXT NOT NULL,
		quantity INTEGER NOT NULL CHECK (quantity > 0),
		unit_price_minor INTEGER NOT NULL CHECK (unit_price_minor >= 0),
		total_minor INTEGER NOT NULL CHECK (total_minor >= 0),
		CHECK (total_minor = quantity * unit_price_minor)
	);`,
	`CREATE INDEX IF NOT EXISTS quotation_items_parent_idx ON quotation_items (quotation_id);`,
	`CREATE TABLE IF NOT EXISTS invoices (
		id TEXT PRIMARY KEY,
		business_unit_id TEXT NOT NULL REFERENCES business_units(id),
		client_id TEXT NOT NULL,
		project_id TEXT,
		reference TEXT NOT NULL UNIQUE,
		currency TEXT NOT NULL DEFAULT 'NGN' CHECK (LENGTH(currency) = 3 AND currency = UPPER(currency)),
		status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'ISSUED', 'VOID')),
		subtotal_minor INTEGER NOT NULL CHECK (subtotal_minor >= 0),
		discount_minor INTEGER NOT NULL DEFAULT 0 CHECK (discount_minor >= 0),
		tax_minor INTEGER NOT NULL DEFAULT 0 CHECK (tax_minor >= 0),
		total_minor INTEGER NOT NULL CHECK (total_minor >= 0),
		quotation_id TEXT REFERENCES quotations(id),
		due_at TIMESTAMPTZ,
		is_demo BOOLEAN NOT NULL DEFAULT FALSE,
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		FOREIGN KEY (client_id, business_unit_id) REFERENCES clients(id, business_unit_id),
		FOREIGN KEY (project_id, business_unit_id) REFERENCES projects(id, business_unit_id),
		UNIQUE (id, business_unit_id, currency),
		CHECK (discount_minor <= subtotal_minor AND total_minor = subtotal_minor - discount_minor + tax_minor)
	);`,
	`CREATE INDEX IF NOT EXISTS invoices_unit_status_idx ON invoices (business_unit_id, status);`,
	`CREATE TABLE IF NOT EXISTS invoice_items (
		id TEXT PRIMARY KEY,
		invoice_id TEXT NOT NULL REFERENCES invoices(id),
		description TEXT NOT NULL,
		quantity INTEGER NOT NULL CHECK (quantity > 0),
		unit_price_minor INTEGER NOT NULL CHECK (unit_price_minor >= 0),
		total_minor INTEGER NOT NULL CHECK (total_minor >= 0),
		CHECK (total_minor = quantity * unit_price_minor)
	);`,
	`CREATE INDEX IF NOT EXISTS invoice_items_parent_idx ON invoice_items (invoice_id);`,
	`CREATE TABLE IF NOT EXISTS payments (
		id TEXT PRIMARY KEY,
		business_unit_id TEXT NOT NULL REFERENCES business_units(id),
		invoice_id TEXT NOT NULL,
		reference TEXT NOT NULL UNIQUE,
		external_reference TEXT UNIQUE,
		currency TEXT NOT NULL,
		amount_minor INTEGER NOT NULL CHECK (amount_minor > 0),
		method TEXT NOT NULL CHECK (method IN ('BANK_TRANSFER', 'CASH', 'OTHER')),
		status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'FAILED')),
		received_at TIMESTAMPTZ,
		recorded_by TEXT NOT NULL REFERENCES users(id),
		is_demo BOOLEAN NOT NULL DEFAULT FALSE,
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		FOREIGN KEY (invoice_id, business_unit_id, currency) REFERENCES invoices(id, business_unit_id, currency)
	);`,
	`CREATE INDEX IF NOT EXISTS payments_invoice_idx ON payments (invoice_id);`,
	`CREATE INDEX IF NOT EXISTS payments_unit_date_idx ON payments (business_unit_id, received_at);`,
	`CREATE TABLE IF NOT EXISTS expenses (
		id TEXT PRIMARY KEY,
		business_unit_id TEXT NOT NULL REFERENCES business_units(id),
		project_id TEXT,
		reference TEXT NOT NULL UNIQUE,
		description TEXT NOT NULL,
		category TEXT NOT NULL,
		amount_minor INTEGER NOT NULL CHECK (amount_minor > 0),
		currency TEXT NOT NULL DEFAULT 'NGN',
		incurred_at TIMESTAMPTZ NOT NULL,
		status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'APPROVED', 'PAID', 'REJECTED')),
		recorded_by TEXT NOT NULL REFERENCES users(id),
		is_demo BOOLEAN NOT NULL DEFAULT FALSE,
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		FOREIGN KEY (project_id, business_unit_id) REFERENCES projects(id, business_unit_id)
	);`,
	`CREATE INDEX IF NOT EXISTS expenses_unit_date_idx ON expenses (business_unit_id, incurred_at);`,
	`CREATE TABLE IF NOT EXISTS files (
		id TEXT PRIMARY KEY,
		business_unit_id TEXT NOT NULL REFERENCES business_units(id),
		uploaded_by TEXT NOT NULL REFERENCES users(id),
		name TEXT NOT NULL,
		mime_type TEXT NOT NULL,
		size_bytes INTEGER NOT NULL CHECK (size_bytes >= 0),
		storage_key TEXT NOT NULL UNIQUE,
		status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'AVAILABLE', 'DELETED')),
		client_id TEXT REFERENCES clients(id),
		inquiry_id TEXT REFERENCES inquiries(id),
		project_id TEXT REFERENCES projects(id),
		training_id TEXT REFERENCES training_sessions(id),
		printing_job_id TEXT REFERENCES printing_jobs(id),
		invoice_id TEXT REFERENCES invoices(id),
		expense_id TEXT REFERENCES expenses(id),
		is_demo BOOLEAN NOT NULL DEFAULT FALSE,
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		CHECK ((client_id IS NOT NULL)::int + (inquiry_id IS NOT NULL)::int + (project_id IS NOT NULL)::int + (training_id IS NOT NULL)::int + (printing_job_id IS NOT NULL)::int + (invoice_id IS NOT NULL)::int + (expense_id IS NOT NULL)::int <= 1)
	);`,
	`CREATE INDEX IF NOT EXISTS files_unit_idx ON files (business_unit_id);`,
	`CREATE TABLE IF NOT EXISTS notifications (
		id TEXT PRIMARY KEY,
		business_unit_id TEXT NOT NULL REFERENCES business_units(id),
		user_id TEXT NOT NULL REFERENCES users(id),
		title TEXT NOT NULL,
		body TEXT NOT NULL,
		href TEXT,
		read_at TIMESTAMPTZ,
		is_demo BOOLEAN NOT NULL DEFAULT FALSE,
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);`,
	`CREATE INDEX IF NOT EXISTS notifications_user_unread_idx ON notifications (user_id, read_at);`,
	`CREATE TABLE IF NOT EXISTS settings (
		id TEXT PRIMARY KEY,
		business_unit_id TEXT NOT NULL REFERENCES business_units(id),
		key TEXT NOT NULL,
		value JSONB NOT NULL,
		updated_by TEXT NOT NULL REFERENCES users(id),
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		UNIQUE (business_unit_id, key)
	);`,
	`CREATE TABLE IF NOT EXISTS audit_logs (
		id TEXT PRIMARY KEY,
		business_unit_id TEXT NOT NULL REFERENCES business_units(id),
		actor_id TEXT REFERENCES users(id),
		action TEXT NOT NULL,
		entity_type TEXT NOT NULL,
		entity_id TEXT NOT NULL,
		metadata JSONB,
		is_demo BOOLEAN NOT NULL DEFAULT FALSE,
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);`,
	`CREATE INDEX IF NOT EXISTS audit_unit_date_idx ON audit_logs (business_unit_id, created_at);`,
	`CREATE INDEX IF NOT EXISTS audit_entity_idx ON audit_logs (entity_type, entity_id);`,
];

function getClient() {
	return new Client({
		connectionString: requiredDatabaseUrl,
		ssl: { rejectUnauthorized: false },
	});
}

export async function applySupabaseSchema() {
	const client = getClient();
	await client.connect();
	try {
		for (const statement of schemaStatements) {
			await client.query(statement);
		}
	} finally {
		await client.end();
	}
}

export async function seedSupabaseDatabase(password: string) {
	const client = getClient();
	await client.connect();
	try {
		const now = new Date('2026-09-28T09:00:00Z');
		const passwordHashes = await Promise.all([
			hashPassword(password),
			hashPassword(password),
			hashPassword(password),
		]);
		await client.query(
			`INSERT INTO business_units (id, slug, name, active, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, $5)
			ON CONFLICT (id) DO NOTHING;`,
			['services', 'professional-services', 'Professional & Digital Services', true, now],
		);
		await client.query(
			`INSERT INTO business_units (id, slug, name, active, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, $5)
			ON CONFLICT (id) DO NOTHING;`,
			['eatery', 'eatery', 'SA’A Eatery', false, now],
		);
		await client.query(
			`INSERT INTO service_categories (id, business_unit_id, slug, name)
			VALUES ($1, $2, $3, $4), ($5, $2, $6, $7), ($8, $2, $9, $10)
			ON CONFLICT (id) DO NOTHING;`,
			['consultancy', 'services', 'management-consultancy', 'Management Consultancy', 'digital', 'digital-services', 'Digital Services', 'printing', 'printing-branding-design', 'Printing, Branding & Creative Design'],
		);
		await client.query(
			`INSERT INTO users (id, name, email, password_hash, status, must_change_password, is_demo, created_at, updated_at)
			VALUES ($1, $2, $3, $4, 'ACTIVE', TRUE, TRUE, $5, $5), ($6, $7, $8, $9, 'ACTIVE', TRUE, TRUE, $5, $5), ($10, $11, $12, $13, 'ACTIVE', TRUE, TRUE, $5, $5)
			ON CONFLICT (id) DO NOTHING;`,
			['demo-admin', 'Demo Administrator', 'admin@saa.example', passwordHashes[0], now, 'demo-manager', 'Demo Services Manager', 'manager@saa.example', passwordHashes[1], 'demo-finance', 'Demo Finance Officer', 'finance@saa.example', passwordHashes[2]],
		);
		await client.query(
			`INSERT INTO roles (id, name, description, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $4), ($5, $6, $7, $4, $4), ($8, $9, $10, $4, $4)
			ON CONFLICT (id) DO NOTHING;`,
			['demo-administrator','Demo Administrator','Sample all-module role scoped through user_roles', now, 'demo-services-manager','Demo Services Manager','Sample service operations role', 'demo-finance-officer','Demo Finance Officer','Sample finance role'],
		);
		await client.query(
			`INSERT INTO permissions (id, description)
			VALUES ('inquiries.view', 'inquiries view'), ('inquiries.manage', 'inquiries manage'), ('services.view', 'services view'), ('services.manage', 'services manage'), ('clients.view', 'clients view'), ('clients.manage', 'clients manage'), ('projects.view', 'projects view'), ('projects.manage', 'projects manage'), ('users.view', 'users view'), ('users.manage', 'users manage'), ('quotations.view', 'quotations view'), ('quotations.manage', 'quotations manage'), ('invoices.view', 'invoices view'), ('invoices.manage', 'invoices manage'), ('payments.view', 'payments view'), ('payments.manage', 'payments manage'), ('expenses.view', 'expenses view'), ('expenses.manage', 'expenses manage')
			ON CONFLICT (id) DO NOTHING;`,
		);
		await client.query(
			`INSERT INTO role_permissions (role_id, permission_id)
			VALUES ('demo-administrator', 'inquiries.view'), ('demo-administrator', 'inquiries.manage'), ('demo-administrator', 'services.view'), ('demo-administrator', 'services.manage'), ('demo-administrator', 'clients.view'), ('demo-administrator', 'clients.manage'), ('demo-administrator', 'projects.view'), ('demo-administrator', 'projects.manage'), ('demo-administrator', 'users.view'), ('demo-administrator', 'users.manage'), ('demo-administrator', 'quotations.view'), ('demo-administrator', 'quotations.manage'), ('demo-administrator', 'invoices.view'), ('demo-administrator', 'invoices.manage'), ('demo-administrator', 'payments.view'), ('demo-administrator', 'payments.manage'), ('demo-administrator', 'expenses.view'), ('demo-administrator', 'expenses.manage')
			ON CONFLICT (role_id, permission_id) DO NOTHING;`,
		);
		await client.query(
			`INSERT INTO user_roles (user_id, role_id, business_unit_id)
			VALUES ('demo-admin', 'demo-administrator', 'services'), ('demo-manager', 'demo-services-manager', 'services'), ('demo-finance', 'demo-finance-officer', 'services')
			ON CONFLICT (user_id, role_id, business_unit_id) DO NOTHING;`,
		);
		await client.query(
			`INSERT INTO contacts (id, name, email, organization, is_demo, created_at, updated_at)
			VALUES ($1, $2, $3, $4, TRUE, $5, $5), ($6, $7, $8, $9, TRUE, $5, $5), ($10, $11, $12, $13, TRUE, $5, $5)
			ON CONFLICT (id) DO NOTHING;`,
			['demo-contact-1', 'Amina Demo', 'amina@example.com', 'Example Community Initiative', now, 'demo-contact-2', 'Musa Demo', 'musa@example.com', 'Example Learning Centre', 'demo-contact-3', 'Zara Demo', 'zara@example.com', 'Example Print Client'],
		);
		await client.query(
			`INSERT INTO clients (id, business_unit_id, contact_id, reference, status, notes, is_demo, created_at, updated_at)
			VALUES ($1, $2, $3, $4, 'ACTIVE', $5, TRUE, $6, $6), ($7, $2, $8, $9, 'ACTIVE', $5, TRUE, $6, $6)
			ON CONFLICT (id) DO NOTHING;`,
			['demo-client-1', 'services', 'demo-contact-1', 'DEMO-CL-001', 'Fictional development record', now, 'demo-client-2', 'demo-contact-2', 'DEMO-CL-002'],
		);
		await client.query(
			`INSERT INTO inquiries (id, reference, contact_id, business_unit_id, category_id, service_id, subject, status, assigned_to, is_demo, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, 'OPEN', $8, TRUE, $9, $9), ($10, $11, $12, $4, $13, $14, $15, 'AWAITING_CUSTOMER', $8, TRUE, $9, $9), ($16, $17, $18, $4, $19, $20, $21, 'NEW', $8, TRUE, $9, $9)
			ON CONFLICT (id) DO NOTHING;`,
			['demo-inquiry-1', 'DEMO-INQ-001', 'demo-contact-1', 'services', 'consultancy', 'consultancy-service-1', 'DEMO: Capacity-building workshop', 'demo-manager', now, 'demo-inquiry-2', 'DEMO-INQ-002', 'demo-contact-2', 'digital', 'digital-service-1', 'DEMO: Digital support request', 'demo-inquiry-3', 'DEMO-INQ-003', 'demo-contact-3', 'printing', 'printing-service-1', 'DEMO: Printed learning materials'],
		);
		await client.query(
			`INSERT INTO invoices (id, business_unit_id, client_id, project_id, reference, currency, status, subtotal_minor, discount_minor, tax_minor, total_minor, quotation_id, due_at, is_demo, created_at, updated_at)
			VALUES ('demo-invoice-1', 'services', 'demo-client-1', NULL, 'DEMO-INV-001', 'NGN', 'ISSUED', 15000000, 0, 0, 15000000, NULL, $1, TRUE, $2, $2)
			ON CONFLICT (id) DO NOTHING;`,
			[now, now],
		);
		await client.query(
			`INSERT INTO payments (id, business_unit_id, invoice_id, reference, external_reference, currency, amount_minor, method, status, received_at, recorded_by, is_demo, created_at, updated_at)
			VALUES ('demo-payment-1', 'services', 'demo-invoice-1', 'DEMO-PAY-001', NULL, 'NGN', 5000000, 'BANK_TRANSFER', 'CONFIRMED', $1, 'demo-finance', TRUE, $1, $1)
			ON CONFLICT (id) DO NOTHING;`,
			[now],
		);
		await client.query(
			`INSERT INTO settings (id, business_unit_id, key, value, updated_by, created_at, updated_at)
			VALUES ('demo-setting-1', 'services', 'demo.dashboard.currency', to_jsonb('NGN'::text), 'demo-admin', $1, $1)
			ON CONFLICT (id) DO NOTHING;`,
			[now],
		);
		await client.query(
			`INSERT INTO audit_logs (id, business_unit_id, actor_id, action, entity_type, entity_id, metadata, is_demo, created_at)
			VALUES ('demo-audit-1', 'services', 'demo-admin', 'DEMO_SEED', 'seed', 'non-eatery-v1', to_jsonb('{"fictional": true, "version": 1}'::jsonb), TRUE, $1)
			ON CONFLICT (id) DO NOTHING;`,
			[now],
		);
	} finally {
		await client.end();
	}
}

async function main() {
	if (process.argv.includes('--schema')) {
		await applySupabaseSchema();
		console.log('Supabase schema created.');
		return;
	}
	const seedPassword = process.env.SEED_PASSWORD;
	if (!seedPassword || seedPassword.length < 8) {
		throw new Error('SEED_PASSWORD must be supplied when seeding the live Supabase database.');
	}
	await seedSupabaseDatabase(seedPassword);
	console.log('Supabase sample data inserted.');
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : 'Supabase DB setup failed.');
	process.exitCode = 1;
});
