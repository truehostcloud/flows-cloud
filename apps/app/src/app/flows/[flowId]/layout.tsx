import { css } from "@flows/styled-system/css";

export default function FlowDetailLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return <div className={css({ maxWidth: "1100px", mx: "auto", py: "space32" })}>{children}</div>;
}
