"use client";

import { useSend } from "hooks/use-send";
import { api } from "lib/api";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { routes } from "routes";
import { t } from "translations";
import {
  Button,
  Dialog,
  DialogActions,
  DialogClose,
  DialogContent,
  DialogTitle,
  Input,
  toast,
} from "ui";

type Props = {
  projectId: string;
  organizationId: string;
};

type FormData = {
  name: string;
};

export const CreateFlowDialog: FC<Props> = ({ projectId, organizationId }) => {
  const { send, loading } = useSend();
  const router = useRouter();

  const { register, handleSubmit } = useForm<FormData>();
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const res = await send(api["POST /projects/:projectId/flows"](projectId, data));
    if (!res.data) return;
    toast.success(t.toasts.createFlowSuccess);
    router.push(routes.flow({ flowId: res.data.id, projectId, organizationId }));
  };

  return (
    <Dialog trigger={<Button variant="black">New flow</Button>}>
      <DialogTitle>Create Flow</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Input {...register("name")} fullWidth label="Name" />
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
