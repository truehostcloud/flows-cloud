import { Box, Flex } from "@flows/styled-system/jsx";
import { Plus16 } from "icons";
import { type FC } from "react";
import { type Control, useFieldArray } from "react-hook-form";
import { Accordion, Button, Text } from "ui";

import { STEP_DEFAULT, StepForm } from "./step-form";
import type { StepsForm } from "./steps-editor.types";

type Props = {
  control: Control<StepsForm>;
  index: `${number}.${number}`;
  onRemove: () => void;
};

export const StepBranch: FC<Props> = ({ control, index, onRemove }) => {
  const { append, remove, fields } = useFieldArray({ control, name: `steps.${index}` });
  const branchIndex = index.split(".")[1];

  return (
    <Accordion
      title={
        <Flex alignItems="center" mr="space8">
          <Flex flex={1} gap="space8">
            <Text as="span" variant="titleM">
              Branch
            </Text>
            <Text color="subtle" variant="bodyS">
              {branchIndex}
            </Text>
          </Flex>

          <Button
            onClick={(e) => (e.stopPropagation(), onRemove())}
            shadow={false}
            size="small"
            variant="secondary"
          >
            Remove branch
          </Button>
        </Flex>
      }
    >
      {fields.map((field, i) => (
        <Box key={field.id} pb="space12">
          <StepForm control={control} index={`${index}.${i}`} onRemove={() => remove(i)} />
        </Box>
      ))}
      <Button
        onClick={() => append(STEP_DEFAULT.tooltip)}
        shadow={false}
        startIcon={<Plus16 />}
        variant="secondary"
      >
        Add step to branch
      </Button>
    </Accordion>
  );
};
