import { Box, Grid } from "@flows/styled-system/jsx";
import type { FlowModalStep } from "@rbnd/flows";
import type { FC } from "react";
import { type Control, Controller, useController } from "react-hook-form";
import { Checkbox, Input, Text } from "ui";

import { StepFooterActions } from "./step-footer-actions";
import { StepWaitOptionList } from "./step-wait-option-list";
import type { StepsForm } from "./steps-editor.types";

type Props = {
  control: Control<StepsForm>;
  index: number | `${number}.${number}.${number}`;
};

export const ModalStepForm: FC<Props> = ({ control, index }) => {
  const stepKey = `steps.${index}` as const;

  const controller = useController({ name: `${stepKey}`, control });
  const value = controller.field.value as FlowModalStep;

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
        description="HTML title of the modal"
        label="Title"
      />
      <Input
        {...control.register(`${stepKey}.body`)}
        defaultValue={value.body}
        description="HTML content of the modal"
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
      {(
        [
          { key: "hideClose", label: "Hide close button" },
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
