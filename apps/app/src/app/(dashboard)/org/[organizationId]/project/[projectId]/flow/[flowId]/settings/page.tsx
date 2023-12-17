import { api } from "lib/api";
import { load } from "lib/load";

import { FlowEditForm } from "./flow-edit-form";

type Props = {
  params: { flowId: string; organizationId: string };
};

export default async function FlowSettingsPage({ params }: Props): Promise<JSX.Element> {
  const flow = await load(api["/flows/:flowId"](params.flowId));

  return <FlowEditForm flow={flow} />;
}
