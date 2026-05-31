import { pgTable, text, serial } from "drizzle-orm/pg-core";

export const siteSettingsTable = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  discordUrl: text("discord_url").notNull().default(""),
});
