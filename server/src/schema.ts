import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(), // integer, auto-increment
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id), // integer, references users.id
  movieId: varchar("movie_id", { length: 64 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  posterUrl: varchar("poster_url", { length: 255 }),
  releaseDate: varchar("release_date", { length: 32 }),
  description: text("description"),
});

// Drizzle ORM relations
export const usersRelations = relations(users, ({ many }) => ({
  favorites: many(favorites),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
}));
