"use client";

import { useSend } from "hooks/use-send";
import type { OrganizationDetail } from "lib/api";
import { api } from "lib/api";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { routes } from "routes";
import { Button, Dialog, DialogActions, DialogClose, DialogContent, DialogTitle, Text } from "ui";

type Props = {
  organization: OrganizationDetail;
};

export const OrganizationDeleteDialog: FC<Props> = ({ organization }) => {
  const router = useRouter();
  const { send, loading } = useSend();
  const handleDelete = async (): Promise<void> => {
    const { error } = await send(api["DELETE /organizations/:organizationId"](organization.id));
    if (!error) router.replace(routes.dashboard);
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
