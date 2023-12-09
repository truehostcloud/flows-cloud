import { css } from "@flows/styled-system/css";
import type { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  type?: "button" | "submit" | "reset";
};

export const MenuItem: FC<Props> = ({ children, as }) => {
  const Component = as || "div";

  return (
    <Component
      className={css({
        display: "flex",
        alignItems: "center",
        gap: "space8",
        py: "space8",
        px: "space8",
        borderRadius: "radius8",
        cursor: "pointer",
        width: "100%",
        transitionDuration: "fast",
        transitionTimingFunction: "easeInOut",
        transitionProperty: "all",
        "&:hover": {
          bg: "bg.hover",
        },
      })}
    >
      {children}
    </Component>
  );
};
