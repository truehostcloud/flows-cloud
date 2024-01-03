"use client";

import { css } from "@flows/styled-system/css";
import { Box, Flex } from "@flows/styled-system/jsx";
import { useSend } from "hooks/use-send";
import { api, type FlowDetail, type UpdateFlow } from "lib/api";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { t } from "translations";
import { Button, Input, Text, toast } from "ui";

type Props = {
  flow: FlowDetail;
};

type LaunchForm = Pick<UpdateFlow, "element" | "location">;

const createDefaultValues = (flow: FlowDetail): LaunchForm => {
  const editVersion = flow.draftVersion ?? flow.publishedVersion;
  return {
    element: editVersion?.element,
    location: editVersion?.location,
  };
};

export const LaunchForm: FC<Props> = ({ flow }) => {
  const { register, handleSubmit, formState, reset } = useForm<LaunchForm>({
    defaultValues: createDefaultValues(flow),
  });
  const { send, loading } = useSend();
  const router = useRouter();
  const onSubmit: SubmitHandler<LaunchForm> = async (data) => {
    const res = await send(api["PATCH /flows/:flowId"](flow.id, data), {
      errorMessage: t.toasts.saveLaunchFailed,
    });
    if (res.error) return;
    if (res.data) reset(createDefaultValues(res.data));
    toast.success(t.toasts.saveLaunchSuccess);
    router.refresh();
  };

  const isCloud = flow.flow_type === "cloud";

  //TODO: improve this form to make it clear what the fields do

  return (
    <Box cardWrap="" p="space16">
      <Text className={css({ mb: "space12" })} variant="titleL">
        Launch
      </Text>

      {isCloud ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("element")}
            defaultValue={formState.defaultValues?.element}
            fullClassName={css({ maxWidth: "400px", width: "100%", mb: "space16" })}
            label="Element"
          />
          <Input
            {...register("location")}
            defaultValue={formState.defaultValues?.location}
            fullClassName={css({ maxWidth: "400px", width: "100%", mb: "space16" })}
            label="Location"
          />
          <Button disabled={!formState.isDirty} loading={loading} type="submit" variant="black">
            Save
          </Button>
        </form>
      ) : (
        <Flex justifyContent="center" padding="space32">
          <Text color="muted">Local flow launch settings need to be changed in your codebase</Text>
        </Flex>
      )}
    </Box>
  );
};
