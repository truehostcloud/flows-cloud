"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { type FC, useMemo } from "react";
import { routes } from "routes";
import { Tabs, TabsList, TabsTrigger } from "ui";

type Props = {
  cloudFlow?: boolean;
};

export const FlowTabs: FC<Props> = ({ cloudFlow }) => {
  const { projectId, organizationId, flowId } = useParams<{
    projectId: string;
    organizationId: string;
    flowId: string;
  }>();
  const pathname = usePathname();

  const items = useMemo(
    () => [
      { title: "Overview", href: routes.flow({ organizationId, projectId, flowId }) },
      { title: "Analytics", href: routes.flowAnalytics({ organizationId, projectId, flowId }) },
      ...(cloudFlow
        ? [
            { title: "Steps", href: routes.flowSteps({ organizationId, projectId, flowId }) },
            {
              title: "Versions",
              href: routes.flowVersions({ organizationId, projectId, flowId }),
              active: pathname.startsWith(
                routes.flowVersions({ organizationId, projectId, flowId }),
              ),
            },
          ]
        : []),

      { title: "Settings", href: routes.flowSettings({ organizationId, projectId, flowId }) },
    ],
    [cloudFlow, flowId, organizationId, pathname, projectId],
  );

  const currentItem = useMemo(
    () => items.find((item) => item.active ?? item.href === pathname),
    [items, pathname],
  );

  return (
    <Tabs value={currentItem?.href}>
      <TabsList>
        {items.map((item) => (
          <TabsTrigger asChild key={item.href} value={item.href}>
            <Link href={item.href}>{item.title}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
