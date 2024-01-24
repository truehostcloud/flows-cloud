import { css } from "@flows/styled-system/css";
import { Plus16 } from "icons";
import type { FC } from "react";
import type { Control } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { Button, Text } from "ui";

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
      <Text
        className={css({
          mb: "space16",
        })}
        color="muted"
      >
        Wait for an event to occur before continuing to the next step. You can wait for the user to
        click a button, navigate to a page, submit a form, etc.
      </Text>
      {fields.map((field, i) => (
        <StepWaitOption
          control={control}
          fieldName={`${fieldName}.${i}`}
          index={i}
          key={(field as { id: string }).id}
          onRemove={() => remove(i)}
        />
      ))}
      <Button
        onClick={() => append({} as never)}
        shadow={false}
        size="small"
        startIcon={<Plus16 />}
        variant="secondary"
      >
        Add wait option
      </Button>
    </>
  );
};
