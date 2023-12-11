"use client";

import { css } from "@flows/styled-system/css";
import { useFetch } from "hooks/use-fetch";
import { useSend } from "hooks/use-send";
import { api } from "lib/api";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { Button, Text } from "ui";

export const Invites: FC = () => {
  const { data, mutate } = useFetch("/me");
  const router = useRouter();

  const { send, loading } = useSend();
  const handleAccept = async (inviteId: string): Promise<void> => {
    const res = await send(api["POST /invites/:inviteId/accept"](inviteId));
    if (res.error) return;
    void mutate();
    router.refresh();
  };

  if (!data?.pendingInvites.length) return null;

  return data.pendingInvites.map((invite) => (
    <div className={css({ backgroundColor: "bg.subtle" })} key={invite.id}>
      <div
        className={css({
          maxWidth: "1100px",
          mx: "auto",
          py: "space8",
          px: "space16",
          display: "flex",
          gap: "space24",
          alignItems: "center",
        })}
      >
        <Text>You&apos;ve been invited to join {invite.organizationName}</Text>
        <Button loading={loading} onClick={() => handleAccept(invite.id)} size="small">
          Accept
        </Button>
      </div>
    </div>
  ));
};
