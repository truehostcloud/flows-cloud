import type { FlowWaitStep } from "@rbnd/flows";
import type { FC } from "react";
import { type Control, useController } from "react-hook-form";
import { Input } from "ui";

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
      <Input
        {...control.register(`${stepKey}.key`)}
        defaultValue={value.key}
        label="Key"
        placeholder="my-step-id"
      />
      <StepWaitOptionList control={control} fieldName={`${stepKey}.wait`} />
    </>
  );
};
