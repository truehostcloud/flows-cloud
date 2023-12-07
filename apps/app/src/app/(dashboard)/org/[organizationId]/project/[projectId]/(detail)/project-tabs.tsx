"use client";

import { css } from "@flows/styled-system/css";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import type { FC } from "react";
import { routes } from "routes";
import { Button } from "ui";

export const ProjectTabs: FC = () => {
  const { projectId, organizationId } = useParams<{ projectId: string; organizationId: string }>();
  const pathname = usePathname();

  return (
    <div className={css({ display: "flex", gap: "space8", mb: "space16" })}>
      {[
        { title: "Flows", href: routes.project({ organizationId, projectId }) },
        { title: "Settings", href: routes.projectSettings({ organizationId, projectId }) },
      ].map((tab) => {
        const active = tab.href === pathname;
        return (
          <Link href={tab.href} key={tab.href}>
            <Button size="small" variant={active ? "primary" : "secondary"}>
              {tab.title}
            </Button>
          </Link>
        );
      })}
    </div>
  );
};
