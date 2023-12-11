import { css } from "@flows/styled-system/css";
import { api } from "lib/api";
import { load } from "lib/load";
import { redirect, RedirectType } from "next/navigation";
import { routes } from "routes";

import { VersionList } from "./version-list";
import { VersionPreview } from "./version-preview";

type Props = {
  params: { flowId: string; organizationId: string; projectId: string; versionIds?: string[] };
};

export default async function FlowVersionsPage({ params }: Props): Promise<JSX.Element> {
  const { flowId, organizationId, versionIds, projectId } = params;
  const versions = await load(api["/flows/:flowId/versions"](flowId));
  const versionId = versionIds?.at(0);
  if (!versionId && versions.length)
    redirect(
      routes.flowVersions({ flowId, organizationId, projectId, versionId: versions[0].id }),
      RedirectType.replace,
    );

  const version = versions.find((v) => v.id === versionId);

  return (
    <div className={css({ display: "flex", gap: "space24" })}>
      <div className={css({ width: "220px", flexShrink: 0 })}>
        <VersionList
          activeVersionId={versionId}
          flowId={flowId}
          organizationId={organizationId}
          projectId={projectId}
          versions={versions}
        />
      </div>
      <div className={css({ flex: 1 })}>
        {version ? <VersionPreview version={version} /> : null}
      </div>
    </div>
  );
}
