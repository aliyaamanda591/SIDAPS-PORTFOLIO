// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const accounts = sqliteTable("accounts", {
  userId: text("user_id").primaryKey(),
  email: text("email").notNull(),
  displayName: text("display_name").notNull(),
  createdAt: text("created_at").notNull(),
  profileDisplayName: text("profile_display_name"),
  lastSeenAt: text("last_seen_at"),
  supportStatus: text("support_status").notNull().default("none"),
  supportNote: text("support_note").notNull().default(""),
  supportUpdatedAt: text("support_updated_at"),
});

export const portfolios = sqliteTable("portfolios", {
  userId: text("user_id").primaryKey(),
  data: text("data").notNull(),
  revision: integer("revision").notNull().default(0),
  updatedAt: text("updated_at").notNull(),
});
