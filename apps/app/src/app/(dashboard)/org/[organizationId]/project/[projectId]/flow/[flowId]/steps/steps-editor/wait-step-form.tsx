import type { FlowWaitStep } from "@flows/js";
import { Box } from "@flows/styled-system/jsx";
import type { FC } from "react";
import { type Control, useController } from "react-hook-form";
import { t } from "translations";
import { Accordion, Input } from "ui";

import { StepWaitOptionList } from "./step-wait-option-list";
import type { StepsForm } from "./steps-editor.types";

type Props = {
  control: Control<StepsForm>;
  index: number | `${number}.${number}.${number}`;
};

export const WaitStepForm: FC<Props> = ({ control, index }) => {
  const stepKey = `steps.${index}` as const;

  const { field } = useController({ name: `${stepKey}`, control });
  const value = field.value as FlowWaitStep;

  return (
    <>
      <Box mb="space16">
        <StepWaitOptionList control={control} fieldName={`${stepKey}.wait`} />
      </Box>

      <Accordion title="Advanced">
        <Input
          {...control.register(`${stepKey}.key`)}
          defaultValue={value.key}
          description={t.steps.keyDescription}
          label={t.steps.keyLabel}
          placeholder="my-step-id"
        />
      </Accordion>
    </>
  );
};
