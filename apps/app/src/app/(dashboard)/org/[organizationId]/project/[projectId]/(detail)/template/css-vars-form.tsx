"use client";

import { css } from "@flows/styled-system/css";
import { Box } from "@flows/styled-system/jsx";
import { CodeEditor } from "components/ui/code-editor";
import { mutate } from "hooks/use-fetch";
import { useSend } from "hooks/use-send";
import { api, type ProjectDetail } from "lib/api";
import { useRouter } from "next/navigation";
import { type FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { t } from "translations";
import { Button, Checkbox, Text, toast } from "ui";

type Props = {
  project: ProjectDetail;
};

type FormValues = {
  cssVars: string | null;
};

export const CssVarsForm: FC<Props> = ({ project }) => {
  const { control, handleSubmit, watch, setError, clearErrors, setValue, formState } =
    useForm<FormValues>({
      defaultValues: { cssVars: project.css_vars ?? null },
    });
  const value = watch("cssVars");

  const { send, loading } = useSend();
  const router = useRouter();
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const res = await send(
      api["PATCH /projects/:projectId"](project.id, { css_vars: data.cssVars }),
      { errorMessage: t.toasts.saveCssVarsFailed },
    );
    if (res.error) return;
    toast.success(t.toasts.saveCssVarsSuccess);
    void mutate("/projects/:projectId", [project.id]);
    router.refresh();
  };

  return (
    <Box cardWrap="-" mb="space16" p="space16">
      <Checkbox
        checked={value !== null}
        label="CSS Variables"
        onCheckedChange={(checked) => setValue("cssVars", checked ? "" : null)}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        {value !== null && (
          <Controller
            control={control}
            name="cssVars"
            render={({ field, fieldState }) => (
              <>
                <CodeEditor
                  defaultValue={field.value ?? ""}
                  language="css"
                  onChange={field.onChange}
                  onValidate={(markers) => {
                    if (markers.length)
                      setError("cssVars", {
                        message: `Invalid CSS: ${markers.map((m) => m.message).join(", ")}`,
                      });
                    else clearErrors("cssVars");
                  }}
                />
                <Text className={css({ minH: "20px", mt: "space4", mb: "space8" })} color="danger">
                  {fieldState.error?.message}
                </Text>
              </>
            )}
          />
        )}

        <Button disabled={!formState.isValid} loading={loading} type="submit">
          Save
        </Button>
      </form>
    </Box>
  );
};
