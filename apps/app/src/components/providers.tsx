"use client";
import { DarkModeProvider } from "@rbnd/react-dark-mode";
import { AuthProvider } from "auth/client";
import { type FC, type ReactNode } from "react";

type Props = {
  children?: ReactNode;
};
export const Providers: FC<Props> = ({ children }) => {
  return (
    <DarkModeProvider>
      <AuthProvider>{children}</AuthProvider>
    </DarkModeProvider>
  );
};
