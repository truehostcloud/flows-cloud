"use client";

import { css } from "@flows/styled-system/css";
import { Flex } from "@flows/styled-system/jsx";
import type { FlowSteps } from "@rbnd/flows";
import { useSend } from "hooks/use-send";
import type { FlowDetail, UpdateFlow } from "lib/api";
import { api } from "lib/api";
import { type FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useFieldArray, useForm } from "react-hook-form";
import { t } from "translations";
import { Button, toast } from "ui";

import { StepsPreview } from "../steps-preview";
import { Step } from "./step";
import type { StepsForm } from "./steps-editor.types";

type Props = {
  flow: FlowDetail;
};

export const StepsEditor: FC<Props> = ({ flow }) => {
  const editVersionSteps = (flow.draftVersion?.steps ?? flow.publishedVersion?.steps) as
    | FlowSteps
    | undefined;

  const defaultValues: StepsForm = {
    steps: editVersionSteps ?? [],
  };
  const { handleSubmit, control, watch } = useForm<StepsForm>({ defaultValues, mode: "onChange" });
  const { append, remove, fields } = useFieldArray({
    control,
    name: "steps",
  });

  const { loading, send } = useSend();
  const onSubmit: SubmitHandler<StepsForm> = async (data) => {
    const res = await send(
      api["PATCH /flows/:flowId"](flow.id, {
        steps: data.steps as unknown as UpdateFlow["steps"],
      }),
      { errorMessage: t.toasts.saveStepsFailed },
    );
    if (res.error) return;
    toast.success(t.toasts.updateFlowSuccess);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex direction="column" gap="space12" mb="space16">
        {fields.map((field, index) => (
          <Step control={control} index={index} key={field.id} onRemove={() => remove(index)} />
        ))}
      </Flex>

      <Flex gap="space8" mb="space32">
        <Button onClick={() => append({ title: "" })}>Add step</Button>
        <Button onClick={() => append([[]])}>Add fork</Button>
      </Flex>

      <StepsPreview steps={watch("steps")} />

      <Button className={css({ mt: "space24" })} loading={loading} type="submit">
        Save
      </Button>
    </form>
  );
};
