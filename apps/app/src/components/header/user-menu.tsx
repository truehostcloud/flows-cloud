import { css } from "@flows/styled-system/css";
import { getAuth } from "auth/server";
import { CreateOrganizationDialog } from "components/organizations";
import { CreateProjectDialog } from "components/projects";
import { UserCircle24 } from "icons";
import { api } from "lib/api";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { routes } from "routes";
import { Button, Icon, Popover, PopoverContent, PopoverTrigger, Text } from "ui";

export const UserMenu = async (): Promise<JSX.Element> => {
  const pathname = headers().get("x-pathname") ?? "";
  const params = pathname.split("/").slice(1);
  const { organizationId, projectId }: { organizationId: string; projectId?: string } = {
    organizationId: params[1],
    projectId: params[3],
  };

  const auth = await getAuth();
  if (!auth) return redirect(routes.login());
  const fetchCtx = { token: auth.access_token };

  const [organizations, projects] = await Promise.all([
    api["/organizations"]()(fetchCtx),
    api["/organizations/:organizationId/projects"](organizationId)(fetchCtx),
  ]);

  return (
    <Popover>
      <PopoverTrigger>
        <Icon className={css({ cursor: "pointer" })} icon={UserCircle24} />
      </PopoverTrigger>
      <PopoverContent>
        <Text color="muted" variant="bodyXs">
          {auth.user.email}
        </Text>

        {organizationId ? (
          <>
            <Text variant="titleM">Projects</Text>
            {projects.map((proj) => {
              const active = proj.id === projectId;
              return (
                <Link href={routes.project({ projectId: proj.id, organizationId })} key={proj.id}>
                  <Text color={active ? "primary" : undefined} variant="bodyS">
                    {proj.name}
                  </Text>
                </Link>
              );
            })}
            <CreateProjectDialog
              organizationId={organizationId}
              trigger={<Button size="small">New Project</Button>}
            />
          </>
        ) : null}

        <Text variant="titleM">Organizations</Text>
        {organizations.map((org) => {
          const active = org.id === organizationId;
          return (
            <Link href={routes.organization({ organizationId: org.id })} key={org.id}>
              <Text color={active ? "primary" : undefined} variant="bodyS">
                {org.name}
              </Text>
            </Link>
          );
        })}

        <CreateOrganizationDialog trigger={<Button size="small">New Organization</Button>} />
      </PopoverContent>
    </Popover>
  );
};
