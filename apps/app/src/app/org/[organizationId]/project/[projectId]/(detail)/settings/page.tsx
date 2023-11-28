import { css } from "@flows/styled-system/css";
import { api } from "lib/api";
import { load } from "lib/load";
import { Text } from "ui";

import { ProjectEditForm } from "./project-edit-form";

type Props = {
  params: { projectId: string };
};

export default async function ProjectSettingsPage({ params }: Props): Promise<JSX.Element> {
  const project = await load(api["/projects/:projectId"](params.projectId));

  return (
    <>
      <Text className={css({ mb: "space16", flex: 1 })} variant="title3xl">
        {project.name}
      </Text>

      <ProjectEditForm project={project} />
    </>
  );
}
