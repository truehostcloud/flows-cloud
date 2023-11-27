"use client";

import { Text } from "ui";

type Props = {
  error: Error;
};

export default function Error({ error }: Props): JSX.Element {
  return <Text>{error.message}</Text>;
}
