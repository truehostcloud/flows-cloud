"use client";
import { AuthProvider } from "auth/client";
import { type FC, type ReactNode } from "react";

type Props = {
  children?: ReactNode;
};
export const Providers: FC<Props> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};
