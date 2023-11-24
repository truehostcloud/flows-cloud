"use client";

import { css } from "@flows/styled-system/css";
import { Editor } from "@monaco-editor/react";
import { useSend } from "hooks/use-send";
import { api, type FlowDetail, type UpdateFlow } from "lib/api";
import { type FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Button, Input } from "ui";

type Props = {
  flow: FlowDetail;
};

export const FlowEditForm: FC<Props> = ({ flow }) => {
  const defaultValues: UpdateFlow = {
    data: JSON.stringify(flow.data, null, 2),
    description: flow.description,
    human_id: flow.human_id,
    human_id_alias: flow.human_id_alias ?? "",
    name: flow.name,
  };
  const { register, handleSubmit, setValue } = useForm<UpdateFlow>({ defaultValues });

  const { loading, send } = useSend();
  const onSubmit: SubmitHandler<UpdateFlow> = async (data) => {
    const apiData = { ...data, data: JSON.stringify(JSON.parse(data.data ?? "")) };
    await send(api["PATCH /flows/:flowId"](flow.id, apiData));
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
        <input name="id" type="hidden" value={flow.id} />
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

      <Button className={css({ mt: "space16" })} loading={loading} type="submit">
        Save
      </Button>
    </form>
  );
};
