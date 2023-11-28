"use client";

import { css } from "@flows/styled-system/css";
import { useSend } from "hooks/use-send";
import { api, type ProjectDetail } from "lib/api";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useFieldArray, useForm } from "react-hook-form";
import { Button, Input, Text } from "ui";

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
  const { handleSubmit, control, register } = useForm<FormData>({ defaultValues });
  const { append, fields, remove } = useFieldArray({ control, name: "domains" });

  const { send, loading } = useSend();
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await send(
      api["PUT /projects/:projectId"](project.id, {
        domains: data.domains.map((d) => d.value),
        description: project.description || undefined,
        name: project.name,
        human_id: project.human_id,
        human_id_alias: project.human_id_alias || undefined,
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
      <div
        className={css({ display: "flex", flexDirection: "column", gap: "space8", mb: "space16" })}
      >
        <Text>Domains</Text>
        {fields.map((field, i) => (
          <div
            className={css({ display: "flex", gap: "space8", alignItems: "center" })}
            key={field.id}
          >
            <Input type="url" {...register(`domains.${i}.value`)} required />
            <Button onClick={() => remove(i)} size="small" variant="black">
              Remove
            </Button>
          </div>
        ))}
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
