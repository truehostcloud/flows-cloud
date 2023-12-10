"use client";

import { signOut } from "auth/server-actions";
import type { FC } from "react";
import { useTransition } from "react";
import { t } from "translations";
import { Text } from "ui";

import { MenuItem } from "./menu-item";

export const LogoutButton: FC = () => {
  const [isPending, startTransition] = useTransition();
  const handleLogout = (): void =>
    startTransition(() => {
      void signOut();
    });

  return (
    <button disabled={isPending} onClick={handleLogout} type="submit">
      <MenuItem>
        <Text as="span" variant="bodyS">
          {t.actions.logout}
        </Text>
      </MenuItem>
    </button>
  );
};
