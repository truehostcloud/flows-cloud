import { Box } from "@flows/styled-system/jsx";
import type { FC } from "react";
import type { Control } from "react-hook-form";
import { Controller, useController, useFieldArray } from "react-hook-form";
import { Button, Checkbox, Input, Text } from "ui";

import type { StepsForm } from "./steps-editor.types";

type Placement = "left" | "center" | "right";

type Props = {
  control: Control<StepsForm>;
  index: number | `${number}.${number}.${number}`;
  placement: Placement;
};

export const StepFooterActions: FC<Props> = ({ control, index, placement }) => {
  const fieldName = `steps.${index}.footerActions.${placement}` as const;
  const fieldArray = useFieldArray({ name: fieldName, control });

  return (
    <Box>
      <Text>{placement} buttons</Text>
      {fieldArray.fields.map((field, i) => (
        <Option
          control={control}
          fieldName={`${fieldName}.${i}`}
          key={field.id}
          onRemove={() => fieldArray.remove(i)}
        />
      ))}
      <Button onClick={() => fieldArray.append({ text: "" })} size="small">
        Add option
      </Button>
    </Box>
  );
};

type OptionProps = {
  control: Control<StepsForm>;
  fieldName:
    | `steps.${number}.footerActions.${Placement}.${number}`
    | `steps.${number}.${number}.${number}.footerActions.${Placement}.${number}`;
  onRemove: () => void;
};

const Option: FC<OptionProps> = ({ control, fieldName, onRemove }) => {
  const controller = useController({ name: fieldName, control });

  return (
    <Box>
      <Button onClick={onRemove} size="small">
        Remove
      </Button>
      <Input
        {...control.register(`${fieldName}.text`)}
        defaultValue={controller.field.value.text}
        label="Text"
      />
      <Input
        {...control.register(`${fieldName}.href`)}
        defaultValue={controller.field.value.href}
        label="Href"
        placeholder="https://example.com"
      />
      <Box>
        <Controller
          control={control}
          name={`${fieldName}.external`}
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              label="External link"
              onCheckedChange={field.onChange}
            />
          )}
        />
      </Box>

      <Controller
        control={control}
        name={`${fieldName}.action`}
        render={({ field }) => (
          <Input
            label="Acton"
            onChange={(e) => field.onChange(Number(e.target.value))}
            placeholder="0"
            type="number"
            value={field.value}
          />
        )}
      />
      {(
        [
          { key: "prev", label: "As prev step button" },
          {
            key: "next",
            label: "As next step button",
          },
        ] as const
      ).map(({ key, label }) => (
        <Box key={key}>
          <Controller
            control={control}
            name={`${fieldName}.${key}`}
            render={({ field }) => (
              <Checkbox checked={field.value} label={label} onCheckedChange={field.onChange} />
            )}
          />
        </Box>
      ))}
    </Box>
  );
};
