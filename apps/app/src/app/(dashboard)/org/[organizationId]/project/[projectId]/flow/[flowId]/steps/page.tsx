import { api } from "lib/api";
import { load } from "lib/load";

import { StepsEditor } from "./steps-editor/steps-editor";

type Props = {
  params: { flowId: string };
};

export default async function FlowStepsPage({ params }: Props): Promise<JSX.Element> {
  const flow = await load(api["/flows/:flowId"](params.flowId));

  return <StepsEditor flow={flow} />;
}
