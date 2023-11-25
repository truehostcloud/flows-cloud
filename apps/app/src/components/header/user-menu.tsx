import { css } from "@flows/styled-system/css";
import { getAuth } from "auth/server";
import { UserCircle24 } from "icons";
import { api } from "lib/api";
import Link from "next/link";
import { redirect } from "next/navigation";
import { routes } from "routes";
import { Icon, Popover, PopoverContent, PopoverTrigger, Text } from "ui";

type Props = {
  projectId?: string;
  organizationId?: string;
};

export const UserMenu = async ({ organizationId, projectId }: Props): Promise<JSX.Element> => {
  const auth = await getAuth();
  if (!auth) return redirect(routes.login());
  const fetchCtx = { token: auth.access_token };

  const [
    project,
    organizations,
    // orgDetail
  ] = await Promise.all([
    projectId ? api["/projects/:projectId"](projectId)(fetchCtx) : null,
    api["/organizations"]()(fetchCtx),
    // organizationId ? api["/organizations/:organizationId"](organizationId)(fetchCtx) : null,
  ]);
  const orgId = project?.organization_id ?? organizationId;
  const orgProjects = await (() => {
    if (!orgId) return;
    return api["/organizations/:organizationId/projects"](orgId)(fetchCtx);
  })();

  return (
    <Popover>
      <PopoverTrigger>
        <Icon className={css({ cursor: "pointer" })} icon={UserCircle24} />
      </PopoverTrigger>
      <PopoverContent>
        <Text color="muted" variant="bodyXs">
          {auth.user.email}
        </Text>

        {project && orgProjects ? (
          <>
            <Text variant="titleM">Projects</Text>
            {orgProjects.map((proj) => {
              const active = proj.id === projectId;
              return (
                <Link href={routes.project({ projectId: proj.id })} key={proj.id}>
                  <Text color={active ? "primary" : undefined} variant="bodyS">
                    {proj.name}
                  </Text>
                </Link>
              );
            })}
          </>
        ) : null}

        <Text variant="titleM">Organizations</Text>
        {organizations.map((org) => {
          const active = org.id === orgId;
          return (
            <Link href={routes.organization({ organizationId: org.id })} key={org.id}>
              <Text color={active ? "primary" : undefined} variant="bodyS">
                {org.name}
              </Text>
            </Link>
          );
        })}
      </PopoverContent>
    </Popover>
  );
};
