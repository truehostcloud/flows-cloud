import type { ReactNode } from "react";

import { ProjectTabs } from "./project-tabs";

type Props = {
  children?: ReactNode;
};

export default function ProjectDetailLayout({ children }: Props): JSX.Element {
  return (
    <>
      <ProjectTabs />
      {children}
    </>
  );
}
