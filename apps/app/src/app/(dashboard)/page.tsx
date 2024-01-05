import { css } from "@flows/styled-system/css";
import { CreateOrganizationDialog } from "components/organizations";
import { api } from "lib/api";
import { load } from "lib/load";
import type { Metadata } from "next";
import { redirect, RedirectType } from "next/navigation";
import { routes } from "routes";
import { t } from "translations";
import { Button, Text } from "ui";

export const metadata: Metadata = {
  title: "Dashboard | Flows",
};

export default async function DashboardPage(): Promise<JSX.Element> {
  const organizations = await load(api["/organizations"]());

  if (!organizations.length)
    return (
      <div className={css({ display: "flex" })}>
        <Text className={css({ flex: "1" })}>No organizations found</Text>
        <CreateOrganizationDialog trigger={<Button>{t.actions.newOrg}</Button>} />
      </div>
    );

  return redirect(
    routes.organization({ organizationId: organizations[0].id }),
    RedirectType.replace,
  );
}
