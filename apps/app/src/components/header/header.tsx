"use client";

import { css } from "@flows/styled-system/css";
import { SettingsMenu } from "components/header/settings-menu";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { type FC } from "react";
import { routes } from "routes";
import { Text } from "ui";

import { Invites } from "./invites";
import { ProjectsMenu } from "./projects-menu";

export const Header: FC = () => {
  const { projectId, organizationId } = useParams<{ projectId: string; organizationId: string }>();

  const HEADER_ITEMS = [
    {
      label: "Home",
      href: routes.project({ organizationId, projectId }),
    },
  ];

  return (
    <>
      <header
        className={css({
          display: "flex",
          px: "space24",
          py: "space4",
          minHeight: "56px",
          borderBottomWidth: "1px",
          borderStyle: "solid",
          borderColor: "border",
        })}
      >
        <div className={css({ flex: 1, display: "flex", gap: "space24", alignItems: "center" })}>
          <Link
            className={css({
              display: "inline-flex",
              alignItems: "center",
              gap: "space8",
            })}
            href={routes.home}
          >
            <Image alt="Logo" height={32} src="/logo.svg" width={32} />
          </Link>

          <nav>
            <ul className={css({ display: "flex" })}>
              {HEADER_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <Text variant="titleM">{item.label}</Text>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={css({ display: "flex", gap: "space12", alignItems: "center" })}>
          <SettingsMenu />
          <ProjectsMenu />
        </div>
      </header>

      <Invites />
    </>
  );
};
