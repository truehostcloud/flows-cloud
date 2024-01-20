import { Flex } from "@flows/styled-system/jsx";
import { api } from "lib/api";
import { load } from "lib/load";
import { Text } from "ui";

import { CssTemplateForm } from "./css-template-form";
import { CssVarsForm } from "./css-vars-form";

type Props = {
  params: { projectId: string };
};

export default async function ProjectTemplatePage({ params }: Props): Promise<JSX.Element> {
  const project = await load(api["/projects/:projectId"](params.projectId));

  return (
    <>
      <Flex flexDirection="column" gap="space8" mb="space16">
        <Text variant="titleXl">Style template</Text>
        <Text color="muted">
          Customize the look and feel of your flows by changing CSS variables or using full CSS
          template.
        </Text>
      </Flex>
      <CssVarsForm project={project} />
      <CssTemplateForm project={project} />
    </>
  );
}
