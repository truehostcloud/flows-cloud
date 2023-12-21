import { relations } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import {
  index,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { projects } from "./project";

export const flowTypeEnum = pgEnum("flow_type", ["cloud", "local"]);
export type FlowType = (typeof flowTypeEnum.enumValues)[number];
export enum FlowTypeEnum {
  CLOUD = "cloud",
  LOCAL = "local",
}

export const flowFrequencyEnum = pgEnum("flow_frequency", ["once", "every-time"]);
export type FlowFrequency = (typeof flowFrequencyEnum.enumValues)[number];
export enum FlowFrequencyEnum {
  ONCE = "once",
  EVERYTIME = "every-time",
}

export const flows = pgTable(
  "flow",
  {
    id: uuid("id").notNull().unique().primaryKey().defaultRandom(),
    human_id: text("human_id").notNull(),
    human_id_alias: text("human_id_alias"),
    project_id: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    flow_version_id: uuid("flow_version_id").references((): AnyPgColumn => flowVersions.id),
    flow_type: flowTypeEnum("flow_type").notNull(),
    description: text("description").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
    frequency: flowFrequencyEnum("frequency"),
    published_at: timestamp("published_at"),
    preview_url: text("preview_url"),
  },
  (table) => {
    return {
      humanIdIdx: index("human_id_idx").on(table.human_id),
      humanIdAliasIdx: index("human_id_alias_idx").on(table.human_id_alias),
      humanIdProjectIdIdx: uniqueIndex("human_id_project_id_idx").on(
        table.project_id,
        table.human_id,
      ),
    };
  },
);

export const flowsRelations = relations(flows, ({ one }) => ({
  version: one(flowVersions, {
    fields: [flows.flow_version_id],
    references: [flowVersions.id],
  }),
}));

export const flowVersions = pgTable("flow_version", {
  id: uuid("id").notNull().unique().primaryKey().defaultRandom(),
  flow_id: uuid("flow_id")
    .notNull()
    .references(() => flows.id, { onDelete: "cascade" }),
  data: json("data").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});
