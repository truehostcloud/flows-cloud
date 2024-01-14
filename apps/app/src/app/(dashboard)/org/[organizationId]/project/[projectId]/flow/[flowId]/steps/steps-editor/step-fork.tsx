import { Box, Flex } from "@flows/styled-system/jsx";
import type { FlowStep } from "@rbnd/flows";
import type { FC } from "react";
import { type Control, useFieldArray } from "react-hook-form";
import { Button, Text } from "ui";

import { StepBranch } from "./step-branch";
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
    <Box cardWrap="-" px="space12" py="space12">
      <Flex alignItems="center" justifyContent="space-between" mb="space12">
        <Flex alignItems="center" gap="space8">
          <Text variant="titleM">Fork</Text>
          <Text color="subtle">{index}</Text>
        </Flex>
        <Button onClick={onRemove} shadow={false} variant="secondary">
          Remove fork
        </Button>
      </Flex>
      {fields.length !== 0 && (
        <Flex direction="column" gap="space8" mb="space12">
          {fields.map((field, i) => (
            <StepBranch
              control={control}
              index={`${index}.${i}`}
              key={field.id}
              onRemove={() => remove(i)}
            />
          ))}
        </Flex>
      )}

      <Button onClick={() => append([[]])} shadow={false} variant="secondary">
        Add branch
      </Button>
    </Box>
  );
};
