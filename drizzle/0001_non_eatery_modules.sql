CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	`must_change_password` integer DEFAULT true NOT NULL,
	`is_demo` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	CONSTRAINT "user_status_check" CHECK("users"."status" in ('ACTIVE', 'DISABLED')),
	CONSTRAINT "user_email_normalized" CHECK("users"."email" = lower(trim("users"."email")))
);

--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);

--> statement-breakpoint
CREATE UNIQUE INDEX `roles_name_unique` ON `roles` (`name`);
--> statement-breakpoint
CREATE TABLE `permissions` (
	`id` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL
);

--> statement-breakpoint
CREATE TABLE `role_permissions` (
	`role_id` text NOT NULL,
	`permission_id` text NOT NULL,
	PRIMARY KEY(`role_id`, `permission_id`),
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON UPDATE no action ON DELETE no action
);

--> statement-breakpoint
CREATE TABLE `user_roles` (
	`user_id` text NOT NULL,
	`role_id` text NOT NULL,
	`business_unit_id` text NOT NULL,
	PRIMARY KEY(`user_id`, `role_id`, `business_unit_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`business_unit_id`) REFERENCES `business_units`(`id`) ON UPDATE no action ON DELETE no action
);

--> statement-breakpoint
CREATE INDEX `user_roles_unit_idx` ON `user_roles` (`business_unit_id`);
--> statement-breakpoint
CREATE TABLE `employees` (
	`id` text PRIMARY KEY NOT NULL,
	`business_unit_id` text NOT NULL,
	`user_id` text,
	`employee_number` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`job_title` text NOT NULL,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	`is_demo` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`business_unit_id`) REFERENCES `business_units`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "employee_status_check" CHECK("employees"."status" in ('ACTIVE', 'INACTIVE'))
);

--> statement-breakpoint
CREATE UNIQUE INDEX `employees_user_id_unique` ON `employees` (`user_id`);
--> statement-breakpoint
CREATE UNIQUE INDEX `employees_employee_number_unique` ON `employees` (`employee_number`);
--> statement-breakpoint
CREATE INDEX `employees_unit_idx` ON `employees` (`business_unit_id`);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `service_categories`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "services_sort_order_check" CHECK(typeof("services"."sort_order") = 'integer' and "services"."sort_order" >= 0 and "services"."sort_order" <= 9007199254740991)
);

--> statement-breakpoint
CREATE UNIQUE INDEX `services_category_slug_unique` ON `services` (`category_id`,`slug`);
--> statement-breakpoint
CREATE UNIQUE INDEX `services_id_category_unique` ON `services` (`id`,`category_id`);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`organization` text,
	`is_demo` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);

--> statement-breakpoint
CREATE INDEX `contacts_email_idx` ON `contacts` (`email`);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` text PRIMARY KEY NOT NULL,
	`business_unit_id` text NOT NULL,
	`contact_id` text NOT NULL,
	`reference` text NOT NULL,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	`notes` text,
	`is_demo` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`business_unit_id`) REFERENCES `business_units`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "client_status_check" CHECK("clients"."status" in ('ACTIVE', 'INACTIVE'))
);

