import { index, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { organizations } from "./organization";

export const projects = pgTable(
  "project",
  {
    id: uuid("id").notNull().unique().primaryKey().defaultRandom(),
    human_id: text("human_id").notNull(),
    human_id_alias: text("human_id_alias"),
    organization_id: uuid("organization_id")
      .notNull()
      .references(() => organizations.id),
    name: text("name").notNull(),
    description: text("description"),
    domains: text("domains").array().notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      humanIdIdx: index("human_id_idx").on(table.human_id),
      humanIdAliasIdx: index("human_id_alias_idx").on(table.human_id_alias),
      humanIdOrganizationIdIdx: uniqueIndex("human_id_organization_id_idx").on(
        table.organization_id,
        table.human_id,
      ),
      domainIdx: index("domain_idx").on(table.domains),
    };
  },
);
