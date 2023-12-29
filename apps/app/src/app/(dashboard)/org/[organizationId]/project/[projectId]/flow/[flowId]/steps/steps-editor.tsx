"use client";

import { css } from "@flows/styled-system/css";
import { isValidFlow, validateFlow } from "@rbnd/flows";
import { CodeEditor } from "components/ui/code-editor";
import { useSend } from "hooks/use-send";
import { useStickyValue } from "hooks/use-sticky-value";
import { api, type FlowDetail } from "lib/api";
import { type FC, useCallback, useMemo } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { t } from "translations";
import { Button, Text, toast } from "ui";

import { StepsPreview } from "./steps-preview";

type Props = {
  flow: FlowDetail;
};

type FormData = {
  steps: string;
};

export const StepsEditor: FC<Props> = ({ flow }) => {
  const defaultValues: FormData = {
    steps: JSON.stringify(flow.draftVersion?.steps ?? flow.publishedVersion?.steps ?? [], null, 2),
  };
  const { handleSubmit, control, watch } = useForm<FormData>({ defaultValues, mode: "onChange" });

  const { loading, send } = useSend();
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const res = await send(
      api["PATCH /flows/:flowId"](flow.id, {
        steps: JSON.parse(data.steps || "[]"),
      }),
    );
    if (res.error) return;
    toast.success(t.toasts.updateFlowSuccess);
  };

  const parseFlow = useCallback(
    (steps: string): unknown => ({ steps: JSON.parse(steps), id: flow.id }),
    [flow.id],
  );

  const data = watch("steps");
  const _validFlow = useMemo(() => {
    try {
      const parsed = parseFlow(data);
      if (isValidFlow(parsed)) return parsed;
      // eslint-disable-next-line no-empty -- no need to do anything
    } catch {}
  }, [data, parseFlow]);
  const { value: validFlow } = useStickyValue(_validFlow);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="steps"
        render={({ field, fieldState }) => (
          <div className={css({ mb: "space24" })}>
            <CodeEditor defaultValue={defaultValues.steps} onChange={(v) => field.onChange(v)} />
            <Text className={css({ mt: "space4", minH: "1.5em" })} color="danger" variant="bodyXs">
              {fieldState.error?.message}
            </Text>
          </div>
        )}
        rules={{
          required: "Required",
          validate: (v) => {
            try {
              const result = validateFlow(parseFlow(v));
              if (result.error)
                return `Invalid steps definition at ${result.error.path.slice(1).join(".")}`;
            } catch (e) {
              return "Must be valid JSON";
            }
          },
        }}
      />

      <StepsPreview steps={validFlow?.steps} />

      <Button className={css({ mt: "space24" })} loading={loading} type="submit">
        Save
      </Button>
    </form>
  );
};
