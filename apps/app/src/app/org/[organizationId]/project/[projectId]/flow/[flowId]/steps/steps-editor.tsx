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
import { Button, Text } from "ui";

import { StepsPreview } from "./steps-preview";

type Props = {
  flow: FlowDetail;
};

type FormData = {
  data: string;
};

export const StepsEditor: FC<Props> = ({ flow }) => {
  const defaultValues: FormData = {
    data: JSON.stringify((flow.data as FlowDetail["data"] | undefined) ?? {}, null, 2),
  };
  const { handleSubmit, control, watch } = useForm<FormData>({ defaultValues, mode: "onChange" });

  const { loading, send } = useSend();
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await send(
      api["PATCH /flows/:flowId"](flow.id, {
        data: JSON.stringify(JSON.parse(data.data || "{}")),
      }),
    );
  };
  const parseFlow = useCallback(
    (data: string): unknown => ({ ...JSON.parse(data), id: flow.id }),
    [flow.id],
  );

  const data = watch("data");
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
        name="data"
        render={({ field, fieldState }) => (
          <div className={css({ mb: "space24" })}>
            <CodeEditor defaultValue={defaultValues.data} onChange={(v) => field.onChange(v)} />
            {fieldState.error ? <Text>{fieldState.error.message}</Text> : null}
          </div>
        )}
        rules={{
          required: "Required",
          validate: (v) => {
            try {
              const result = validateFlow(parseFlow(v));
              if (result.error) return `Invalid flow definition at ${result.error.path.join(".")}`;
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
