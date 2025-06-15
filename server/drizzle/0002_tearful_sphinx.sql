ALTER TABLE "favorites" ADD COLUMN "title" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "favorites" ADD COLUMN "poster" varchar(255);--> statement-breakpoint
ALTER TABLE "favorites" ADD COLUMN "release_date" varchar(32);--> statement-breakpoint
ALTER TABLE "favorites" ADD COLUMN "overview" text;