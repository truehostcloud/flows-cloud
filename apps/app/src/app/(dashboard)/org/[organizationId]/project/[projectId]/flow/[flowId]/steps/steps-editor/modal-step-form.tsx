import { css } from "@flows/styled-system/css";
import { Flex, Grid } from "@flows/styled-system/jsx";
import type { FlowModalStep } from "@rbnd/flows";
import type { FC } from "react";
import { type Control, Controller, useController } from "react-hook-form";
import { Accordion, Checkbox, Input, Text } from "ui";

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
        {...control.register(`${stepKey}.title`)}
        defaultValue={value.title}
        description="HTML title of the modal"
        label="Title"
      />
      <Input
        {...control.register(`${stepKey}.body`)}
        asChild
        defaultValue={value.body}
        description="HTML content of the modal"
        fullClassName={css({ mb: "space16" })}
        inputClassName={css({ height: "unset" })}
        label="Body"
      >
        <textarea rows={5} />
      </Input>

      <Controller
        control={control}
        name={`${stepKey}.hideClose`}
        render={({ field }) => (
          <Checkbox
            checked={field.value}
            label="Hide close button"
            labelClassName={css({ mb: "space16" })}
            onCheckedChange={field.onChange}
          />
        )}
      />
      <Flex flexDirection="column" gap="space8">
        <Accordion title="Footer">
          <Grid gap="space24" gridTemplateColumns="1fr 1fr" mb="space16">
            <Input
              {...control.register(`${stepKey}.prevText`)}
              defaultValue={value.prevText}
              description="Replace default text of the previous step button"
              disabled={value.hidePrev}
              label={
                <Flex justifyContent="space-between">
                  <Text>Previous step button</Text>
                  <Controller
                    control={control}
                    name={`${stepKey}.hidePrev`}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        label="Hide button"
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </Flex>
              }
              placeholder="Back"
            />

            <Input
              {...control.register(`${stepKey}.nextText`)}
              defaultValue={value.nextText}
              description="Replace default text of the next step and finish button (comma separated)"
              disabled={value.hideNext}
              label={
                <Flex justifyContent="space-between">
                  <Text>Next step button </Text>
                  <Controller
                    control={control}
                    name={`${stepKey}.hideNext`}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        label="Hide button"
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </Flex>
              }
              placeholder="Continue, Finish"
            />
          </Grid>

          <Text variant="titleS">Footer</Text>
          <Grid gridTemplateColumns="repeat(3, 1fr)">
            <StepFooterActions control={control} index={index} placement="left" />
            <StepFooterActions control={control} index={index} placement="center" />
            <StepFooterActions control={control} index={index} placement="right" />
          </Grid>
        </Accordion>

        <Accordion title="Wait">
          <StepWaitOptionList control={control} fieldName={`${stepKey}.wait`} />
        </Accordion>

        <Accordion title="Advanced">
          <Input
            {...control.register(`${stepKey}.key`)}
            defaultValue={value.key}
            description="Unique ID of the step"
            label="ID"
            placeholder="my-step-id"
          />
        </Accordion>
      </Flex>
    </>
  );
};
