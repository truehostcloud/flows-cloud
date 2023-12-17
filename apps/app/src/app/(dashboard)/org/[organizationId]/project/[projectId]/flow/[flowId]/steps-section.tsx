import { css } from "@flows/styled-system/css";
import { Flex } from "@flows/styled-system/jsx";
import type { FlowSteps } from "@rbnd/flows";
import Link from "next/link";
import type { FC } from "react";
import { routes } from "routes";
import { Button, Text } from "ui";

import { StepsPreview } from "./steps/steps-preview";

type Props = {
  params: { flowId: string; projectId: string; organizationId: string };
  steps?: FlowSteps;
};

export const StepsSection: FC<Props> = ({ params, steps }) => {
  return (
    <Flex
      className={css({
        cardWrap: "",
      })}
      direction="column"
      padding="space24"
      width="100%"
    >
      <Flex alignItems="flex-start" justifyContent="space-between" width="100%">
        <Text variant="titleL">Steps</Text>
        <Link href={routes.flowSteps(params)}>
          <Button variant="secondary">Edit</Button>
        </Link>
      </Flex>
      {steps ? <StepsPreview steps={steps} /> : <Text color="muted">No steps</Text>}
    </Flex>
  );
};
