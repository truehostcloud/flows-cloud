import type { FC } from "react";
import type { Control } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { Button } from "ui";

import { StepWaitOption } from "./step-wait-option";
import type { StepsForm } from "./steps-editor.types";

type Props = {
  control: Control<StepsForm>;
  fieldName: `steps.${number}.wait` | `steps.${number}.${number}.${number}.wait`;
};

export const StepWaitOptionList: FC<Props> = ({ control, fieldName }: Props) => {
  const { append, remove, fields } = useFieldArray({
    name: fieldName,
    control,
  });

  return (
    <>
      {fields.map((field, i) => (
        <StepWaitOption
          control={control}
          fieldName={`${fieldName}.${i}`}
          key={(field as { id: string }).id}
          onRemove={() => remove(i)}
        />
      ))}
      <Button onClick={() => append({} as never)} size="small">
        Add wait option
      </Button>
    </>
  );
};
