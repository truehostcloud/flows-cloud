"use client";

import { css } from "@flows/styled-system/css";
import { Editor } from "@monaco-editor/react";
import { useSend } from "hooks/use-send";
import { api, type FlowDetail, type UpdateFlow } from "lib/api";
import { type FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { Button, Checkbox, Input, Text } from "ui";

type Props = {
  flow: FlowDetail;
};

export const FlowEditForm: FC<Props> = ({ flow }) => {
  const defaultValues: UpdateFlow = {
    data: JSON.stringify((flow.data as FlowDetail["data"] | undefined) ?? {}, null, 2),
    description: flow.description,
    human_id: flow.human_id,
    human_id_alias: flow.human_id_alias ?? "",
    name: flow.name,
    published: !!flow.published_at,
  };
  const { register, handleSubmit, setValue, control } = useForm<UpdateFlow>({ defaultValues });

  const { loading, send } = useSend();
  const onSubmit: SubmitHandler<UpdateFlow> = async (data) => {
    await send(
      api["PUT /flows/:flowId"](flow.id, {
        ...data,
        human_id_alias: data.human_id_alias || undefined,
        data:
          flow.flow_type === "cloud" ? JSON.stringify(JSON.parse(data.data || "{}")) : undefined,
      }),
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "space8",
          mb: "space16",
          alignItems: "flex-start",
        })}
      >
        {(
          [
            { key: "name", label: "Name" },
            { key: "description", label: "Description" },
            { key: "human_id", label: "Human ID" },
            { key: "human_id_alias", label: "Human ID Alias" },
          ] as const
        ).map(({ key, label }) => (
          <Input
            {...register(key)}
            key={key}
            label={label}
            wrapperClassName={css({ display: "block", mt: "space4" })}
          />
        ))}
      </div>
      {flow.flow_type === "cloud" && (
        <>
          <Text className={css({ mb: "space4" })}>Steps</Text>
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
              onChange={(v) => setValue("data", v ?? "")}
            />
          </div>
        </>
      )}

      <div className={css({ mt: "space16" })}>
        <Controller
          control={control}
          name="published"
          render={({ field }) => (
            <Checkbox checked={field.value} label="Published" onCheckedChange={field.onChange} />
          )}
        />
      </div>

      <Button className={css({ mt: "space24" })} loading={loading} type="submit">
        Save
      </Button>
    </form>
  );
};
