"use client";

import { css } from "@flows/styled-system/css";
import { signIn, signUp } from "auth/server-actions";
import { useTransition } from "react";
import { Button, Input } from "ui";

import Messages from "./messages";

export default function Login(): JSX.Element {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const action = (event.nativeEvent as { submitter?: { name: string } }).submitter?.name as
      | "sign-in"
      | "sign-up";
    const formData = new FormData(event.currentTarget);

    startTransition(() => {
      if (action === "sign-up") void signUp(formData);
      else void signIn(formData);
    });
  };

  return (
    <form
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "space16",
        maxWidth: "320px",
        mx: "auto",
        my: "space64",
      })}
      onSubmit={handleSubmit}
    >
      <Input
        inputClassName={css({ width: "100%" })}
        label="Email"
        name="email"
        placeholder="you@example.com"
        required
        type="email"
        wrapperClassName={css({ display: "block", mt: "space4" })}
      />
      <Input
        inputClassName={css({ width: "100%" })}
        label="Password"
        name="password"
        required
        type="password"
        wrapperClassName={css({ display: "block", mt: "space4" })}
      />
      <Messages />
      <div className={css({ display: "flex", gap: "space12" })}>
        <Button loading={isPending} name="sign-in" type="submit">
          Sign In
        </Button>
        <Button loading={isPending} name="sign-up" type="submit" variant="black">
          Sign Up
        </Button>
      </div>
    </form>
  );
}
