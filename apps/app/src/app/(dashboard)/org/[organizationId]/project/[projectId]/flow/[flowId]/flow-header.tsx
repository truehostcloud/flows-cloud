"use client";

import { Flex } from "@flows/styled-system/jsx";
import { MenuItem } from "components/header/menu-item";
import { MenuSection } from "components/header/menu-section";
import { useSend } from "hooks/use-send";
import { api, type FlowDetail } from "lib/api";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { t } from "translations";
import { Button, Popover, PopoverContent, PopoverTrigger, Switch, Text, toast } from "ui";

import { FlowDeleteDialog } from "./settings/flow-delete-dialog";

type Props = {
  flow: FlowDetail;
  params: { flowId: string; projectId: string; organizationId: string };
};

export const FlowHeader: FC<Props> = ({ flow, params }) => {
  //TODO: Improve local flow options
  const flowIsCloud = flow.flow_type === "cloud";
  const flowIsPublic = flow.published_at !== null;

  const { loading, send } = useSend();
  const router = useRouter();
  const handlePublishedToggle = async (published: boolean): Promise<void> => {
    const res = await send(
      api["PATCH /flows/:flowId"](flow.id, {
        published,
      }),
    );
    if (res.error) return;
    toast.success(published ? t.toasts.publishFlowSuccess : t.toasts.unpublishFlowSuccess);
    router.refresh();
  };

  const POPOVER_OPTIONS = [
    {
      item: (
        <FlowDeleteDialog
          flow={flow}
          key="delete"
          organizationId={params.organizationId}
          trigger={
            <MenuItem>
              <Text>Delete</Text>
            </MenuItem>
          }
        />
      ),
    },
    {
      item: (
        <MenuItem key="duplicate">
          <Text>Duplicate TODO</Text>
        </MenuItem>
      ),
    },
    {
      item: (
        <MenuItem key="settings">
          <Text>Settings TODO</Text>
        </MenuItem>
      ),
    },
  ];
  return (
    <Flex alignItems="center" justifyContent="space-between" mb="space24">
      <Text variant="titleXl">{flow.name}</Text>
      {flowIsCloud ? (
        <Flex alignItems="center" gap="space16">
          <Flex gap="space8">
            <Text weight="600">Public</Text>
            <Switch checked={flowIsPublic} disabled={loading} onChange={handlePublishedToggle} />
          </Flex>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="black">Options</Button>
            </PopoverTrigger>
            <PopoverContent>
              <MenuSection>{POPOVER_OPTIONS.map((option) => option.item)}</MenuSection>
            </PopoverContent>
          </Popover>
        </Flex>
      ) : (
        <Text>Local flow</Text>
      )}
    </Flex>
  );
};
