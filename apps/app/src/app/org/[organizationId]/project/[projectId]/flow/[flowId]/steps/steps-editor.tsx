"use client";

import { css } from "@flows/styled-system/css";
import { Editor } from "@monaco-editor/react";
import { useSend } from "hooks/use-send";
import { api, type FlowDetail } from "lib/api";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { Button, Text } from "ui";

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
  const { handleSubmit, control } = useForm<FormData>({ defaultValues });

  const { loading, send } = useSend();
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await send(
      api["PATCH /flows/:flowId"](flow.id, {
        data: JSON.stringify(JSON.parse(data.data || "{}")),
      }),
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="data"
        render={({ field, fieldState }) => (
          <>
            <div
              className={css({
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "border",
                borderRadius: "radius8",
                overflow: "hidden",
              })}
            >
              <Editor
                defaultValue={defaultValues.data}
                height="400px"
                language="json"
                onChange={(v) => field.onChange(v ?? "")}
                options={{ minimap: { enabled: false } }}
              />
            </div>
            {fieldState.error ? <Text>{fieldState.error.message}</Text> : null}
          </>
        )}
        rules={{
          required: "Required",
          validate: (v) => {
            try {
              JSON.parse(v);
            } catch (e) {
              return "Must be valid JSON";
            }
          },
        }}
      />

      <Button className={css({ mt: "space24" })} loading={loading} type="submit">
        Save
      </Button>
    </form>
  );
};
