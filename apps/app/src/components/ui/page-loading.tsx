import { css } from "@flows/styled-system/css";
import type { FC } from "react";
import { Text } from "ui";

export const PageLoading: FC = () => (
  <Text align="center" className={css({ py: "space32" })}>
    Loading..
  </Text>
);
