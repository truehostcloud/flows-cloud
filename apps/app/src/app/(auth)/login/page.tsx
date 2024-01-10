import { css } from "@flows/styled-system/css";
import type { Metadata } from "next";
import Image from "next/image";
import { Text } from "ui";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login | Flows",
};

export default function Login(): JSX.Element {
  return (
    <div
      className={css({
        maxWidth: "320px",
        mx: "auto",
        my: "space64",
      })}
    >
      <div
        className={css({
          display: "flex",
          justifyContent: "center",
          gap: "space8",
          alignItems: "center",
          mb: "space32",
        })}
      >
        <Image alt="Logo" height={28} priority src="/logo.svg" width={28} />
        <Text variant="titleL">Flows</Text>
      </div>
      <LoginForm />
    </div>
  );
}
