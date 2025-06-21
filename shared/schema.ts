import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const wheelSegments = pgTable("wheel_segments", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  color: text("color").notNull(),
  order: integer("order").notNull(),
});

export const wheelSessions = pgTable("wheel_sessions", {
  id: serial("id").primaryKey(),
  totalSpins: integer("total_spins").notNull().default(0),
  soundEnabled: boolean("sound_enabled").notNull().default(true),
});

export const insertWheelSegmentSchema = createInsertSchema(wheelSegments).omit({
  id: true,
});

export const insertWheelSessionSchema = createInsertSchema(wheelSessions).omit({
  id: true,
});

export type WheelSegment = typeof wheelSegments.$inferSelect;
export type InsertWheelSegment = z.infer<typeof insertWheelSegmentSchema>;
export type WheelSession = typeof wheelSessions.$inferSelect;
export type InsertWheelSession = z.infer<typeof insertWheelSessionSchema>;
