import { css } from "@flows/styled-system/css";
import { Box, Flex } from "@flows/styled-system/jsx";
import { ChevronDown16 } from "icons";
import { type FC, useState } from "react";
import { type Control, useFieldArray } from "react-hook-form";
import { Button, Icon } from "ui";

import { STEP_DEFAULT, StepForm } from "./step-form";
import type { StepsForm } from "./steps-editor.types";

type Props = {
  control: Control<StepsForm>;
  index: `${number}.${number}`;
  onRemove: () => void;
};

export const StepGroup: FC<Props> = ({ control, index, onRemove }) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = (): void => setExpanded((prev) => !prev);

  const { append, remove, fields } = useFieldArray({ control, name: `steps.${index}` });

  return (
    <Box cardWrap="-">
      <Flex alignItems="center" cursor="pointer" onClick={toggleExpanded} px="space12" py="space8">
        <Box flex={1}>Group</Box>
        <Button onClick={(e) => (e.stopPropagation(), onRemove())} size="small">
          Remove
        </Button>
        <Icon
          className={css({
            transitionDuration: "fast",
            transitionTimingFunction: "easeInOut",
            transform: expanded ? "rotate(180deg)" : `rotate(0)`,
          })}
          icon={ChevronDown16}
        />
      </Flex>

      {expanded ? (
        <Box pb="space16" px="space12">
          {fields.map((field, i) => (
            <StepForm
              control={control}
              index={`${index}.${i}`}
              key={field.id}
              onRemove={() => remove(i)}
            />
          ))}

          <Button onClick={() => append(STEP_DEFAULT.tooltip)}>Add step</Button>
        </Box>
      ) : null}
    </Box>
  );
};
