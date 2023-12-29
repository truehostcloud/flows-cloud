import { useSend } from "hooks/use-send";
import type { FlowDetail } from "lib/api";
import { api } from "lib/api";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { useState } from "react";
import { Button, Dialog, DialogActions, DialogClose, DialogContent, DialogTitle, Text } from "ui";

type Props = {
  flow: FlowDetail;
};

export const FlowPublishChangesDialog: FC<Props> = ({ flow }) => {
  const [open, setOpen] = useState(false);

  const { loading, send } = useSend();
  const router = useRouter();
  const handlePublish = async (): Promise<void> => {
    const res = await send(api["POST /flows/:flowId/publish"](flow.id));
    if (res.error) return;
    setOpen(false);
    router.refresh();
  };

  const changesToPublish = !!flow.draftVersion;
  if (!changesToPublish) return null;

  return (
    <Dialog
      onOpenChange={setOpen}
      open={open}
      trigger={<Button variant="secondary">Publish changes</Button>}
    >
      <DialogTitle>Publish changes</DialogTitle>
      <DialogContent>
        <Text>Are you sure you want to publish flow changes?</Text>
      </DialogContent>
      <DialogActions>
        <DialogClose asChild>
          <Button shadow={false} size="small" variant="secondary">
            Close
          </Button>
        </DialogClose>
        <Button loading={loading} onClick={handlePublish} size="small" variant="primary">
          Publish
        </Button>
      </DialogActions>
    </Dialog>
  );
};
