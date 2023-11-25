import { css } from "@flows/styled-system/css";
import { getAuth } from "auth/server";
import { api } from "lib/api";
import Link from "next/link";
import { redirect } from "next/navigation";
import { routes } from "routes";
import { Text } from "ui";

import { CreateFlowDialog } from "./create-flow-dialog";

type Props = {
  params: { projectId: string };
};

export default async function ProjectDetailPage({
  params: { projectId },
}: Props): Promise<JSX.Element> {
  const auth = await getAuth();
  if (!auth) return redirect(routes.login());
  const fetchCtx = { token: auth.access_token };
  const [data, project] = await Promise.all([
    api["/projects/:projectId/flows"](projectId)(fetchCtx),
    api["/projects/:projectId"](projectId)(fetchCtx),
  ]);

  return (
    <div>
      <div className={css({ display: "flex", alignItems: "center" })}>
        <Text className={css({ mb: "space16", flex: 1 })} variant="title3xl">
          {project.name}
        </Text>
        <CreateFlowDialog projectId={projectId} />
      </div>
      <div className={css({ display: "flex", flexDirection: "column", gap: "space12" })}>
        {data.map((flow) => (
          <div key={flow.id}>
            <Link href={routes.flow({ flowId: flow.id, projectId })}>
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
