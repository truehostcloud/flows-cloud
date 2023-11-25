import { css } from "@flows/styled-system/css";
import { Header } from "components/header";
import type { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  params: { organizationId: string };
};

export default function DashboardLayout({ children, params }: Props): JSX.Element {
  return (
    <>
      <Header organizationId={params.organizationId} />
      <div className={css({ maxWidth: "1100px", mx: "auto", py: "space32", px: "space16" })}>
        {children}
      </div>
    </>
  );
}
