"use client";

import { useSend } from "hooks/use-send";
import { api, type OrganizationDetail, type OrganizationUser } from "lib/api";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { Button, Dialog, DialogActions, DialogClose, DialogContent, DialogTitle, Text } from "ui";

type Props = {
  organization: OrganizationDetail;
  user: OrganizationUser;
};

export const MemberRemoveDialog: FC<Props> = ({ organization, user }) => {
  const router = useRouter();
  const { send, loading } = useSend();
  const handleDelete = async (): Promise<void> => {
    const res = await send(
      api["DELETE /organizations/:organizationId/users/:userId"](organization.id, user.id),
    );
    if (res.error) return;
    router.refresh();
  };

  return (
    <Dialog
      trigger={
        <Button size="small" variant="black">
          Remove
        </Button>
      }
    >
      <DialogTitle>Remove member</DialogTitle>
      <DialogContent>
        <Text>
          Are you sure you want to remove {user.email} from {organization.name}?
        </Text>
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
