import { Box, Grid } from "@flows/styled-system/jsx";
import type { FlowTooltipStep } from "@rbnd/flows";
import type { FC } from "react";
import { type Control, Controller, useController } from "react-hook-form";
import { t } from "translations";
import { Checkbox, Input, Select, Text } from "ui";

import { StepFooterActions } from "./step-footer-actions";
import { StepWaitOptionList } from "./step-wait-option-list";
import type { StepsForm } from "./steps-editor.types";

type Props = {
  control: Control<StepsForm>;
  index: number | `${number}.${number}.${number}`;
};

const placementOptions = [
  "top",
  "right",
  "bottom",
  "left",
  "top-start",
  "top-end",
  "right-start",
  "right-end",
  "bottom-start",
  "bottom-end",
  "left-start",
  "left-end",
].map((value) => ({ label: t.steps.placement[value], value }));

export const TooltipStepForm: FC<Props> = ({ control, index }) => {
  const stepKey = `steps.${index}` as const;

  const controller = useController({ name: `${stepKey}`, control });
  const value = controller.field.value as FlowTooltipStep;

  return (
    <>
      <Input
        {...control.register(`${stepKey}.key`)}
        defaultValue={value.key}
        label="Key"
        placeholder="my-step-id"
      />
      <Input
        {...control.register(`${stepKey}.title`)}
        defaultValue={value.title}
        description="HTML title of the tooltip"
        label="Title"
      />
      <Input
        {...control.register(`${stepKey}.body`)}
        defaultValue={value.body}
        description="HTML content of the tooltip"
        label="Body"
      />
      <Input
        {...control.register(`${stepKey}.prevText`)}
        defaultValue={value.prevText}
        description="Text of the previous button"
        label="Prev button"
        placeholder="Back"
      />
      <Input
        {...control.register(`${stepKey}.nextText`)}
        defaultValue={value.nextText}
        description="Text of the next or finish (in the last step) button"
        label="Next button"
        placeholder="Continue, Finish"
      />
      <Input
        {...control.register(`${stepKey}.element`)}
        defaultValue={value.element}
        description="Element to attach tooltip to"
        label="Element"
        placeholder=".element"
      />
      <Input
        {...control.register(`${stepKey}.scrollElement`)}
        defaultValue={value.element}
        description="Element to scroll to when tooltip is shown"
        label="Scroll element"
        placeholder=".element"
      />
      <Controller
        control={control}
        name={`${stepKey}.placement`}
        render={({ field }) => (
          <Select
            label="Placement"
            onChange={field.onChange}
            options={placementOptions}
            value={field.value ?? "bottom"}
          />
        )}
      />
      {(
        [
          { key: "hideClose", label: "Hide close button" },
          {
            key: "hideArrow",
            label: "Hide arrow",
          },
          {
            key: "hidePrev",
            label: "Hide previous step button",
          },
          {
            key: "hideNext",
            label: "Hide next step button",
          },
        ] as const
      ).map(({ key, label }) => (
        <Box key={key}>
          <Controller
            control={control}
            name={`${stepKey}.${key}`}
            render={({ field }) => (
              <Checkbox checked={field.value} label={label} onCheckedChange={field.onChange} />
            )}
          />
        </Box>
      ))}
      <Text variant="titleS">Footer</Text>
      <Grid gridTemplateColumns="repeat(3, 1fr)">
        <StepFooterActions control={control} index={index} placement="left" />
        <StepFooterActions control={control} index={index} placement="center" />
        <StepFooterActions control={control} index={index} placement="right" />
      </Grid>

      <Text variant="titleS">Wait</Text>
      <StepWaitOptionList control={control} fieldName={`${stepKey}.wait`} />
    </>
  );
};
