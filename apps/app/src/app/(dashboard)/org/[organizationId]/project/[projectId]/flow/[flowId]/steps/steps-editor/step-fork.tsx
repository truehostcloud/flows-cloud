import { Box, Flex } from "@flows/styled-system/jsx";
import type { FlowStep } from "@rbnd/flows";
import type { FC } from "react";
import { type Control, useFieldArray } from "react-hook-form";
import { Button } from "ui";

import { StepGroup } from "./step-group";
import type { StepsForm } from "./steps-editor.types";

type Props = {
  control: Control<StepsForm>;
  index: number;
  onRemove: () => void;
};

export const StepFork: FC<Props> = ({ control, index, onRemove }) => {
  const { append, remove, fields } = useFieldArray({
    control: control as unknown as Control<{ steps: FlowStep[][][] }>,
    name: `steps.${index}`,
  });

  return (
    <Box cardWrap="-" px="space12" py="space8">
      <Flex direction="column" gap="space8" mb="space16">
        {fields.map((field, i) => (
          <StepGroup
            control={control}
            index={`${index}.${i}`}
            key={field.id}
            onRemove={() => remove(i)}
          />
        ))}
      </Flex>

      <Button onClick={() => append([[]])}>Add group</Button>
      <Button onClick={onRemove}>Remove</Button>
    </Box>
  );
};