--> statement-breakpoint
CREATE UNIQUE INDEX `clients_reference_unique` ON `clients` (`reference`);
--> statement-breakpoint
CREATE UNIQUE INDEX `clients_contact_unit_unique` ON `clients` (`contact_id`,`business_unit_id`);
--> statement-breakpoint
CREATE UNIQUE INDEX `clients_id_unit_unique` ON `clients` (`id`,`business_unit_id`);
--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`contact_id` text NOT NULL,
	`business_unit_id` text NOT NULL,
	`category_id` text NOT NULL,
	`service_id` text,
	`subject` text NOT NULL,
	`status` text DEFAULT 'NEW' NOT NULL,
	`assigned_to` text,
	`is_demo` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`business_unit_id`) REFERENCES `business_units`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`,`business_unit_id`) REFERENCES `service_categories`(`id`,`business_unit_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`service_id`,`category_id`) REFERENCES `services`(`id`,`category_id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "inquiry_status_check" CHECK("inquiries"."status" in ('NEW', 'OPEN', 'AWAITING_CUSTOMER', 'RESOLVED', 'CLOSED'))
);

--> statement-breakpoint
CREATE UNIQUE INDEX `inquiries_reference_unique` ON `inquiries` (`reference`);
--> statement-breakpoint
CREATE INDEX `inquiries_unit_status_date_idx` ON `inquiries` (`business_unit_id`,`status`,`created_at`);
--> statement-breakpoint
CREATE INDEX `inquiries_contact_idx` ON `inquiries` (`contact_id`);
--> statement-breakpoint
CREATE INDEX `inquiries_assignee_idx` ON `inquiries` (`assigned_to`);
--> statement-breakpoint
CREATE TABLE `inquiry_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`inquiry_id` text NOT NULL,
	`author_type` text NOT NULL,
	`contact_author_id` text,
	`staff_author_id` text,
	`body` text NOT NULL,
	`email_delivery_status` text DEFAULT 'NOT_APPLICABLE' NOT NULL,
	`is_demo` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`inquiry_id`) REFERENCES `inquiries`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`contact_author_id`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`staff_author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "message_author_check" CHECK(("inquiry_messages"."author_type" = 'CONTACT' and "inquiry_messages"."contact_author_id" is not null and "inquiry_messages"."staff_author_id" is null) or ("inquiry_messages"."author_type" = 'STAFF' and "inquiry_messages"."staff_author_id" is not null and "inquiry_messages"."contact_author_id" is null)),
	CONSTRAINT "message_delivery_check" CHECK("inquiry_messages"."email_delivery_status" in ('PENDING', 'SENT', 'FAILED', 'NOT_APPLICABLE'))
);

--> statement-breakpoint
CREATE INDEX `messages_inquiry_date_idx` ON `inquiry_messages` (`inquiry_id`,`created_at`);
--> statement-breakpoint
CREATE TABLE `inquiry_assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`inquiry_id` text NOT NULL,
	`assigned_to` text NOT NULL,
	`assigned_by` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`inquiry_id`) REFERENCES `inquiries`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assigned_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);

--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`business_unit_id` text NOT NULL,
	`client_id` text NOT NULL,
	`reference` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`manager_id` text,
	`status` text DEFAULT 'PLANNED' NOT NULL,
	`start_date` integer,
	`end_date` integer,
	`is_demo` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`business_unit_id`) REFERENCES `business_units`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`manager_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`,`business_unit_id`) REFERENCES `clients`(`id`,`business_unit_id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "project_status_check" CHECK("projects"."status" in ('PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED')),
	CONSTRAINT "project_dates_check" CHECK("projects"."end_date" is null or "projects"."start_date" is null or "projects"."end_date" >= "projects"."start_date")
);

--> statement-breakpoint
CREATE UNIQUE INDEX `projects_reference_unique` ON `projects` (`reference`);
--> statement-breakpoint
CREATE UNIQUE INDEX `projects_id_unit_unique` ON `projects` (`id`,`business_unit_id`);
--> statement-breakpoint
CREATE INDEX `projects_unit_status_idx` ON `projects` (`business_unit_id`,`status`);
--> statement-breakpoint
CREATE TABLE `training_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`business_unit_id` text NOT NULL,
	`client_id` text,
	`project_id` text,
	`title` text NOT NULL,
	`theme` text NOT NULL,
	`venue` text,
	`facilitator_id` text,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`status` text DEFAULT 'PLANNED' NOT NULL,
	`is_demo` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`business_unit_id`) REFERENCES `business_units`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`facilitator_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`,`business_unit_id`) REFERENCES `clients`(`id`,`business_unit_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`project_id`,`business_unit_id`) REFERENCES `projects`(`id`,`business_unit_id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "training_status_check" CHECK("training_sessions"."status" in ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
	CONSTRAINT "training_dates_check" CHECK("training_sessions"."end_date" >= "training_sessions"."start_date")
);

--> statement-breakpoint
CREATE INDEX `training_unit_date_idx` ON `training_sessions` (`business_unit_id`,`start_date`);
--> statement-breakpoint
CREATE TABLE `training_participants` (
	`training_id` text NOT NULL,
	`contact_id` text NOT NULL,
	`attendance` text DEFAULT 'REGISTERED' NOT NULL,
	PRIMARY KEY(`training_id`, `contact_id`),
	FOREIGN KEY (`training_id`) REFERENCES `training_sessions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "attendance_check" CHECK("training_participants"."attendance" in ('REGISTERED', 'ATTENDED', 'ABSENT'))
);

--> statement-breakpoint
CREATE TABLE `printing_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`business_unit_id` text NOT NULL,
	`client_id` text NOT NULL,
	`reference` text NOT NULL,
	`title` text NOT NULL,
	`specifications` text NOT NULL,
	`quantity` integer NOT NULL,
	`assigned_to` text,
	`due_at` integer,
	`status` text DEFAULT 'QUEUED' NOT NULL,
	`is_demo` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`business_unit_id`) REFERENCES `business_units`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`,`business_unit_id`) REFERENCES `clients`(`id`,`business_unit_id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "printing_status_check" CHECK("printing_jobs"."status" in ('QUEUED', 'IN_PROGRESS', 'READY', 'DELIVERED', 'CANCELLED')),
	CONSTRAINT "printing_quantity_integer" CHECK(typeof("printing_jobs"."quantity") = 'integer' and "printing_jobs"."quantity" >= 0 and "printing_jobs"."quantity" <= 9007199254740991),
	CONSTRAINT "printing_quantity_positive" CHECK("printing_jobs"."quantity" > 0)
);

