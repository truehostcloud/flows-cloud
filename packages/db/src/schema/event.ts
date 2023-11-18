import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { flows } from "./flow";
import { projects } from "./project";

export const events = pgTable("event", {
  id: uuid("id").notNull().unique().primaryKey().defaultRandom(),
  project_id: uuid("project_id")
    .notNull()
    .references(() => projects.id),
  flow_id: uuid("flow_id")
    .notNull()
    .references(() => flows.id),
  event_time: timestamp("event_time").notNull(),
  type: text("type").notNull(),
  flow_hash: text("flow_hash").notNull(),
  user_hash: text("user_hash").notNull(),
  step_index: integer("step_index").notNull(),
  step_hash: text("step_hash").notNull(),
});
