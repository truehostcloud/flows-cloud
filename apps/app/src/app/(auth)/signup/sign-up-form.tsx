"use client";

import { css } from "@flows/styled-system/css";
import { Box, Flex } from "@flows/styled-system/jsx";
import { LoginMessage } from "app/(auth)/login/login-message";
import { signUp } from "auth/server-actions";
import { GitHub16, Google16 } from "icons";
import Link from "next/link";
import type { FC } from "react";
import { Suspense, useTransition } from "react";
import { routes } from "routes";
import { createClient } from "supabase/client";
import { Button, Input, Text, toast } from "ui";

export const SignUpForm: FC = () => {
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const res = await signUp(formData);
      if (res.error) toast.error(res.error);
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

  return (
    <Box borderRadius="radius12" cardWrap="-" padding="space24">
      <Text
        align="center"
        className={css({
          mb: "space24",
        })}
        variant="titleXl"
      >
        Get started
      </Text>

      <form
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "space16",
        })}
        onSubmit={handleSubmit}
      >
        <Flex flexDir="column" gap="space12">
          <Button
            loading={isPending}
            name="sign-up-github"
            onClick={() => handleSocialSignIn("github")}
            size="medium"
            startIcon={<GitHub16 />}
            type="button"
            variant="secondary"
          >
            Sign up with GitHub
          </Button>
          <Button
            loading={isPending}
            name="sign-up-google"
            onClick={() => handleSocialSignIn("google")}
            size="medium"
            startIcon={<Google16 />}
            type="button"
            variant="secondary"
          >
            Sign up with Google
          </Button>
        </Flex>

        <Text
          align="center"
          className={css({
            my: "space8",
          })}
          color="muted"
        >
          Or use email & password
        </Text>
        <Input
          label="Email"
          name="email"
          placeholder="email@yourcompany.com"
          required
          type="email"
        />
        <Input
          label="Password"
          minLength={8}
          name="password"
          placeholder="••••••••••"
          required
          type="password"
        />
        <Suspense>
          <LoginMessage />
        </Suspense>

        <Button loading={isPending} name="sign-up" size="medium" type="submit">
          Sign up
        </Button>

        <Text align="center" color="muted">
          Already have an account?{" "}
          <Link
            className={css({
              textDecoration: "underline",
              color: "text",
            })}
            href={routes.login()}
          >
            Log in
          </Link>
        </Text>
      </form>
    </Box>
  );
};
