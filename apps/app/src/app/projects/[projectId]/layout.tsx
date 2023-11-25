import { css } from "@flows/styled-system/css";
import { Header } from "components/header";
import type { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  params: { projectId: string };
};

export default function ProjectDetailLayout({ children, params }: Props): JSX.Element {
  return (
    <>
      <Header projectId={params.projectId} />
      <div className={css({ maxWidth: "1100px", mx: "auto", py: "space32", px: "space16" })}>
        {children}
      </div>
    </>
  );
}
