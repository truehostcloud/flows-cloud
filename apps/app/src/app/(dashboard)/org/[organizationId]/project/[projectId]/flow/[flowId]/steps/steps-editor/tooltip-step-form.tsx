import type { FlowTooltipStep } from "@flows/js";
import { css } from "@flows/styled-system/css";
import { Box, Flex, Grid } from "@flows/styled-system/jsx";
import { type FC } from "react";
import { type Control, Controller, useController } from "react-hook-form";
import { t } from "translations";
import { Accordion, Checkbox, Input, Select, Text } from "ui";

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
              defaultValue={value.title}
              description="HTML title of the tooltip"
              fullClassName={css({ mb: "space16" })}
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
            {...control.register(`${stepKey}.element`)}
            defaultValue={value.element}
            description="Element to attach tooltip to"
            fullClassName={css({ mb: "space16" })}
            label="Element"
            placeholder=".element"
          />
          <Controller
            control={control}
            name={`${stepKey}.placement`}
            render={({ field }) => (
              <Select
                buttonSize="default"
                description="Placement of the tooltip relative to the element"
                label="Tooltip placement"
                labelClassName={css({ mb: "space16" })}
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
          </Flex>
        </Box>
      </Grid>

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

          <Flex flexDirection="column" mb="space8">
            <Text variant="titleS">Custom actions</Text>
            <Text color="muted" variant="bodyS">
              Add custom actions to the footer of the tooltip
            </Text>
          </Flex>
          <Grid gap="space16" gridTemplateColumns="repeat(3, 1fr)">
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
            description="Unique ID of the step. Useful for programmatic control of the flow."
            fullClassName={css({ mb: "space16" })}
            label="ID"
            placeholder="my-step-id"
          />
          <Input
            {...control.register(`${stepKey}.scrollElement`)}
            defaultValue={value.element}
            description="Element to scroll to when tooltip is shown"
            label="Scroll to element"
            placeholder=".element"
          />
        </Accordion>
      </Flex>
    </>
  );
};
