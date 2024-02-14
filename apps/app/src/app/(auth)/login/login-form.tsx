"use client";

import { css } from "@flows/styled-system/css";
import { Box, Flex } from "@flows/styled-system/jsx";
import { LoginMessage } from "app/(auth)/login/login-message";
import { signIn } from "auth/server-actions";
import { GitHub16, Google16 } from "icons";
import Link from "next/link";
import type { FC } from "react";
import { Suspense, useTransition } from "react";
import { routes } from "routes";
import { createClient } from "supabase/client";
import { Button, Input, Text, toast } from "ui";

//TODO: @pesickadavid add password reset page and uncomment the link
export const LoginForm: FC = () => {
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const res = await signIn(formData);
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
          mb: "space4",
        })}
        variant="titleXl"
      >
        Welcome back to Flows
      </Text>
      <Text
        align="center"
        className={css({
          mb: "space24",
        })}
        color="muted"
      >
        Don&apos;t have an account?{" "}
        <Link
          className={css({
            textDecoration: "underline",
            color: "text",
          })}
          href={routes.signUp()}
        >
          Sign up
        </Link>
      </Text>

      <form
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "space16",
        })}
        onSubmit={handleSubmit}
      >
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

        <Button loading={isPending} name="sign-in" size="medium" type="submit">
          Log in
        </Button>
        {/* <Text align="center" color="muted">
          <Link
            className={css({
              textDecoration: "underline",
              color: "text",
            })}
            href="/reset-password"
          >
            Forgot password?
          </Link>
        </Text> */}

        <hr
          className={css({
            borTop: "1px",
            my: "space8",
          })}
        />
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
            Login with GitHub
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
            Login with Google
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
