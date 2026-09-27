CREATE TABLE `business_units` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`active` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `business_units_slug_unique` ON `business_units` (`slug`);--> statement-breakpoint
CREATE TABLE `service_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`business_unit_id` text NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	FOREIGN KEY (`business_unit_id`) REFERENCES `business_units`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `service_categories_slug_unique` ON `service_categories` (`slug`);