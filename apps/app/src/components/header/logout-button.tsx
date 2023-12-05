"use client";

import { signOut } from "auth/server-actions";
import type { FC } from "react";
import { useTransition } from "react";
import { Button } from "ui";

export const LogoutButton: FC = () => {
  const [isPending, startTransition] = useTransition();
  const handleLogout = (): void =>
    startTransition(() => {
      void signOut();
    });

  return (
    <Button loading={isPending} onClick={handleLogout} size="small" type="submit" variant="black">
      Logout
    </Button>
  );
};
