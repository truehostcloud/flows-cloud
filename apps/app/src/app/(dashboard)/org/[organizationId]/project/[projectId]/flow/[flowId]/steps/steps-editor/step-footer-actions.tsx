import { css } from "@flows/styled-system/css";
import { Box, Flex } from "@flows/styled-system/jsx";
import { Close16, Plus16 } from "icons";
import type { FC } from "react";
import type { Control } from "react-hook-form";
import { Controller, useController, useFieldArray } from "react-hook-form";
import { t } from "translations";
import { Button, Checkbox, Icon, Input, Label, Text } from "ui";

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

  const currentVariant = (() => {
    if (controller.field.value.href !== undefined) return "href";
    if (controller.field.value.prev) return "prev";
    if (controller.field.value.next) return "next";
    return "action";
  })();
  const handleSwitchVariant = (variant: typeof currentVariant): void => {
    if (variant === "href")
      return controller.field.onChange({ text: controller.field.value.text, href: "" });
    if (variant === "prev")
      return controller.field.onChange({ text: controller.field.value.text, prev: true });
    if (variant === "next")
      return controller.field.onChange({ text: controller.field.value.text, next: true });
    return controller.field.onChange({ text: controller.field.value.text, action: 0 });
  };

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
        className={css({ mb: "space16" })}
        defaultValue={controller.field.value.text}
        label="Text"
      />

      <Flex gap="space4" mb="space16">
        {(["href", "action", "prev", "next"] as const).map((variant) => (
          <Button
            className={css({ flex: 1 })}
            key={variant}
            onClick={() => handleSwitchVariant(variant)}
            size="small"
            variant={currentVariant === variant ? "black" : "secondary"}
          >
            {t.steps.footer.variant[variant]}
          </Button>
        ))}
      </Flex>

      {currentVariant === "href" && (
        <Box>
          <Flex justifyContent="space-between" mb="space4">
            <Label htmlFor={`${fieldName}.href`}>Href</Label>
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
          <Input
            id={`${fieldName}.href`}
            {...control.register(`${fieldName}.href`)}
            defaultValue={controller.field.value.href}
            placeholder="https://example.com"
          />
        </Box>
      )}

      {currentVariant === "action" && (
        <Controller
          control={control}
          name={`${fieldName}.action`}
          render={({ field }) => (
            <Input
              label="Action"
              onChange={(e) => field.onChange(Number(e.target.value))}
              placeholder="0"
              type="number"
              value={field.value}
            />
          )}
        />
      )}
    </Box>
  );
};
