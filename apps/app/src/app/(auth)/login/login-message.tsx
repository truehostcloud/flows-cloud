import { useSearchParams } from "next/navigation";
import type { FC } from "react";
import { Text } from "ui";

export const LoginMessage: FC = () => {
  const searchParams = useSearchParams();

  const error = searchParams.get("error");
  const message = searchParams.get("message");

  return (
    <>
      {error ? <Text>{error}</Text> : null}
      {message ? <Text>{message}</Text> : null}
    </>
  );
};
