import { Box, Flex } from "@flows/styled-system/jsx";
import type { FlowModalStep, FlowTooltipStep, FlowWaitStep } from "@rbnd/flows";
import { type FC, useMemo } from "react";
import { type Control, useController } from "react-hook-form";
import { t } from "translations";
import { Button, Select, Text } from "ui";

import { ModalStepForm } from "./modal-step-form";
import type { StepsForm } from "./steps-editor.types";
import { TooltipStepForm } from "./tooltip-step-form";
import { WaitStepForm } from "./wait-step-form";

type Props = {
  control: Control<StepsForm>;
  index: number | `${number}.${number}.${number}`;
  onRemove: () => void;
};

const DEFAULT_TOOLTIP: FlowTooltipStep = { element: "", title: "" };
const DEFAULT_MODAL: FlowModalStep = { title: "" };
const DEFAULT_WAIT: FlowWaitStep = { wait: {} };
export const STEP_DEFAULT = {
  tooltip: DEFAULT_TOOLTIP,
  modal: DEFAULT_MODAL,
  wait: DEFAULT_WAIT,
};

export const StepForm: FC<Props> = ({ control, index, onRemove }) => {
  const stepKey = `steps.${index}` as const;

  const { field } = useController({ name: `${stepKey}`, control });

  // eslint-disable-next-line no-nested-ternary -- ignore
  const stepType = "element" in field.value ? "tooltip" : "title" in field.value ? "modal" : "wait";

  const typeOptions = useMemo(
    () =>
      Object.keys(STEP_DEFAULT).map((value) => ({
        value,
        label: t.steps.stepType[value],
      })),
    [],
  );

  return (
    <Box cardWrap="-" p="space16">
      <Flex mb="space8">
        <Flex alignItems="center" flex={1} gap="space4">
          <Select
            onChange={(v) => field.onChange(STEP_DEFAULT[v])}
            options={typeOptions}
            value={stepType}
          />
          <Text variant="titleS">step</Text>
        </Flex>
        <Button onClick={onRemove} size="small">
          Remove
        </Button>
      </Flex>

      {stepType === "tooltip" && <TooltipStepForm control={control} index={index} />}
      {stepType === "modal" && <ModalStepForm control={control} index={index} />}
      {stepType === "wait" && <WaitStepForm control={control} index={index} />}
    </Box>
  );
};
