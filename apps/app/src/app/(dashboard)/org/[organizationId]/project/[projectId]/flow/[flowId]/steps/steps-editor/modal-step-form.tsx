import type { FlowModalStep } from "@flows/js";
import { css } from "@flows/styled-system/css";
import { Flex } from "@flows/styled-system/jsx";
import type { FC } from "react";
import { type Control, Controller, useController } from "react-hook-form";
import { t } from "translations";
import { Accordion, Checkbox, Input } from "ui";

import { StepFooter } from "./step-footer";
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
        className={css({ mb: "space16" })}
        defaultValue={value.body}
        description="HTML content of the modal"
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
        <StepFooter control={control} index={index} />

        <Accordion title="Wait">
          <StepWaitOptionList control={control} fieldName={`${stepKey}.wait`} />
        </Accordion>

        <Accordion title="Advanced">
          <Input
            {...control.register(`${stepKey}.key`)}
            defaultValue={value.key}
            description={t.steps.keyDescription}
            label={t.steps.keyLabel}
            placeholder="my-step-id"
          />
        </Accordion>
      </Flex>
    </>
  );
};
