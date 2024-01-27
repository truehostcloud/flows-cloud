import { css } from "@flows/styled-system/css";
import { Book16, Comment16, Log16, Question16, Question24, Slack16 } from "icons";
import Link from "next/link";
import type { FC } from "react";
import { links } from "shared";
import { Icon, Popover, PopoverContent, PopoverTrigger, Text } from "ui";

import { MenuItem } from "./menu-item";
import { MenuSection } from "./menu-section";

export const HelpMenu: FC = () => {
  const PRIMARY_OPTIONS = [
    {
      label: "Documentation",
      icon: Book16,
      href: links.docs,
    },
    {
      label: "Contact support TODO",
      icon: Question16,
    },
    {
      label: "Send feedback TODO",
      icon: Comment16,
    },
  ];

  const SECONDARY_OPTIONS = [
    {
      label: "Changelog TODO",
      icon: Log16,
      href: "",
    },
    {
      label: "Slack community TODO",
      icon: Slack16,
    },
  ];

  return (
    <Popover>
      <PopoverTrigger>
        <div
          className={css({
            cursor: "pointer",
            padding: "space4",
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: "border",
            borderRadius: "100%",
            backgroundColor: "bg",
            fastEaseInOut: "background-color",
            "&:hover": {
              bg: "bg.hover",
            },
          })}
        >
          <Icon icon={Question24} />
        </div>
      </PopoverTrigger>
      <PopoverContent align="end">
        <div
          className={css({
            minWidth: "280px",
          })}
        >
          <MenuSection bottomBorder>
            {PRIMARY_OPTIONS.map((option) =>
              option.href ? (
                <MenuItem asChild key={option.label}>
                  <Link href={option.href} target="_blank">
                    <Icon icon={option.icon} />
                    <Text as="span" variant="bodyS">
                      {option.label}
                    </Text>
                  </Link>
                </MenuItem>
              ) : (
                <MenuItem disabled key={option.label}>
                  <Icon color="text.disabled" icon={option.icon} />
                  <Text as="span" color="disabled" variant="bodyS">
                    {option.label}
                  </Text>
                </MenuItem>
              ),
            )}
          </MenuSection>
          <MenuSection bottomBorder>
            {SECONDARY_OPTIONS.map((option) =>
              option.href ? (
                <MenuItem asChild key={option.label}>
                  <Link href={option.href} target="_blank">
                    <Icon icon={option.icon} />
                    <Text as="span" variant="bodyS">
                      {option.label}
                    </Text>
                  </Link>
                </MenuItem>
              ) : (
                <MenuItem disabled key={option.label}>
                  <Icon color="text.disabled" icon={option.icon} />
                  <Text as="span" color="disabled" variant="bodyS">
                    {option.label}
                  </Text>
                </MenuItem>
              ),
            )}
          </MenuSection>
        </div>
      </PopoverContent>
    </Popover>
  );
};
