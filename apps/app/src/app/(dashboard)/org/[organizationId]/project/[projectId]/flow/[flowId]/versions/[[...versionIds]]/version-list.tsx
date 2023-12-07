import { css } from "@flows/styled-system/css";
import type { FlowVersion } from "lib/api";
import Link from "next/link";
import type { FC } from "react";
import { routes } from "routes";
import { Text } from "ui";

type Props = {
  versions: FlowVersion[];
  activeVersionId?: string;
  organizationId: string;
  projectId: string;
  flowId: string;
};

export const VersionList: FC<Props> = ({
  versions,
  activeVersionId,
  flowId,
  organizationId,
  projectId,
}) => {
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "space8",
      })}
    >
      {versions.map((version) => {
        const active = version.id === activeVersionId;
        return (
          <Link
            href={routes.flowVersions({ flowId, organizationId, projectId, versionId: version.id })}
            key={version.id}
          >
            <div
              className={css({
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: active ? "border.primary" : "border.strong",
                borderRadius: "radius8",
                px: "space8",
                py: "space8",
                transitionProperty: "all",
                transitionDuration: "fast",
                transitionTimingFunction: "easeInOut",
                _hover: {
                  backgroundColor: "bg.hover",
                },
                cursor: active ? "default" : undefined,
                "&&&": {
                  backgroundColor: active ? "bg.primary" : undefined,
                },
              })}
            >
              <Text color={active ? "onPrimary" : undefined} variant="titleS">
                {new Date(version.created_at).toLocaleString()}
              </Text>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
