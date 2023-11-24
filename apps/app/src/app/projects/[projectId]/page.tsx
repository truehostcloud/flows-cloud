import { css } from "@flows/styled-system/css";
import { getAuth } from "auth/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { routes } from "routes";
import { Text } from "ui";

import { api } from "../../../lib/api";
import { CreateFlow } from "./create-flow";

export default async function ProjectDetailPage({
  params,
}: {
  params: { projectId: string };
}): Promise<JSX.Element> {
  const auth = await getAuth();
  if (!auth) return redirect(routes.login());
  const data = await api["/projects/:projectId/flows"](params.projectId)({
    token: auth.access_token,
  });

  return (
    <div>
      <div className={css({ display: "flex", alignItems: "center" })}>
        <Text className={css({ mb: "space16", flex: 1 })} variant="title3xl">
          Flows
        </Text>
        <CreateFlow projectId={params.projectId} />
      </div>
      <div className={css({ display: "flex", flexDirection: "column", gap: "space12" })}>
        {data.map((flow) => (
          <div key={flow.id}>
            <Link href={routes.flow({ flowId: flow.id })}>
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
