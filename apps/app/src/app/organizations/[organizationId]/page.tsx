import { css } from "@flows/styled-system/css";
import { getAuth } from "auth/server";
import { api } from "lib/api";
import Link from "next/link";
import { redirect } from "next/navigation";
import { routes } from "routes";
import { Text } from "ui";

type Props = {
  params: { organizationId: string };
};

export default async function ProjectsPage({ params }: Props): Promise<JSX.Element> {
  const auth = await getAuth();
  if (!auth) return redirect(routes.login());
  const data = await api["/organizations/:organizationId/projects"](params.organizationId)({
    token: auth.access_token,
  });

  return (
    <div>
      <Text className={css({ mb: "space16" })} variant="title3xl">
        Projects
      </Text>
      {data.map((project) => (
        <div key={project.id}>
          <Link href={routes.project({ projectId: project.id })}>
            <Text
              className={css({ _hover: { textDecoration: "underline" } })}
              color="primary"
              variant="titleL"
            >
              {project.name}
            </Text>
          </Link>
          <Text>Created: {new Date(project.created_at).toLocaleDateString()}</Text>
          <Text>Updated: {new Date(project.updated_at).toLocaleDateString()}</Text>
        </div>
      ))}
    </div>
  );
}
