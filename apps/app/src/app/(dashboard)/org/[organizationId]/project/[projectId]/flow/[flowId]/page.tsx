import { css } from "@flows/styled-system/css";
import { Flex } from "@flows/styled-system/jsx";
import type { FlowSteps } from "@rbnd/flows";
import { api } from "lib/api";
import { load } from "lib/load";
import { Text } from "ui";

import { SetupSection } from "./setup-section";
import { StepsSection } from "./steps-section";

type Props = {
  params: { flowId: string; projectId: string; organizationId: string };
};

export default async function FlowDetailPage({ params }: Props): Promise<JSX.Element> {
  const flow = await load(api["/flows/:flowId"](params.flowId));
  const steps = (flow.data as undefined | { steps?: FlowSteps })?.steps;

  return (
    <Flex direction="column" gap="space24" width="100%">
      <Flex direction="column" gap="space24" width="100%" />
      <Flex
        className={css({
          cardWrap: "",
        })}
        justifyContent="center"
        padding="space48"
        width="100%"
      >
        <Text color="subtle" variant="titleM">
          Quick look analytics TODO
        </Text>
      </Flex>
      <StepsSection params={params} steps={steps} />
      <SetupSection flow={flow} params={params} />
    </Flex>
  );
}