--> statement-breakpoint
CREATE UNIQUE INDEX `printing_jobs_reference_unique` ON `printing_jobs` (`reference`);
--> statement-breakpoint
CREATE INDEX `printing_unit_status_idx` ON `printing_jobs` (`business_unit_id`,`status`);
--> statement-breakpoint
CREATE TABLE `quotations` (
	`id` text PRIMARY KEY NOT NULL,
	`business_unit_id` text NOT NULL,
	`client_id` text NOT NULL,
	`project_id` text,
	`reference` text NOT NULL,
	`currency` text DEFAULT 'NGN' NOT NULL,
	`status` text DEFAULT 'DRAFT' NOT NULL,
	`subtotal_minor` integer NOT NULL,
	`discount_minor` integer DEFAULT 0 NOT NULL,
	`tax_minor` integer DEFAULT 0 NOT NULL,
	`total_minor` integer NOT NULL,
	`due_at` integer,
	`is_demo` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`business_unit_id`) REFERENCES `business_units`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`,`business_unit_id`) REFERENCES `clients`(`id`,`business_unit_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`project_id`,`business_unit_id`) REFERENCES `projects`(`id`,`business_unit_id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "quotations_status_check" CHECK("quotations"."status" in ('DRAFT', 'SENT', 'ACCEPTED', 'DECLINED', 'EXPIRED')),
	CONSTRAINT "quotations_currency_check" CHECK(length("quotations"."currency") = 3 and "quotations"."currency" = upper("quotations"."currency")),
	CONSTRAINT "quotations_subtotal_check" CHECK(typeof("quotations"."subtotal_minor") = 'integer' and "quotations"."subtotal_minor" >= 0 and "quotations"."subtotal_minor" <= 9007199254740991),
	CONSTRAINT "quotations_discount_check" CHECK(typeof("quotations"."discount_minor") = 'integer' and "quotations"."discount_minor" >= 0 and "quotations"."discount_minor" <= 9007199254740991),
	CONSTRAINT "quotations_tax_check" CHECK(typeof("quotations"."tax_minor") = 'integer' and "quotations"."tax_minor" >= 0 and "quotations"."tax_minor" <= 9007199254740991),
	CONSTRAINT "quotations_total_check" CHECK(typeof("quotations"."total_minor") = 'integer' and "quotations"."total_minor" >= 0 and "quotations"."total_minor" <= 9007199254740991),
	CONSTRAINT "quotations_calculation_check" CHECK("quotations"."discount_minor" <= "quotations"."subtotal_minor" and "quotations"."total_minor" = "quotations"."subtotal_minor" - "quotations"."discount_minor" + "quotations"."tax_minor")
);

--> statement-breakpoint
CREATE UNIQUE INDEX `quotations_reference_unique` ON `quotations` (`reference`);
--> statement-breakpoint
CREATE UNIQUE INDEX `quotations_id_unit_currency_unique` ON `quotations` (`id`,`business_unit_id`,`currency`);
--> statement-breakpoint
CREATE INDEX `quotations_unit_status_idx` ON `quotations` (`business_unit_id`,`status`);
--> statement-breakpoint
CREATE TABLE `quotation_items` (
	`id` text PRIMARY KEY NOT NULL,
	`quotation_id` text NOT NULL,
	`description` text NOT NULL,
	`quantity` integer NOT NULL,
	`unit_price_minor` integer NOT NULL,
	`total_minor` integer NOT NULL,
	FOREIGN KEY (`quotation_id`) REFERENCES `quotations`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "quotation_item_price_check" CHECK(typeof("quotation_items"."unit_price_minor") = 'integer' and "quotation_items"."unit_price_minor" >= 0 and "quotation_items"."unit_price_minor" <= 9007199254740991),
	CONSTRAINT "quotation_item_total_check" CHECK(typeof("quotation_items"."total_minor") = 'integer' and "quotation_items"."total_minor" >= 0 and "quotation_items"."total_minor" <= 9007199254740991),
	CONSTRAINT "quotation_item_quantity_check" CHECK(typeof("quotation_items"."quantity") = 'integer' and "quotation_items"."quantity" >= 0 and "quotation_items"."quantity" <= 9007199254740991),
	CONSTRAINT "quotation_item_calculation_check" CHECK("quotation_items"."quantity" > 0 and "quotation_items"."total_minor" = "quotation_items"."quantity" * "quotation_items"."unit_price_minor")
);

--> statement-breakpoint
CREATE INDEX `quotation_items_parent_idx` ON `quotation_items` (`quotation_id`);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`business_unit_id` text NOT NULL,
	`client_id` text NOT NULL,
	`project_id` text,
	`reference` text NOT NULL,
	`currency` text DEFAULT 'NGN' NOT NULL,
	`status` text DEFAULT 'DRAFT' NOT NULL,
	`subtotal_minor` integer NOT NULL,
	`discount_minor` integer DEFAULT 0 NOT NULL,
	`tax_minor` integer DEFAULT 0 NOT NULL,
	`total_minor` integer NOT NULL,
	`quotation_id` text,
	`due_at` integer,
	`is_demo` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`business_unit_id`) REFERENCES `business_units`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`quotation_id`) REFERENCES `quotations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`,`business_unit_id`) REFERENCES `clients`(`id`,`business_unit_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`project_id`,`business_unit_id`) REFERENCES `projects`(`id`,`business_unit_id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "invoices_status_check" CHECK("invoices"."status" in ('DRAFT', 'ISSUED', 'VOID')),
	CONSTRAINT "invoices_currency_check" CHECK(length("invoices"."currency") = 3 and "invoices"."currency" = upper("invoices"."currency")),
	CONSTRAINT "invoices_subtotal_check" CHECK(typeof("invoices"."subtotal_minor") = 'integer' and "invoices"."subtotal_minor" >= 0 and "invoices"."subtotal_minor" <= 9007199254740991),
	CONSTRAINT "invoices_discount_check" CHECK(typeof("invoices"."discount_minor") = 'integer' and "invoices"."discount_minor" >= 0 and "invoices"."discount_minor" <= 9007199254740991),
	CONSTRAINT "invoices_tax_check" CHECK(typeof("invoices"."tax_minor") = 'integer' and "invoices"."tax_minor" >= 0 and "invoices"."tax_minor" <= 9007199254740991),
	CONSTRAINT "invoices_total_check" CHECK(typeof("invoices"."total_minor") = 'integer' and "invoices"."total_minor" >= 0 and "invoices"."total_minor" <= 9007199254740991),
	CONSTRAINT "invoices_calculation_check" CHECK("invoices"."discount_minor" <= "invoices"."subtotal_minor" and "invoices"."total_minor" = "invoices"."subtotal_minor" - "invoices"."discount_minor" + "invoices"."tax_minor")
);

--> statement-breakpoint
CREATE UNIQUE INDEX `invoices_reference_unique` ON `invoices` (`reference`);
--> statement-breakpoint
CREATE UNIQUE INDEX `invoices_id_unit_currency_unique` ON `invoices` (`id`,`business_unit_id`,`currency`);
--> statement-breakpoint
CREATE INDEX `invoices_unit_status_idx` ON `invoices` (`business_unit_id`,`status`);
--> statement-breakpoint
CREATE TABLE `invoice_items` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice_id` text NOT NULL,
	`description` text NOT NULL,
	`quantity` integer NOT NULL,
	`unit_price_minor` integer NOT NULL,
	`total_minor` integer NOT NULL,
	FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "invoice_item_price_check" CHECK(typeof("invoice_items"."unit_price_minor") = 'integer' and "invoice_items"."unit_price_minor" >= 0 and "invoice_items"."unit_price_minor" <= 9007199254740991),
	CONSTRAINT "invoice_item_total_check" CHECK(typeof("invoice_items"."total_minor") = 'integer' and "invoice_items"."total_minor" >= 0 and "invoice_items"."total_minor" <= 9007199254740991),
	CONSTRAINT "invoice_item_quantity_check" CHECK(typeof("invoice_items"."quantity") = 'integer' and "invoice_items"."quantity" >= 0 and "invoice_items"."quantity" <= 9007199254740991),
	CONSTRAINT "invoice_item_calculation_check" CHECK("invoice_items"."quantity" > 0 and "invoice_items"."total_minor" = "invoice_items"."quantity" * "invoice_items"."unit_price_minor")
);

