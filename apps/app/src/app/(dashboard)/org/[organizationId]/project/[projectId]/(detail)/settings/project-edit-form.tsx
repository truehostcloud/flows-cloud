"use client";

import { css } from "@flows/styled-system/css";
import { Flex } from "@flows/styled-system/jsx";
import { mutate } from "hooks/use-fetch";
import { useSend } from "hooks/use-send";
import { Plus16 } from "icons";
import { api, type ProjectDetail } from "lib/api";
import { clipboard } from "lib/clipboard";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useFieldArray, useForm } from "react-hook-form";
import { t } from "translations";
import { Button, Input, Text, toast } from "ui";

type Props = {
  project: ProjectDetail;
};

type FormData = {
  name: string;
  description: string;
  domains: { value: string }[];
};

export const ProjectEditForm: FC<Props> = ({ project }) => {
  const defaultValues: FormData = {
    domains: project.domains.map((value) => ({ value })),
    name: project.name,
    description: project.description || "",
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
      }),
      { errorMessage: t.toasts.saveProjectFailed },
    );
    if (res.error) return;
    toast.success(t.toasts.updateProjectSuccess);
    void mutate("/organizations/:organizationId/projects", [project.organization_id]);
    router.refresh();
  };

  const handleCopyProjectId = async (): Promise<void> => {
    await clipboard.copy(project.id);
    toast.success(t.toasts.projectIdCopied);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        className={css({
          cardWrap: "-",
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
          label="Project name"
        />
        <Flex alignItems="flex-end" gap="space8" mb="space16">
          <Input
            disabled
            fullClassName={css({ maxWidth: "400px", width: "100%" })}
            label="Project ID"
            value={project.id}
          />
          <Button onClick={handleCopyProjectId} variant="secondary">
            {t.actions.copy}
          </Button>
        </Flex>
        <Input
          {...register("description")}
          asChild
          defaultValue={formState.defaultValues?.description}
          fullClassName={css({ mb: "space12" })}
          inputClassName={css({ height: "unset" })}
          key="description"
          label="Project description"
        >
          <textarea rows={4} />
        </Input>
      </div>
      <Flex cardWrap="-" flexDirection="column" gap="space16" mb="space16" padding="space16">
        <Flex flexDirection="column">
          <Text variant="titleL">{t.project.domains.domains}</Text>
          <Text color="muted">{t.project.domains.description}</Text>
        </Flex>

        {fields.length > 0 && (
          <Flex direction="column" gap="space8">
            {fields.map((field, i) => {
              return (
                <Flex gap="space8" key={field.id}>
                  <Input
                    type="url"
                    {...register(`domains.${i}.value`)}
                    required
                    wrapperClassName={css({ maxWidth: "400px", width: "100%" })}
                  />
                  <Button onClick={() => remove(i)} variant="secondary">
                    {t.actions.remove}
                  </Button>
                </Flex>
              );
            })}
          </Flex>
        )}
        <div>
          <Button
            onClick={() => append({ value: "" })}
            size="small"
            startIcon={<Plus16 />}
            variant="secondary"
          >
            {t.project.domains.addDomain}
          </Button>
        </div>
      </Flex>

      <Button loading={loading} type="submit">
        {t.actions.save}
      </Button>
    </form>
  );
};
