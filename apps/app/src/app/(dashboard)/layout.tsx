import { css } from "@flows/styled-system/css";
import { Header } from "components/header";
import type { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export default function DashboardLayout({ children }: Props): JSX.Element {
  return (
    <>
      <Header />
      <div className={css({ maxWidth: "1100px", mx: "auto", py: "space32", px: "space16" })}>
        {children}
      </div>
    </>
  );
}
