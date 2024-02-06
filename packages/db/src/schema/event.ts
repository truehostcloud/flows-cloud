import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { flows } from "./flow";

export const events = pgTable("event", {
  id: uuid("id").notNull().unique().primaryKey().defaultRandom(),
  flow_id: uuid("flow_id")
    .notNull()
    .references(() => flows.id, { onDelete: "cascade" }),
  event_time: timestamp("event_time").notNull(),
  type: text("type").notNull(),
  flow_hash: text("flow_hash").notNull(),
  user_hash: text("user_hash"),
  step_index: text("step_index"),
  step_hash: text("step_hash"),
  sdk_version: text("sdk_version").notNull(),
  target_element: text("target_element"),
  location: text("location").notNull(),
});
