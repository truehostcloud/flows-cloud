"use client";

import { useSend } from "hooks/use-send";
import type { ProjectDetail } from "lib/api";
import { api } from "lib/api";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { routes } from "routes";
import { Button, Dialog, DialogActions, DialogClose, DialogContent, DialogTitle, Text } from "ui";

type Props = {
  project: ProjectDetail;
};

export const ProjectDeleteDialog: FC<Props> = ({ project }) => {
  const router = useRouter();
  const { send, loading } = useSend();
  const handleDelete = async (): Promise<void> => {
    const { error } = await send(api["DELETE /projects/:projectId"](project.id));
    if (!error) router.replace(routes.organization({ organizationId: project.organization_id }));
  };

  return (
    <Dialog trigger={<Button variant="black">Delete</Button>}>
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
