"use client";

import { css } from "@flows/styled-system/css";
import { useSend } from "hooks/use-send";
import { api, type FlowDetail } from "lib/api";
import { type FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { Button, Checkbox, Input } from "ui";

type Props = {
  flow: FlowDetail;
};

type FormData = {
  name: string;
  description: string;
  human_id: string;
  human_id_alias: string;
  published: boolean;
};

export const FlowEditForm: FC<Props> = ({ flow }) => {
  const defaultValues: FormData = {
    description: flow.description,
    human_id: flow.human_id,
    human_id_alias: flow.human_id_alias ?? "",
    name: flow.name,
    published: !!flow.published_at,
  };
  const { register, handleSubmit, control } = useForm<FormData>({ defaultValues });

  const { loading, send } = useSend();
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await send(
      api["PATCH /flows/:flowId"](flow.id, {
        ...data,
        human_id_alias: data.human_id_alias || undefined,
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
