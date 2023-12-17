"use client";

import { useSend } from "hooks/use-send";
import type { FlowPreview } from "lib/api";
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
  flow: FlowPreview;
  organizationId: string;
  trigger: React.ReactNode;
};

export const FlowDeleteDialog: FC<Props> = ({ flow, organizationId, trigger }) => {
  const router = useRouter();
  const { send, loading } = useSend();
  const handleDelete = async (): Promise<void> => {
    const res = await send(api["DELETE /flows/:flowId"](flow.id));
    if (res.error) return;
    toast.success(t.toasts.deleteFlowSuccess);
    router.replace(routes.project({ projectId: flow.project_id, organizationId }));
  };

  return (
    <Dialog trigger={trigger}>
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
  );
};
