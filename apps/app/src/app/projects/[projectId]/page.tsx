import { css } from "@flows/styled-system/css";
import { getAuth } from "auth/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Text } from "ui";

import { api } from "../../../lib/api";

export default async function ProjectDetailPage({
  params,
}: {
  params: { projectId: string };
}): Promise<JSX.Element> {
  const auth = await getAuth();
  if (!auth) return redirect("/login");
  const data = await api["/projects/:projectId/flows"](params.projectId)({
    token: auth.access_token,
  });

  return (
    <div>
      <Text className={css({ mb: "space16" })} variant="title3xl">
        Flows
      </Text>
      <div className={css({ display: "flex", flexDirection: "column", gap: "space12" })}>
        {data.map((flow) => (
          <div key={flow.id}>
            <Link href={`/flows/${flow.id}`}>
              <Text
                className={css({ _hover: { textDecoration: "underline" } })}
                color="primary"
                variant="titleL"
              >
                {flow.name}
              </Text>
            </Link>
            <Text>Created: {new Date(flow.created_at).toLocaleDateString()}</Text>
            <Text>Updated: {new Date(flow.updated_at).toLocaleDateString()}</Text>
          </div>
        ))}
      </div>
    </div>
  );
}
