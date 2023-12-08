"use client";

import { css } from "@flows/styled-system/css";
import { useAuth } from "auth/client";
import { CreateOrganizationDialog } from "components/organizations";
import { CreateProjectDialog } from "components/projects";
import { UserCircle24 } from "icons";
import { api } from "lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { FC } from "react";
import { routes } from "routes";
import useSWR from "swr";
import { Button, Icon, Popover, PopoverContent, PopoverTrigger, Text } from "ui";

import { LogoutButton } from "./logout-button";
import { ThemeSwitch } from "./theme-switch";

export const UserMenu: FC = () => {
  const { organizationId, projectId } = useParams<{
    organizationId?: string;
    projectId?: string;
  }>();

  const auth = useAuth();

  const { data: organizations } = useSWR(
    "/organizations",
    auth ? () => api["/organizations"]()({ token: auth.token }) : null,
  );
  const { data: projects } = useSWR(
    organizationId ? `/organizations/${organizationId}/projects` : null,
    auth && organizationId
      ? () => api["/organizations/:organizationId/projects"](organizationId)({ token: auth.token })
      : null,
  );

  if (!auth) return null;

  return (
    <Popover>
      <PopoverTrigger>
        <Icon className={css({ cursor: "pointer" })} icon={UserCircle24} />
      </PopoverTrigger>
      <PopoverContent>
        <Text color="muted" variant="bodyXs">
          {auth.user.email}
        </Text>

        {organizationId && projects ? (
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
        {organizations?.map((org) => {
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

        <div className={css({ mt: "space24" })}>
          <ThemeSwitch />
        </div>

        <div className={css({ mt: "space8" })}>
          <LogoutButton />
        </div>
      </PopoverContent>
    </Popover>
  );
};
