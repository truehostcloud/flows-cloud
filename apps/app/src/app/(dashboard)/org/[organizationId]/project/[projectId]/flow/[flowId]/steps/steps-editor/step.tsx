import type { FC } from "react";
import { type Control, useController } from "react-hook-form";

import { StepFork } from "./step-fork";
import { StepForm } from "./step-form";
import type { StepsForm } from "./steps-editor.types";

type Props = {
  control: Control<StepsForm>;
  index: number;
  onRemove: () => void;
};

export const Step: FC<Props> = ({ control, index, onRemove }) => {
  const { field } = useController({ name: `steps.${index}`, control });

  const value = field.value;
  if (!Array.isArray(value))
    return <StepForm control={control} index={index} onRemove={onRemove} />;

  return <StepFork control={control} index={index} onRemove={onRemove} />;
};
