import { css } from "@flows/styled-system/css";
import { api } from "lib/api";
import { load } from "lib/load";
import Link from "next/link";
import { routes } from "routes";
import { Text } from "ui";

import { CreateFlowDialog } from "./create-flow-dialog";

type Props = {
  params: { projectId: string };
};

export default async function ProjectDetailPage({
  params: { projectId },
}: Props): Promise<JSX.Element> {
  const [project, flows] = await Promise.all([
    load(api["/projects/:projectId"](projectId)),
    load(api["/projects/:projectId/flows"](projectId)),
  ]);

  return (
    <>
      <div className={css({ display: "flex", alignItems: "center" })}>
        <Text className={css({ mb: "space16", flex: 1 })} variant="title3xl">
          {project.name}
        </Text>
        <CreateFlowDialog organizationId={project.organization_id} projectId={projectId} />
      </div>

      <div className={css({ display: "flex", flexDirection: "column", gap: "space12" })}>
        {flows.map((flow) => (
          <div key={flow.id}>
            <Link
              href={routes.flow({
                flowId: flow.id,
                projectId,
                organizationId: project.organization_id,
              })}
            >
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
    </>
  );
}
