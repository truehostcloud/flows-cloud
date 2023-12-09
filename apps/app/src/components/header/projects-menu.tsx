"use client";

import { css } from "@flows/styled-system/css";
import { useAuth } from "auth/client";
import { CreateOrganizationDialog } from "components/organizations";
import { CreateProjectDialog } from "components/projects";
import { ChevronDown16, Plus16 } from "icons";
import { api } from "lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { FC } from "react";
import { routes } from "routes";
import useSWR from "swr";
import { t } from "translations";
import { Icon, Popover, PopoverContent, PopoverTrigger, Text } from "ui";

import { MenuItem } from "./menu-item";
import { MenuSection } from "./menu-section";

export const ProjectsMenu: FC = () => {
  const { organizationId, projectId } = useParams<{
    organizationId?: string;
    projectId?: string;
  }>();

  const auth = useAuth();
  const { data: organizations } = useSWR(
    auth ? [auth.token, "/organizations"] : null,
    auth ? () => api["/organizations"]()({ token: auth.token }) : null,
  );
  const { data: projects } = useSWR(
    auth && organizationId ? [auth.token, `/organizations/${organizationId}/projects`] : null,
    auth && organizationId
      ? () => api["/organizations/:organizationId/projects"](organizationId)({ token: auth.token })
      : null,
  );

  const currentOrg = organizations?.find((org) => org.id === organizationId);
  const currentProject = projects?.find((proj) => proj.id === projectId);

  if (!auth) return null;

  return (
    <Popover>
      <PopoverTrigger
        className={css({
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "space8",
          paddingY: "space4",
          paddingX: "space8",
          borderRadius: "radius8",
          transitionDuration: "fast",
          transitionTimingFunction: "easeInOut",
          transitionProperty: "background-color",
          maxWidth: "160px",
          minWidth: "80px",
          overflow: "hidden",
          "&:hover": {
            bg: "bg.hover",
          },
        })}
      >
        <div
          className={css({
            overflow: "hidden",
            flex: 1,
          })}
        >
          <Text
            className={css({
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            })}
            color="muted"
            variant="bodyXs"
            weight="600"
          >
            {currentProject?.name}
          </Text>
          <Text
            className={css({
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            })}
            color="muted"
            variant="bodyXs"
          >
            {currentOrg?.name}
          </Text>
        </div>
        <Icon icon={ChevronDown16} />
      </PopoverTrigger>
      <PopoverContent>
        <div
          className={css({
            minWidth: "300px",
          })}
        >
          {organizationId && projects ? (
            <>
              <MenuSection background="bg.muted" bottomBorder header>
                <Text align="center" variant="bodyS" weight="600">
                  {currentOrg?.name} projects ({projects.length})
                </Text>
              </MenuSection>
              <MenuSection bottomBorder>
                {projects.map((proj) => {
                  return (
                    <MenuItem key={proj.id}>
                      <Link href={routes.project({ projectId: proj.id, organizationId })}>
                        <Text variant="titleS">{proj.name}</Text>
                      </Link>
                    </MenuItem>
                  );
                })}
                <CreateProjectDialog
                  organizationId={organizationId}
                  trigger={
                    <button type="button">
                      <MenuItem>
                        <Icon color="icon" icon={Plus16} />
                        <Text color="muted" variant="bodyS">
                          {t.actions.newProject}
                        </Text>
                      </MenuItem>
                    </button>
                  }
                />
              </MenuSection>
            </>
          ) : null}

          <MenuSection background="bg.muted" bottomBorder header>
            <Text align="center" variant="bodyS" weight="600">
              Organizations ({organizations?.length})
            </Text>
          </MenuSection>
          <MenuSection>
            {organizations?.map((org) => {
              return (
                <MenuItem key={org.id}>
                  <Link href={routes.organization({ organizationId: org.id })}>
                    <Text variant="titleS">{org.name}</Text>
                  </Link>
                </MenuItem>
              );
            })}

            <CreateOrganizationDialog
              trigger={
                <button type="button">
                  <MenuItem>
                    <Icon color="icon" icon={Plus16} />
                    <Text color="muted" variant="bodyS">
                      {t.actions.newOrg}
                    </Text>
                  </MenuItem>
                </button>
              }
            />
          </MenuSection>
        </div>
      </PopoverContent>
    </Popover>
  );
};
