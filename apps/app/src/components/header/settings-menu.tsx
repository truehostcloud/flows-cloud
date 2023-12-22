"use client";

import { css } from "@flows/styled-system/css";
import { useAuth } from "auth/client";
import { Settings16 } from "icons";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { FC } from "react";
import { routes } from "routes";
import { t } from "translations";
import { Icon, Popover, PopoverContent, PopoverTrigger, Text } from "ui";

import { LogoutButton } from "./logout-button";
import { MenuItem } from "./menu-item";
import { MenuSection } from "./menu-section";
import { ThemeSwitch } from "./theme-switch";

export const SettingsMenu: FC = () => {
  const { projectId, organizationId } = useParams<{ projectId?: string; organizationId: string }>();

  const SETTINGS_MENU_OPTIONS = [
    {
      label: "Personal settings TODO",
    },
    ...(projectId
      ? [
          {
            label: "Project settings",
            href: routes.projectSettings({ organizationId, projectId }),
          },
        ]
      : [
          {
            label: "Project settings",
          },
        ]),
    {
      label: "Organization settings",
      href: routes.organizationSettings({ organizationId }),
    },
  ];
  const auth = useAuth();

  if (!auth) return null;

  //TODO: Handle organization settings state

  return (
    <Popover>
      <PopoverTrigger>
        <div
          className={css({
            cursor: "pointer",
            padding: "space8",
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: "border",
            borderRadius: "radius8",
            backgroundColor: "bg.muted",
            transitionDuration: "fast",
            transitionTimingFunction: "easeInOut",
            transitionProperty: "background-color",
            "&:hover": {
              bg: "bg.hover",
            },
          })}
        >
          <Icon icon={Settings16} />
        </div>
      </PopoverTrigger>
      <PopoverContent align="end">
        <div
          className={css({
            minWidth: "280px",
          })}
        >
          <MenuSection background="bg.muted" bottomBorder header>
            <Text variant="titleS">John Doe</Text>
            <Text color="muted" variant="bodyXs">
              {auth.user.email}
            </Text>
          </MenuSection>
          <MenuSection bottomBorder>
            {SETTINGS_MENU_OPTIONS.map((option) =>
              option.href ? (
                <MenuItem asChild key={option.label}>
                  <Link href={option.href}>
                    <Text as="span" variant="bodyS">
                      {option.label}
                    </Text>
                  </Link>
                </MenuItem>
              ) : (
                <MenuItem asChild disabled key={option.label}>
                  <Text as="span" color="disabled" variant="bodyS">
                    {option.label}
                  </Text>
                </MenuItem>
              ),
            )}
          </MenuSection>
          <MenuSection bottomBorder>
            <div
              className={css({
                display: "flex",
                gap: "space48",
                p: "space8",
                alignItems: "center",
              })}
            >
              <Text variant="bodyS">{t.settings.theme}</Text>
              <ThemeSwitch />
            </div>
          </MenuSection>

          <MenuSection background="bg.muted">
            <LogoutButton />
          </MenuSection>
        </div>
      </PopoverContent>
    </Popover>
  );
};
