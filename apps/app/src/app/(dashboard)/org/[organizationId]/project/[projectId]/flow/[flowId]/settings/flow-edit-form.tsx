"use client";

import { css } from "@flows/styled-system/css";
import { useSend } from "hooks/use-send";
import type { FlowDetail } from "lib/api";
import { api } from "lib/api";
import { useRouter } from "next/navigation";
import { type FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { t } from "translations";
import { Button, Checkbox, Input, Select, Text, toast } from "ui";

import type { FlowEditFormData, MatchGroup } from "./flow-edit-types";
import { FlowMatchGroup } from "./targeting";

type Props = {
  flow: FlowDetail;
};

export const FlowEditForm: FC<Props> = ({ flow }) => {
  const defaultValues: FlowEditFormData = {
    description: flow.description,
    human_id: flow.human_id,
    human_id_alias: flow.human_id_alias ?? "",
    name: flow.name,
    published: !!flow.published_at,
    frequency: flow.frequency || "once",
    userProperties: (flow.data.userProperties as MatchGroup[] | undefined) ?? [[]],
  };
  const { register, handleSubmit, control, setValue, watch } = useForm<FlowEditFormData>({
    defaultValues,
  });

  const { loading, send } = useSend();
  const router = useRouter();
  const onSubmit: SubmitHandler<FlowEditFormData> = async (data) => {
    const res = await send(
      api["PATCH /flows/:flowId"](flow.id, {
        ...data,
        human_id_alias: data.human_id_alias || undefined,
        frequency: data.frequency || undefined,
        data: JSON.stringify({ ...flow.data, userProperties: data.userProperties }),
      }),
    );
    if (res.error) return;
    toast.success(t.toasts.updateFlowSuccess);
    router.refresh();
  };

  const isCloud = flow.flow_type === "cloud";

  const userProperties = watch("userProperties");

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
          <Input {...register(key)} defaultValue={defaultValues[key]} key={key} label={label} />
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

      <Text className={css({ mb: "space8" })} variant="titleL">
        {t.targeting.targeting}
      </Text>
      {userProperties.map((_, i) => (
        <FlowMatchGroup
          control={control}
          index={i}
          // eslint-disable-next-line react/no-array-index-key -- index is fine here
          key={i}
        />
      ))}
      <div>
        <Button
          onClick={() => setValue("userProperties", [...userProperties, []])}
          size="small"
          variant="black"
        >
          {t.targeting.addGroup}
        </Button>
      </div>

      <Button className={css({ mt: "space24" })} loading={loading} type="submit">
        Save
      </Button>
    </form>
  );
};
