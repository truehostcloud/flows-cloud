"use client";
import { DarkModeProvider } from "@rbnd/react-dark-mode";
import { AuthProvider } from "auth/client";
import { type FC, type ReactNode } from "react";
import { ToastWarmer } from "ui";

type Props = {
  children?: ReactNode;
};
export const Providers: FC<Props> = ({ children }) => {
  return (
    <DarkModeProvider>
      <ToastWarmer />
      <AuthProvider>{children}</AuthProvider>
    </DarkModeProvider>
  );
};
