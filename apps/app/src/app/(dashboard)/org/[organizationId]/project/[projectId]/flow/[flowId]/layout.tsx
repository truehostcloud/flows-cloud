import { css } from "@flows/styled-system/css";
import { api } from "lib/api";
import { load } from "lib/load";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Text } from "ui";

import { FlowTabs } from "./flow-tabs";

type Props = {
  children: ReactNode;
  params: { flowId: string; projectId: string; organizationId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const flow = await load(api["/flows/:flowId"](params.flowId));

  return {
    title: `${flow.name} | Flows`,
  };
}

export default async function FlowLayout({ children, params }: Props): Promise<JSX.Element> {
  const flow = await load(api["/flows/:flowId"](params.flowId));

  return (
    <>
      <FlowTabs cloudFlow={flow.flow_type === "cloud"} />

      <Text className={css({ mb: "space16" })} id="panda-title" variant="title3xl">
        {flow.name}
      </Text>

      {children}
    </>
  );
}
