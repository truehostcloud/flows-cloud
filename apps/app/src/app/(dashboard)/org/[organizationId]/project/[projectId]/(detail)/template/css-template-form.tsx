"use client";

import { css } from "@flows/styled-system/css";
import { Box, Flex } from "@flows/styled-system/jsx";
import { CodeEditor } from "components/ui/code-editor";
import { mutate } from "hooks/use-fetch";
import { useSend } from "hooks/use-send";
import { api, type ProjectDetail } from "lib/api";
import { useRouter } from "next/navigation";
import { type FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { t } from "translations";
import { Button, Switch, Text, toast } from "ui";

type Props = {
  project: ProjectDetail;
};

type FormValues = {
  cssTemplate: string | null;
};

export const CssTemplateForm: FC<Props> = ({ project }) => {
  const { control, handleSubmit, watch, setError, clearErrors, setValue, formState } =
    useForm<FormValues>({
      defaultValues: { cssTemplate: project.css_template ?? null },
    });
  const value = watch("cssTemplate");

  const { send, loading } = useSend();
  const router = useRouter();
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const res = await send(
      api["PATCH /projects/:projectId"](project.id, { css_template: data.cssTemplate }),
      { errorMessage: t.toasts.saveCssVarsFailed },
    );
    if (res.error) return;
    toast.success(t.toasts.saveCssVarsSuccess);
    void mutate("/projects/:projectId", [project.id]);
    router.refresh();
  };

  return (
    <Box cardWrap="-" p="space16">
      <Box mb="space12">
        <Text variant="titleL">Full CSS template</Text>
        <Text color="muted">
          Full CSS template gives you full control over all elements of flows.
        </Text>
      </Box>
      <Flex gap="space8" mb="space12">
        <Switch
          checked={value !== null}
          onChange={(checked) => setValue("cssTemplate", checked ? "" : null)}
        />
        <Text>Customize full CSS template</Text>
      </Flex>
      <form onSubmit={handleSubmit(onSubmit)}>
        {value !== null && (
          <Controller
            control={control}
            name="cssTemplate"
            render={({ field, fieldState }) => (
              <>
                <CodeEditor
                  defaultValue={field.value ?? ""}
                  language="css"
                  onChange={field.onChange}
                  onValidate={(markers) => {
                    if (markers.length)
                      setError("cssTemplate", {
                        message: `Invalid CSS: ${markers.map((m) => m.message).join(", ")}`,
                      });
                    else clearErrors("cssTemplate");
                  }}
                />
                <Text className={css({ minH: "20px", mt: "space4", mb: "space8" })} color="danger">
                  {fieldState.error?.message}
                </Text>
              </>
            )}
          />
        )}

        {/* TODO: @VojtechVidra disable this button if the form isn't dirty I couldn't figure it our with the toggle */}
        <Button disabled={!formState.isValid} loading={loading} type="submit">
          Save
        </Button>
      </form>
    </Box>
  );
};
