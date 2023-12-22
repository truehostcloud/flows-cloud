"use client";

import { mutate } from "hooks/use-fetch";
import { useSend } from "hooks/use-send";
import type { ProjectDetail } from "lib/api";
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
  project: ProjectDetail;
};

export const ProjectDeleteDialog: FC<Props> = ({ project }) => {
  const router = useRouter();
  const { send, loading } = useSend();
  const handleDelete = async (): Promise<void> => {
    const res = await send(api["DELETE /projects/:projectId"](project.id));
    if (res.error) return;
    toast.success(t.toasts.deleteProjectSuccess);
    void mutate("/organizations/:organizationId/projects", [project.organization_id]);
    router.replace(routes.organization({ organizationId: project.organization_id }));
  };

  return (
    <Dialog trigger={<Button variant="secondary">Delete</Button>}>
      <DialogTitle>Delete project</DialogTitle>
      <DialogContent>
        <Text>Are you sure you want to delete this project?</Text>
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
