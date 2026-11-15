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

export const credentials = sqliteTable("credentials", {
  userId: text("user_id").primaryKey().references(() => accounts.userId),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  recoveryHash: text("recovery_hash").notNull(),
  version: integer("version").notNull().default(1),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  updatedAt: text("updated_at").notNull(),
});
export const sessions = sqliteTable("sessions", {
  tokenHash: text("token_hash").primaryKey(),
  userId: text("user_id").notNull().references(() => accounts.userId),
  credentialVersion: integer("credential_version").notNull(),
  expiresAt: integer("expires_at").notNull(),
  createdAt: text("created_at").notNull(),
});
export const authLimits = sqliteTable("auth_limits", {
  key: text("key").primaryKey(),
  attempts: integer("attempts").notNull(),
  windowStart: integer("window_start").notNull(),
});

export const passwordResetOtps = sqliteTable("password_reset_otps", {
  emailHash: text("email_hash").primaryKey(),
  challengeHash: text("challenge_hash").notNull().unique(),
  otpHash: text("otp_hash").notNull(),
  userId: text("user_id").references(() => accounts.userId),
  credentialVersion: integer("credential_version").notNull(),
  attempts: integer("attempts").notNull().default(0),
  requestedAt: integer("requested_at").notNull(),
  expiresAt: integer("expires_at").notNull(),
  ready: integer("ready").notNull().default(0),
});
