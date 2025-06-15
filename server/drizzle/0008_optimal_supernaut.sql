ALTER TABLE "watchlists" RENAME TO "favorites";--> statement-breakpoint
ALTER TABLE "favorites" DROP CONSTRAINT "watchlists_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;