import { css } from "@flows/styled-system/css";
import { Text } from "ui";

export default function HomeLoading(): JSX.Element {
  return (
    <Text align="center" className={css({ py: "space32" })}>
      Loading..
    </Text>
  );
}
