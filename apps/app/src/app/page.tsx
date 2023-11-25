import { css } from "@flows/styled-system/css";
import { getAuth } from "auth/server";
import { api } from "lib/api";
import Link from "next/link";
import { redirect } from "next/navigation";
import { routes } from "routes";
import { Text } from "ui";

export default async function Index(): Promise<JSX.Element> {
  const auth = await getAuth();
  if (!auth) return redirect(routes.login());
  const organizations = await api["/organizations"]()({ token: auth.access_token });

  return (
    <div className={css({ maxWidth: "1100px", mx: "auto", py: "space32" })}>
      <Text className={css({ mb: "space16" })} variant="title3xl">
        Home
      </Text>

      <Text className={css({ mb: "space12" })} variant="titleXl">
        My Organizations
      </Text>
      {organizations.map((org) => (
        <Link href={routes.organization({ organizationId: org.id })} key={org.id}>
          <Text
            className={css({ _hover: { textDecoration: "underline" } })}
            color="primary"
            variant="titleL"
          >
            {org.name}
          </Text>
        </Link>
      ))}
    </div>
  );
}
