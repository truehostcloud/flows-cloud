import type { FlowTooltipStep } from "@flows/js";
import { css } from "@flows/styled-system/css";
import { Box, Flex, Grid } from "@flows/styled-system/jsx";
import { type FC } from "react";
import { type Control, Controller, useController } from "react-hook-form";
import { t } from "translations";
import { Accordion, Checkbox, Input, Select } from "ui";

import { StepFooter } from "./step-footer";
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

// TODO: maybe add checkbox that will show/hide the custom actions section

export const TooltipStepForm: FC<Props> = ({ control, index }) => {
  const stepKey = `steps.${index}` as const;

  const controller = useController({ name: `${stepKey}`, control });
  const value = controller.field.value as FlowTooltipStep;

  return (
    <>
      <Grid gap="space24" gridTemplateColumns="2fr 1fr" mb="space16">
        <Box>
          <Box>
            <Input
              {...control.register(`${stepKey}.title`)}
              className={css({ mb: "space16" })}
              defaultValue={value.title}
              description="HTML title of the tooltip"
              label="Title"
            />
            <Input
              {...control.register(`${stepKey}.body`)}
              asChild
              defaultValue={value.body}
              description="HTML content of the tooltip"
              inputClassName={css({ height: "unset" })}
              label="Body"
            >
              <textarea rows={5} />
            </Input>
          </Box>
        </Box>

        <Box>
          <Input
            {...control.register(`${stepKey}.targetElement`)}
            className={css({ mb: "space16" })}
            defaultValue={value.targetElement}
            description="Element to attach tooltip to"
            label="Target element"
            placeholder=".element"
          />
          <Controller
            control={control}
            name={`${stepKey}.placement`}
            render={({ field }) => (
              <Select
                buttonSize="default"
                className={css({ mb: "space16" })}
                description="Placement of the tooltip relative to the element"
                label="Tooltip placement"
                onChange={field.onChange}
                options={placementOptions}
                value={field.value ?? "bottom"}
              />
            )}
          />
          <Flex flexDirection="column" gap="space8">
            {(
              [
                { key: "hideClose", label: "Hide close button" },
                {
                  key: "hideArrow",
                  label: "Hide arrow",
                },
              ] as const
            ).map(({ key, label }) => (
              <Controller
                control={control}
                key={key}
                name={`${stepKey}.${key}`}
                render={({ field }) => (
                  <Checkbox checked={field.value} label={label} onCheckedChange={field.onChange} />
                )}
              />
            ))}

            <Controller
              control={control}
              name={`${stepKey}.overlay`}
              render={({ field }) => (
                <>
                  <Checkbox
                    checked={field.value}
                    label="Show overlay"
                    onCheckedChange={field.onChange}
                  />
                  {field.value ? (
                    <Controller
                      control={control}
                      name={`${stepKey}.closeOnOverlayClick`}
                      render={({ field: closeField }) => (
                        <Checkbox
                          checked={closeField.value}
                          label="Close on overlay click"
                          onCheckedChange={closeField.onChange}
                        />
                      )}
                    />
                  ) : null}
                </>
              )}
            />
          </Flex>
        </Box>
      </Grid>

      <Flex flexDirection="column" gap="space8">
        <StepFooter control={control} index={index} />

        <Accordion title="Wait">
          <StepWaitOptionList control={control} fieldName={`${stepKey}.wait`} />
        </Accordion>

        <Accordion title="Advanced">
          <Input
            {...control.register(`${stepKey}.stepId`)}
            className={css({ mb: "space16" })}
            defaultValue={value.stepId}
            description={t.steps.stepIdDescription}
            label={t.steps.stepIdLabel}
            placeholder="my-step-id"
          />
          <Input
            {...control.register(`${stepKey}.scrollElement`)}
            defaultValue={value.scrollElement}
            description="Element to scroll to when tooltip is shown"
            label="Scroll to element"
            placeholder=".element"
          />
        </Accordion>
      </Flex>
    </>
  );
};
