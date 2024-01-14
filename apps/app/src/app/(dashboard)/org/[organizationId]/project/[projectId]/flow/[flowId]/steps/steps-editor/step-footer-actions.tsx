import { css } from "@flows/styled-system/css";
import { Box, Flex } from "@flows/styled-system/jsx";
import { Close16, Plus16 } from "icons";
import type { FC } from "react";
import type { Control } from "react-hook-form";
import { Controller, useController, useFieldArray } from "react-hook-form";
import { t } from "translations";
import { Button, Checkbox, Icon, Input, Text } from "ui";

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
    <Box bor="1px" borderRadius="radius8">
      <Box borBottom="1px" padding="space12">
        <Text>{t.steps.footer.buttonAlignment[placement]} actions</Text>
      </Box>
      {fieldArray.fields.map((field, i) => (
        <Option
          control={control}
          fieldName={`${fieldName}.${i}`}
          index={i}
          key={field.id}
          onRemove={() => fieldArray.remove(i)}
        />
      ))}
      <Box padding="space12">
        <Button
          onClick={() => fieldArray.append({ text: "" })}
          shadow={false}
          size="small"
          startIcon={<Plus16 />}
          variant="secondary"
        >
          Add button
        </Button>
      </Box>
    </Box>
  );
};

type OptionProps = {
  control: Control<StepsForm>;
  fieldName:
    | `steps.${number}.footerActions.${Placement}.${number}`
    | `steps.${number}.${number}.${number}.footerActions.${Placement}.${number}`;
  onRemove: () => void;
  index: number;
};

const Option: FC<OptionProps> = ({ control, fieldName, onRemove, index }) => {
  const controller = useController({ name: fieldName, control });

  return (
    <Box borBottom="1px" padding="space12">
      <Flex alignItems="center" gap="space8" justifyContent="space-between" mb="space8">
        <Text variant="titleS">Button {index + 1}</Text>
        <Button onClick={onRemove} size="small" variant="ghost">
          <Icon icon={Close16} />
        </Button>
      </Flex>
      <Input
        {...control.register(`${fieldName}.text`)}
        defaultValue={controller.field.value.text}
        fullClassName={css({ mb: "space16" })}
        label="Text"
      />
      {/* TODO: add switcher between Href, Action, Prev, Next for simpler UI*/}
      <Input
        {...control.register(`${fieldName}.href`)}
        defaultValue={controller.field.value.href}
        fullClassName={css({ mb: "space16" })}
        label={
          <Flex justifyContent="space-between">
            <Text>Href </Text>
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
          </Flex>
        }
        placeholder="https://example.com"
      />

      <Controller
        control={control}
        name={`${fieldName}.action`}
        render={({ field }) => (
          <Input
            fullClassName={css({ mb: "space16" })}
            label="Action"
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
