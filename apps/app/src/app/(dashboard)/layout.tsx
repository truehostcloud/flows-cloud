import { css } from "@flows/styled-system/css";
import { Flex } from "@flows/styled-system/jsx";
import { Sidebar } from "components/header";
import type { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }: Props): JSX.Element {
  return (
    <Flex backgroundColor="bg" height="100%" minHeight="100%">
      <Sidebar />
      <div
        className={css({
          width: "100%",
          maxWidth: "1100px",
          mx: "auto",
          py: "space24",
          px: "space32",
          height: "100%",
        })}
      >
        {children}
      </div>
    </Flex>
  );
}
