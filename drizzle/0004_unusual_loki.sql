CREATE TABLE `firebase_accounts` (
	`project_id` text NOT NULL,
	`firebase_uid` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text NOT NULL,
	PRIMARY KEY(`project_id`, `firebase_uid`),
	FOREIGN KEY (`user_id`) REFERENCES `accounts`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `firebase_accounts_user_project_unique` ON `firebase_accounts` (`project_id`,`user_id`);