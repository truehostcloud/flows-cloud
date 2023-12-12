"use client";

import { css } from "@flows/styled-system/css";
import { useSend } from "hooks/use-send";
import type { FlowDetail, UpdateFlow } from "lib/api";
import { api } from "lib/api";
import { useRouter } from "next/navigation";
import { type FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { t } from "translations";
import { Button, Checkbox, Input, Select, Text, toast } from "ui";

type Props = {
  flow: FlowDetail;
};

type FormData = {
  name: string;
  description: string;
  human_id: string;
  human_id_alias: string;
  published: boolean;
  frequency?: UpdateFlow["frequency"];
};

export const FlowEditForm: FC<Props> = ({ flow }) => {
  const defaultValues: FormData = {
    description: flow.description,
    human_id: flow.human_id,
    human_id_alias: flow.human_id_alias ?? "",
    name: flow.name,
    published: !!flow.published_at,
    frequency: flow.frequency || "once",
  };
  const { register, handleSubmit, control } = useForm<FormData>({ defaultValues });

  const { loading, send } = useSend();
  const router = useRouter();
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const res = await send(
      api["PATCH /flows/:flowId"](flow.id, {
        ...data,
        human_id_alias: data.human_id_alias || undefined,
        frequency: data.frequency || undefined,
      }),
    );
    if (res.error) return;
    toast.success(t.toasts.updateFlowSuccess);
    router.refresh();
  };

  const isCloud = flow.flow_type === "cloud";

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

      {isCloud ? (
        <>
          <Controller
            control={control}
            name="frequency"
            render={({ field }) => (
              // eslint-disable-next-line jsx-a11y/label-has-associated-control -- not needed for select inside label
              <label>
                <Text as="span" className={css({ display: "block", mb: "space4" })}>
                  Frequency
                </Text>
                <Select
                  buttonClassName={css({ width: "200px" })}
                  onChange={field.onChange}
                  options={[
                    { value: "once", label: "Once" },
                    { value: "every-time", label: "Every time" },
                  ]}
                  value={field.value}
                />
              </label>
            )}
          />

          <div className={css({ mt: "space16" })}>
            <Controller
              control={control}
              name="published"
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  label="Published"
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </>
      ) : null}

      <Button className={css({ mt: "space24" })} loading={loading} type="submit">
        Save
      </Button>
    </form>
  );
};
