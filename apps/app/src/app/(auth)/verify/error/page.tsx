"use client";

import { css } from "@flows/styled-system/css";
import { Box } from "@flows/styled-system/jsx";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { routes } from "routes";
import { Text } from "ui";

// TODO: @opesicka: Make this nicer
// Try it out by visiting http://localhost:6001/verify/error?message=Email%20link%20is%20invalid%20or%20has%20expired
export default function VerifyErrorPage(): JSX.Element {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <Box borderRadius="radius12" cardWrap="-" padding="space24">
      <Text
        align="center"
        className={css({
          mb: "space24",
        })}
        variant="titleXl"
      >
        Verification failed
      </Text>

      <Text className={css({ mb: "space24" })}>{message}</Text>

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
