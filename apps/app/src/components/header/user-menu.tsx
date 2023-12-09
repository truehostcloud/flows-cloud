"use client";

import { css } from "@flows/styled-system/css";
import { useAuth } from "auth/client";
import { Settings16 } from "icons";
import type { FC } from "react";
import { t } from "translations";
import { Icon, Popover, PopoverContent, PopoverTrigger, Text } from "ui";

import { LogoutButton } from "./logout-button";
import { MenuSection } from "./menu-section";
import { ThemeSwitch } from "./theme-switch";

export const UserMenu: FC = () => {
  const auth = useAuth();

  if (!auth) return null;

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
      <PopoverContent>
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
