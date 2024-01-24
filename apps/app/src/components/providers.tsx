"use client";
import { DarkModeProvider } from "@rbnd/react-dark-mode";
import { type FC, type ReactNode } from "react";
import { Toaster } from "ui";

type Props = {
  children?: ReactNode;
};
export const Providers: FC<Props> = ({ children }) => {
  return (
    <DarkModeProvider>
      <Toaster />
      {children}
    </DarkModeProvider>
  );
};
