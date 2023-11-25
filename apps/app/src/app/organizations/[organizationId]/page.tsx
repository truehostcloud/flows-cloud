import { css } from "@flows/styled-system/css";
import { getAuth } from "auth/server";
import { api } from "lib/api";
import { redirect } from "next/navigation";
import { routes } from "routes";
import { Text } from "ui";

type Props = {
  params: { organizationId: string };
};

export default async function ProjectsPage({ params }: Props): Promise<JSX.Element> {
  const auth = await getAuth();
  if (!auth) return redirect(routes.login());
  const projects = await api["/organizations/:organizationId/projects"](params.organizationId)({
    token: auth.access_token,
  });
  if (projects.length) return redirect(routes.project({ projectId: projects[0].id }));

  return (
    <>
      <Text className={css({ mb: "space16" })} variant="title3xl">
        Organization
      </Text>
      <Text>No projects found</Text>
    </>
  );
}
