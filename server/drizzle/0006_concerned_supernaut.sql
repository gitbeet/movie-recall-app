ALTER TABLE "watchlists" RENAME TO "watchlist";--> statement-breakpoint
ALTER TABLE "watchlist" DROP CONSTRAINT "watchlists_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;