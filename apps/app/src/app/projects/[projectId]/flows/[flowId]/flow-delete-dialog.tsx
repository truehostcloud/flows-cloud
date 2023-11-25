"use client";

import { useSend } from "hooks/use-send";
import type { FlowPreview } from "lib/api";
import { api } from "lib/api";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { useState } from "react";
import { routes } from "routes";
import { Button, Dialog, DialogActions, DialogClose, DialogContent, DialogTitle, Text } from "ui";

type Props = {
  flow: FlowPreview;
};

export const FlowDeleteDialog: FC<Props> = ({ flow }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { send, loading } = useSend();
  const handleDelete = async (): Promise<void> => {
    const { error } = await send(api["DELETE /flows/:flowId"](flow.id));
    if (!error) router.replace(routes.project({ projectId: flow.project_id }));
  };

  return (
    <>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTitle>Delete flow</DialogTitle>
        <DialogContent>
          <Text>Are you sure you want to delete this flow?</Text>
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
      <Button onClick={() => setOpen(true)} variant="black">
        Delete
      </Button>
    </>
  );
};
