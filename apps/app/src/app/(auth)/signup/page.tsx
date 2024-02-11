import { css } from "@flows/styled-system/css";
import type { Metadata } from "next";
import Link from "next/link";
import { Text } from "ui";

import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Login | Flows",
};

export default function Signup(): JSX.Element {
  return (
    <>
      <SignupForm />
      <Text
        align="center"
        className={css({
          mt: "space24",
        })}
        color="muted"
        variant="bodyXs"
      >
        By creating an account, you agree to the{" "}
        <Link
          className={css({
            textDecoration: "underline",
            color: "text",
          })}
          href="TODO"
          target="_blank"
        >
          Terms of service
        </Link>{" "}
        and{" "}
        <Link
          className={css({
            textDecoration: "underline",
            color: "text",
          })}
          href="TODO"
          target="_blank"
        >
          Privacy policy
        </Link>
      </Text>
    </>
  );
}
