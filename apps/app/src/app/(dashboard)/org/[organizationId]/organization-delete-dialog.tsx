"use client";

import { mutate } from "hooks/use-fetch";
import { useSend } from "hooks/use-send";
import type { OrganizationDetail } from "lib/api";
import { api } from "lib/api";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { routes } from "routes";
import { t } from "translations";
import {
  Button,
  Dialog,
  DialogActions,
  DialogClose,
  DialogContent,
  DialogTitle,
  Text,
  toast,
} from "ui";

type Props = {
  organization: OrganizationDetail;
};

export const OrganizationDeleteDialog: FC<Props> = ({ organization }) => {
  const router = useRouter();
  const { send, loading } = useSend();
  const handleDelete = async (): Promise<void> => {
    const res = await send(api["DELETE /organizations/:organizationId"](organization.id));
    if (res.error) return;
    toast.success(t.toasts.deleteOrgSuccess);
    void mutate("/organizations");
    router.replace(routes.home);
  };

  return (
    <Dialog trigger={<Button variant="black">Delete</Button>}>
      <DialogTitle>Delete organization</DialogTitle>
      <DialogContent>
        <Text>Are you sure you want to delete this organization?</Text>
      </DialogContent>
      <DialogActions>
        <DialogClose asChild>
          <Button size="small" variant="black">
            Close
          </Button>
        </DialogClose>
        <Button loading={loading} onClick={handleDelete} size="small" variant="primary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
