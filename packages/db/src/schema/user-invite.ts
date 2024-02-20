import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { organizations } from "./organization";

export const userInvite = pgTable(
  "user_invite",
  {
    id: uuid("id").notNull().unique().primaryKey().defaultRandom(),
    email: text("email").notNull(),
    organization_id: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    expires_at: timestamp("expires_at").notNull(),
  },
  (table) => {
    return {
      emailIdx: index("user_invite_email_idx").on(table.email),
      organizationIdIdx: index("user_invite_organization_id_idx").on(table.organization_id),
    };
  },
);

export const userInviteRelations = relations(userInvite, ({ one }) => ({
  organization: one(organizations, {
    fields: [userInvite.organization_id],
    references: [organizations.id],
  }),
}));
