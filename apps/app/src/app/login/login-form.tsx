"use client";

import { css } from "@flows/styled-system/css";
import { createClient } from "auth/client";
import { signIn, signUp } from "auth/server-actions";
import { useSearchParams } from "next/navigation";
import type { FC } from "react";
import { useTransition } from "react";
import { Button, Input, Text } from "ui";

export const LoginForm: FC = () => {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

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

  const handleSocialSignIn = async (provider: "google" | "github"): Promise<void> => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.origin}/auth/callback`,
      },
    });
  };

  const error = searchParams.get("error");
  const message = searchParams.get("message");

  return (
    <form
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "space16",
      })}
      onSubmit={handleSubmit}
    >
      <Input label="Email" name="email" required type="email" />
      <Input label="Password" minLength={8} name="password" required type="password" />
      {error ? <Text>{error}</Text> : null}
      {message ? <Text>{message}</Text> : null}

      <div className={css({ display: "flex", flexDir: "column", gap: "space12" })}>
        <div className={css({ display: "flex", gap: "space12" })}>
          <Button loading={isPending} name="sign-in" type="submit">
            Sign In
          </Button>
          <Button loading={isPending} name="sign-up" type="submit" variant="black">
            Sign Up
          </Button>
        </div>
        <div className={css({ display: "flex", gap: "space12" })}>
          <Button
            loading={isPending}
            name="sign-up-github"
            onClick={() => handleSocialSignIn("github")}
            type="button"
            variant="black"
          >
            😺 GitHub
          </Button>
          <Button
            loading={isPending}
            name="sign-up-google"
            onClick={() => handleSocialSignIn("google")}
            type="button"
            variant="black"
          >
            🔎 Google
          </Button>
        </div>
      </div>
    </form>
  );
};
