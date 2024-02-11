"use client";

import { css } from "@flows/styled-system/css";
import { Box } from "@flows/styled-system/jsx";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { routes } from "routes";
import { Text } from "ui";

// TODO: @opesicka: Make this nicer
// Try it out by visiting http://localhost:6001/signup/success?email=example%40example.com
export default function SignupSuccessPage(): JSX.Element {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <Box borderRadius="radius12" cardWrap="-" padding="space24">
      <Text
        align="center"
        className={css({
          mb: "space24",
        })}
        variant="titleXl"
      >
        Check your email
      </Text>

      <Text className={css({ mb: "space24" })}>
        Verification email was sent to{" "}
        <Text as="span" weight="700">
          {email}
        </Text>
        , please check your inbox and verify your email address.
      </Text>

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
    </Box>
  );
}
