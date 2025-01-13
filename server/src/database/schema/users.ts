import { relations } from "drizzle-orm";
import { boolean, integer, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { pgTable } from "drizzle-orm/pg-core";
import { type InferSelectModel } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password"),
  name: text("name"),
  refreshTokenVersion: integer("token_version").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  confirmed: boolean("confirmed").notNull().default(false),
});

export type DbUser = InferSelectModel<typeof users>;

export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  provider: text("provider").notNull(), // 'discord', 'google', etc.
  providerId: text("provider_id").notNull(), // external ID from the provider
  providerEmail: text("provider_email"),
  providerUsername: text("provider_username"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));
