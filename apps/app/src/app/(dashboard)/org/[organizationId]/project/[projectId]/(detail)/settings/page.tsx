import { Flex } from "@flows/styled-system/jsx";
import { api } from "lib/api";
import { load } from "lib/load";
import { Text } from "ui";

import { ProjectDeleteDialog } from "./project-delete-dialog";
import { ProjectEditForm } from "./project-edit-form";

type Props = {
  params: { projectId: string };
};

export default async function ProjectSettingsPage({ params }: Props): Promise<JSX.Element> {
  const project = await load(api["/projects/:projectId"](params.projectId));

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between" mb="space16">
        <Text variant="title3xl">{project.name}</Text>

        <ProjectDeleteDialog project={project} />
      </Flex>

      <ProjectEditForm project={project} />
    </>
  );
}
