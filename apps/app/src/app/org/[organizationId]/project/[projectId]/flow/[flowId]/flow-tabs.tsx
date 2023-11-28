"use client";

import { css } from "@flows/styled-system/css";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import type { FC } from "react";
import { routes } from "routes";
import { Button } from "ui";

type Props = {
  showSteps: boolean;
};

export const FlowTabs: FC<Props> = ({ showSteps }) => {
  const { projectId, organizationId, flowId } = useParams<{
    projectId: string;
    organizationId: string;
    flowId: string;
  }>();
  const pathname = usePathname();

  return (
    <div className={css({ display: "flex", gap: "space8", mb: "space16" })}>
      {[
        { title: "Analytics", href: routes.flow({ organizationId, projectId, flowId }) },
        ...(showSteps
          ? [{ title: "Steps", href: routes.flowSteps({ organizationId, projectId, flowId }) }]
          : []),
        { title: "Settings", href: routes.flowSettings({ organizationId, projectId, flowId }) },
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
