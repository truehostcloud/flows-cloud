import { css } from "@flows/styled-system/css";
import { Slot } from "@radix-ui/react-slot";
import type { FC, ReactNode } from "react";

type Props = {
  children?: ReactNode;
  className?: string;
  asChild?: boolean;
  as?: keyof JSX.IntrinsicElements;
};

export const MenuItem: FC<Props> = ({ children, asChild, as }) => {
  const Component = asChild ? Slot : as ?? "div";

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
