"use client";

import { useSearchParams } from "next/navigation";
import { Text } from "ui";

export default function Messages(): JSX.Element {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const message = searchParams.get("message");
  return (
    <>
      {error ? <Text>{error}</Text> : null}
      {message ? <Text>{message}</Text> : null}
    </>
  );
}