--> statement-breakpoint
CREATE INDEX `invoice_items_parent_idx` ON `invoice_items` (`invoice_id`);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` text PRIMARY KEY NOT NULL,
	`business_unit_id` text NOT NULL,
	`invoice_id` text NOT NULL,
	`reference` text NOT NULL,
	`external_reference` text,
	`currency` text NOT NULL,
	`amount_minor` integer NOT NULL,
	`method` text NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`received_at` integer,
	`recorded_by` text NOT NULL,
	`is_demo` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`business_unit_id`) REFERENCES `business_units`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`recorded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`invoice_id`,`business_unit_id`,`currency`) REFERENCES `invoices`(`id`,`business_unit_id`,`currency`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "payment_amount_check" CHECK(typeof("payments"."amount_minor") = 'integer' and "payments"."amount_minor" >= 0 and "payments"."amount_minor" <= 9007199254740991),
	CONSTRAINT "payment_amount_positive" CHECK("payments"."amount_minor" > 0),
	CONSTRAINT "payment_method_check" CHECK("payments"."method" in ('BANK_TRANSFER', 'CASH', 'OTHER')),
	CONSTRAINT "payment_status_check" CHECK("payments"."status" in ('PENDING', 'CONFIRMED', 'FAILED'))
);

--> statement-breakpoint
CREATE UNIQUE INDEX `payments_reference_unique` ON `payments` (`reference`);
--> statement-breakpoint
CREATE UNIQUE INDEX `payments_external_reference_unique` ON `payments` (`external_reference`);
--> statement-breakpoint
CREATE INDEX `payments_invoice_idx` ON `payments` (`invoice_id`);
--> statement-breakpoint
CREATE INDEX `payments_unit_date_idx` ON `payments` (`business_unit_id`,`received_at`);
--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` text PRIMARY KEY NOT NULL,
	`business_unit_id` text NOT NULL,
	`project_id` text,
	`reference` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`amount_minor` integer NOT NULL,
	`currency` text DEFAULT 'NGN' NOT NULL,
	`incurred_at` integer NOT NULL,
	`status` text DEFAULT 'DRAFT' NOT NULL,
	`recorded_by` text NOT NULL,
	`is_demo` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`business_unit_id`) REFERENCES `business_units`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`recorded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`project_id`,`business_unit_id`) REFERENCES `projects`(`id`,`business_unit_id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "expense_amount_check" CHECK(typeof("expenses"."amount_minor") = 'integer' and "expenses"."amount_minor" >= 0 and "expenses"."amount_minor" <= 9007199254740991),
	CONSTRAINT "expense_amount_positive" CHECK("expenses"."amount_minor" > 0),
	CONSTRAINT "expense_status_check" CHECK("expenses"."status" in ('DRAFT', 'APPROVED', 'PAID', 'REJECTED'))
);

--> statement-breakpoint
CREATE UNIQUE INDEX `expenses_reference_unique` ON `expenses` (`reference`);
--> statement-breakpoint
CREATE INDEX `expenses_unit_date_idx` ON `expenses` (`business_unit_id`,`incurred_at`);
--> statement-breakpoint
CREATE TABLE `files` (
	`id` text PRIMARY KEY NOT NULL,
	`business_unit_id` text NOT NULL,
	`uploaded_by` text NOT NULL,
	`name` text NOT NULL,
	`mime_type` text NOT NULL,
	`size_bytes` integer NOT NULL,
	`storage_key` text NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`client_id` text,
	`inquiry_id` text,
	`project_id` text,
	`training_id` text,
	`printing_job_id` text,
	`invoice_id` text,
	`expense_id` text,
	`is_demo` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`business_unit_id`) REFERENCES `business_units`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`inquiry_id`) REFERENCES `inquiries`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`training_id`) REFERENCES `training_sessions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`printing_job_id`) REFERENCES `printing_jobs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`expense_id`) REFERENCES `expenses`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "file_size_check" CHECK(typeof("files"."size_bytes") = 'integer' and "files"."size_bytes" >= 0 and "files"."size_bytes" <= 9007199254740991),
	CONSTRAINT "file_status_check" CHECK("files"."status" in ('PENDING', 'AVAILABLE', 'DELETED')),
	CONSTRAINT "file_single_owner_check" CHECK(("files"."client_id" is not null)+("files"."inquiry_id" is not null)+("files"."project_id" is not null)+("files"."training_id" is not null)+("files"."printing_job_id" is not null)+("files"."invoice_id" is not null)+("files"."expense_id" is not null) <= 1)
);

--> statement-breakpoint
CREATE UNIQUE INDEX `files_storage_key_unique` ON `files` (`storage_key`);
--> statement-breakpoint
CREATE INDEX `files_unit_idx` ON `files` (`business_unit_id`);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`business_unit_id` text NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`href` text,
	`read_at` integer,
	`is_demo` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`business_unit_id`) REFERENCES `business_units`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);

--> statement-breakpoint
CREATE INDEX `notifications_user_unread_idx` ON `notifications` (`user_id`,`read_at`);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` text PRIMARY KEY NOT NULL,
	`business_unit_id` text NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`updated_by` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`business_unit_id`) REFERENCES `business_units`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);

--> statement-breakpoint
CREATE UNIQUE INDEX `settings_unit_key_unique` ON `settings` (`business_unit_id`,`key`);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`business_unit_id` text NOT NULL,
	`actor_id` text,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`metadata` text,
	`is_demo` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`business_unit_id`) REFERENCES `business_units`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`actor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);

--> statement-breakpoint
CREATE INDEX `audit_unit_date_idx` ON `audit_logs` (`business_unit_id`,`created_at`);
--> statement-breakpoint
CREATE INDEX `audit_entity_idx` ON `audit_logs` (`entity_type`,`entity_id`);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_id_unit_unique` ON `service_categories` (`id`,`business_unit_id`);
