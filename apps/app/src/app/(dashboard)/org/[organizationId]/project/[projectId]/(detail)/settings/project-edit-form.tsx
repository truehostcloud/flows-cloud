"use client";

import { css } from "@flows/styled-system/css";
import { Flex } from "@flows/styled-system/jsx";
import { mutate } from "hooks/use-fetch";
import { useSend } from "hooks/use-send";
import { api, type ProjectDetail } from "lib/api";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useFieldArray, useForm } from "react-hook-form";
import { t } from "translations";
import { Button, Input, Text, toast } from "ui";

const urlRegex =
  // eslint-disable-next-line prefer-named-capture-group -- ignore
  /^(?!mailto:)(?:(?:http|https|ftp):\/\/)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(\/|\\?|#)[^\\s]*)?$/;

type Props = {
  project: ProjectDetail;
};

type FormData = {
  name: string;
  description: string;
  human_id: string;
  human_id_alias: string;
  domains: { value: string }[];
};

export const ProjectEditForm: FC<Props> = ({ project }) => {
  const defaultValues: FormData = {
    domains: project.domains.map((value) => ({ value })),
    name: project.name,
    description: project.description || "",
    human_id: project.human_id,
    human_id_alias: project.human_id_alias || "",
  };
  const { handleSubmit, control, register, formState } = useForm<FormData>({ defaultValues });
  const { append, fields, remove } = useFieldArray({ control, name: "domains" });

  const { send, loading } = useSend();
  const router = useRouter();
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const res = await send(
      api["PUT /projects/:projectId"](project.id, {
        domains: data.domains.map((d) => d.value),
        description: data.description || undefined,
        name: data.name,
        human_id: data.human_id,
        human_id_alias: data.human_id_alias || undefined,
      }),
    );
    if (res.error) return;
    toast.success(t.toasts.updateProjectSuccess);
    void mutate("/organizations/:organizationId/projects", [project.organization_id]);
    router.refresh();
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
          <Input {...register(key)} key={key} label={label} />
        ))}
      </div>
      <div
        className={css({ display: "flex", flexDirection: "column", gap: "space8", mb: "space16" })}
      >
        <Text>Domains</Text>
        {fields.map((field, i) => {
          const error = formState.errors.domains?.[i]?.value;
          return (
            <div
              className={css({ display: "flex", gap: "space8", alignItems: "flex-start" })}
              key={field.id}
            >
              <Flex direction="column" gap="space4">
                <Input
                  type="url"
                  {...register(`domains.${i}.value`, {
                    pattern: { value: urlRegex, message: "Should be valid url" },
                  })}
                  required
                />
                {error ? (
                  <Text color="danger" variant="bodyXs">
                    {error.message}
                  </Text>
                ) : null}
              </Flex>
              <Button onClick={() => remove(i)} variant="black">
                Remove
              </Button>
            </div>
          );
        })}
        <div>
          <Button onClick={() => append({ value: "" })} size="small" variant="black">
            Add
          </Button>
        </div>
      </div>
      <Button loading={loading} type="submit">
        Save
      </Button>
    </form>
  );
};
