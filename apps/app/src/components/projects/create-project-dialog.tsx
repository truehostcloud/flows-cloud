"use client";

import { css } from "@flows/styled-system/css";
import { useSend } from "hooks/use-send";
import { api } from "lib/api";
import { useRouter } from "next/navigation";
import type { FC, ReactNode } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { routes } from "routes";
import { Button, Dialog, DialogActions, DialogClose, DialogContent, DialogTitle, Input } from "ui";

type Props = {
  trigger: ReactNode;
  organizationId: string;
};

type FormData = {
  name: string;
};

export const CreateProjectDialog: FC<Props> = ({ trigger, organizationId }) => {
  const { handleSubmit, register } = useForm<FormData>();
  const router = useRouter();
  const { send, loading } = useSend();
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const res = await send(
      api["POST /organizations/:organizationId/projects"](organizationId, data),
    );
    if (!res.data) return;
    router.push(routes.project({ projectId: res.data.id }));
  };

  return (
    <Dialog trigger={trigger}>
      <DialogTitle>Create Project</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Input
            {...register("name")}
            inputClassName={css({ width: "100%" })}
            label="Name"
            wrapperClassName={css({ display: "block", mt: "space4" })}
          />
        </DialogContent>
        <DialogActions>
          <DialogClose asChild>
            <Button size="small" variant="black">
              Close
            </Button>
          </DialogClose>
          <Button loading={loading} size="small" type="submit">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
