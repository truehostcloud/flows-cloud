import { Box } from "@flows/styled-system/jsx";
import type { FC } from "react";
import { type Control, Controller, useController, useFieldArray } from "react-hook-form";
import { Button, Input, Text } from "ui";

import type { StepsForm } from "./steps-editor.types";

type Props = {
  control: Control<StepsForm>;
  fieldName:
    | `steps.${number}.wait.${number}`
    | `steps.${number}.${number}.${number}.wait.${number}`;
  onRemove: () => void;
};

export const StepWaitOption: FC<Props> = ({ control, fieldName, onRemove }) => {
  const controller = useController({ control, name: fieldName });
  const value = controller.field.value;

  const changeFieldArray = useFieldArray({ name: `${fieldName}.change`, control });
  const submitValueFieldArray = useFieldArray({ name: `${fieldName}.form.values`, control });

  return (
    <Box>
      <Button onClick={onRemove} size="small">
        Remove
      </Button>
      <Input
        {...control.register(`${fieldName}.element`)}
        defaultValue={value.element}
        description="Click on this element"
        label="Element"
        placeholder=".element"
      />
      <Input
        {...control.register(`${fieldName}.location`)}
        defaultValue={value.location}
        description="Regex to match pathname"
        label="Location"
        placeholder="^/path$"
      />
      <Controller
        control={control}
        name={`${fieldName}.action`}
        render={({ field }) => (
          <Input
            description="Which branch to take"
            label="Action"
            onChange={(e) => field.onChange(Number(e.target.value))}
            placeholder="0"
            type="number"
            value={field.value}
          />
        )}
      />

      <Text variant="titleS">On Change</Text>
      {changeFieldArray.fields.map((field, i) => (
        <ChangeForm
          control={control}
          fieldName={`${fieldName}.change.${i}`}
          key={field.id}
          onRemove={() => changeFieldArray.remove(i)}
        />
      ))}
      <Button onClick={() => changeFieldArray.append({ element: "", value: "" })} size="small">
        Add change field
      </Button>

      <Text variant="titleS">On Submit</Text>
      <Input
        {...control.register(`${fieldName}.form.element`)}
        defaultValue={value.form?.element}
        description="Form element to listen 'onsubmit' event on."
        label="Element"
        placeholder=".element"
      />
      {submitValueFieldArray.fields.map((field, i) => (
        <SubmitValueForm
          control={control}
          fieldName={`${fieldName}.form.values.${i}`}
          key={field.id}
          onRemove={() => submitValueFieldArray.remove(i)}
        />
      ))}
      <Button onClick={() => submitValueFieldArray.append({ element: "", value: "" })} size="small">
        Add submit field
      </Button>
    </Box>
  );
};

type ChangeProps = {
  control: Control<StepsForm>;
  fieldName:
    | `steps.${number}.wait.${number}.change.${number}`
    | `steps.${number}.${number}.${number}.wait.${number}.change.${number}`;
  onRemove: () => void;
};
const ChangeForm: FC<ChangeProps> = ({ control, fieldName, onRemove }) => {
  const { field } = useController({ control, name: fieldName });

  return (
    <>
      <Button onClick={onRemove} size="small">
        Remove
      </Button>
      <Input
        {...control.register(`${fieldName}.element`)}
        defaultValue={field.value.element}
        description="Value of this element will be checked when its 'onchange' event is fired."
        label="Element"
        placeholder=".element"
      />
      <Input
        {...control.register(`${fieldName}.value`)}
        defaultValue={field.value.value}
        description="Regex to match value of this element."
        label="Value"
        placeholder="^my-value$"
      />
    </>
  );
};

type SubmitValueProps = {
  control: Control<StepsForm>;
  fieldName:
    | `steps.${number}.wait.${number}.form.values.${number}`
    | `steps.${number}.${number}.${number}.wait.${number}.form.values.${number}`;
  onRemove: () => void;
};
const SubmitValueForm: FC<SubmitValueProps> = ({ control, fieldName, onRemove }) => {
  const { field } = useController({ control, name: fieldName });

  return (
    <>
      <Button onClick={onRemove} size="small">
        Remove
      </Button>
      <Input
        {...control.register(`${fieldName}.element`)}
        defaultValue={field.value.element}
        description="Value of this element will be checked when the form is submitted."
        label="Element"
        placeholder=".element"
      />
      <Input
        {...control.register(`${fieldName}.value`)}
        defaultValue={field.value.value}
        description="Regex to match value of this element."
        label="Value"
        placeholder="^my-value$"
      />
    </>
  );
};
