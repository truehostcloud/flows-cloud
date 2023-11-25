import { getAuth } from "auth/server";
import { api } from "lib/api";
import { redirect } from "next/navigation";
import { routes } from "routes";
import { Text } from "ui";

export default async function DashboardPage(): Promise<JSX.Element> {
  const auth = await getAuth();
  if (!auth) return redirect(routes.login());
  const organizations = await api["/organizations"]()({ token: auth.access_token });

  if (!organizations.length) return <Text>No organizations found</Text>;

  return redirect(routes.organization({ organizationId: organizations[0].id }));
}
