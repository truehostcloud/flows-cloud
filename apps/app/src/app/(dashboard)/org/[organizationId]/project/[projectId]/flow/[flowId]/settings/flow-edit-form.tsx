"use client";

import { css } from "@flows/styled-system/css";
import { Flex } from "@flows/styled-system/jsx";
import { useSend } from "hooks/use-send";
import type { FlowDetail } from "lib/api";
import { api } from "lib/api";
import { useRouter } from "next/navigation";
import { type FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { t } from "translations";
import { Button, Input, Select, Text, toast } from "ui";

import type { FlowEditFormData, MatchGroup } from "./flow-edit-types";
import { TargetingSection } from "./targeting/targeting-section";

type Props = {
  flow: FlowDetail;
};

export const FlowEditForm: FC<Props> = ({ flow }) => {
  const { register, handleSubmit, control, setValue, watch, reset, formState } =
    useForm<FlowEditFormData>({
      defaultValues: createDefaultValues(flow),
    });

  const { loading, send } = useSend();
  const router = useRouter();
  const onSubmit: SubmitHandler<FlowEditFormData> = async (data) => {
    const fixedUserProperties = data.userProperties
      .map((group) => group.filter((matcher) => !!matcher.key))
      .filter((group) => !!group.length);

    const res = await send(
      api["PATCH /flows/:flowId"](flow.id, {
        ...data,
        userProperties: fixedUserProperties,
      }),
    );
    if (res.error) return;
    if (res.data) reset(createDefaultValues(res.data));
    toast.success(t.toasts.updateFlowSuccess);
    router.refresh();
  };

  const isCloud = flow.flow_type === "cloud";

  const userProperties = watch("userProperties");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        className={css({
          cardWrap: "",
          padding: "space16",
          mb: "space16",
        })}
      >
        <Text className={css({ mb: "space12" })} variant="titleL">
          General
        </Text>

        <Input
          {...register("name")}
          defaultValue={formState.defaultValues?.name}
          fullClassName={css({ maxWidth: "400px", width: "100%", mb: "space16" })}
          key="name"
          label="Flow name"
        />
        <Input
          {...register("description")}
          asChild
          defaultValue={formState.defaultValues?.description}
          fullClassName={css({ mb: "space12" })}
          inputClassName={css({ height: "unset" })}
          key="description"
          label="Description"
        >
          <textarea rows={4} />
        </Input>
        <Flex gap="space16">
          <Input
            {...register("human_id")}
            defaultValue={formState.defaultValues?.human_id}
            description="Unique identifier for this flow. Cannot be changed."
            disabled
            fullClassName={css({ maxWidth: "400px", width: "100%" })}
            key="human_id"
            label="Human ID"
          />
        </Flex>
      </div>
      <Flex cardWrap="" flexDirection="column" gap="space12" mb="space16" padding="space16">
        <Flex flexDirection="column">
          <Text variant="titleL">{t.frequency.frequency}</Text>
          <Text color="muted">{t.frequency.description}</Text>
        </Flex>
        {isCloud ? (
          <Controller
            control={control}
            name="frequency"
            render={({ field }) => (
              <Select
                buttonClassName={css({ width: "200px" })}
                onChange={field.onChange}
                options={[
                  { value: "once", label: "Once" },
                  { value: "every-time", label: "Every time" },
                ]}
                value={field.value}
              />
            )}
          />
        ) : (
          <Flex justifyContent="center" padding="space32">
            <Text color="muted">{t.frequency.localState}</Text>
          </Flex>
        )}
      </Flex>

      <TargetingSection
        control={control}
        isCloud={isCloud}
        setValue={setValue}
        userProperties={userProperties}
      />

      <Button loading={loading} type="submit">
        {t.actions.save}
      </Button>
    </form>
  );
};

const createDefaultValues = (flow: FlowDetail): FlowEditFormData => {
  const editVersion = flow.draftVersion ?? flow.publishedVersion;
  return {
    description: flow.description,
    human_id: flow.human_id,
    human_id_alias: flow.human_id_alias ?? "",
    name: flow.name,
    frequency: editVersion?.frequency || "once",
    userProperties: (editVersion?.userProperties as MatchGroup[] | undefined) ?? [],
  };
};
