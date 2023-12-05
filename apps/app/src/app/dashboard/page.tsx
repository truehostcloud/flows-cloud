import { css } from "@flows/styled-system/css";
import { getAuth } from "auth/server";
import { CreateOrganizationDialog } from "components/organizations";
import { api } from "lib/api";
import { redirect } from "next/navigation";
import { routes } from "routes";
import { Button, Text } from "ui";

export default async function DashboardPage(): Promise<JSX.Element> {
  const auth = await getAuth();
  if (!auth) return redirect(routes.login());
  const organizations = await api["/organizations"]()({ token: auth.access_token });

  if (!organizations.length)
    return (
      <div className={css({ display: "flex" })}>
        <Text className={css({ flex: "1" })}>No organizations found</Text>
        <CreateOrganizationDialog trigger={<Button>New Organization</Button>} />
      </div>
    );

  return redirect(routes.organization({ organizationId: organizations[0].id }));
}
