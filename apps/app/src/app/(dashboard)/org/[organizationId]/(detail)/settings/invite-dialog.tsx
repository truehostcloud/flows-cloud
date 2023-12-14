"use client";

import { useSend } from "hooks/use-send";
import { api } from "lib/api";
import { useRouter } from "next/navigation";
import { type FC, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
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
  organizationId: string;
};

type FormData = {
  email: string;
};

export const InviteDialog: FC<Props> = ({ organizationId }) => {
  const [open, setOpen] = useState(false);
  const { send, loading } = useSend();
  const router = useRouter();

  const { register, handleSubmit } = useForm<FormData>();
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const res = await send(api["POST /organizations/:organizationId/users"](organizationId, data));
    if (res.error) return;
    toast.success(t.toasts.inviteSent);
    router.refresh();
    setOpen(false);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open} trigger={<Button variant="black">Invite</Button>}>
      <DialogTitle>Invite member</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Input {...register("email")} fullWidth label="Email" required type="email" />
        </DialogContent>
        <DialogActions>
          <DialogClose asChild>
            <Button size="small" variant="black">
              Close
            </Button>
          </DialogClose>
          <Button loading={loading} size="small" type="submit">
            Send invite
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
