import { css } from "@flows/styled-system/css";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Text } from "ui";

import { getAuth } from "../../auth/server";
import { api } from "../../lib/api";

export default async function ProjectsPage(): Promise<JSX.Element> {
  const auth = await getAuth();
  if (!auth) return redirect("/login");
  const data = await api["/organizations/:organizationId/projects"](
    "a9493fa5-af60-40a5-b260-479a29a2dff8",
  )({
    token: auth.token,
  });

  return (
    <div>
      <Text className={css({ mb: "space16" })} variant="title3xl">
        Projects
      </Text>
      {data.map((project) => (
        <div key={project.id}>
          <Link href={`/projects/${project.id}`}>
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
