import { css } from "@flows/styled-system/css";
import { api } from "lib/api";
import { load } from "lib/load";
import { Button, Text } from "ui";

import { CreateFlowDialog } from "./create-flow-dialog";
import { FlowsList } from "./flows-list";

type Props = {
  params: { projectId: string };
};

export default async function ProjectDetailPage({
  params: { projectId },
}: Props): Promise<JSX.Element> {
  const [project] = await Promise.all([load(api["/projects/:projectId"](projectId))]);

  return (
    <>
      <div className={css({ display: "flex", alignItems: "center" })}>
        <Text className={css({ mb: "space16", flex: 1 })} variant="titleXl">
          {project.name}
        </Text>
        <CreateFlowDialog
          organizationId={project.organization_id}
          projectId={projectId}
          trigger={<Button variant="black">New flow</Button>}
        />
      </div>

      <FlowsList projectId={projectId} />
    </>
  );
}
