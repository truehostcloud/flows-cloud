import { css } from "@flows/styled-system/css";
import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type ReactNode } from "react";

type Props = {
  children?: ReactNode;
  className?: string;
  asChild?: boolean;
  as?: "button" | "div";
};

export const MenuItem = forwardRef<HTMLElement, Props>(function MenuItem(
  { children, asChild, as, ...props },
  ref,
) {
  const Component = asChild ? Slot : as ?? "div";

  return (
    <Component
      {...props}
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ignore
      ref={ref as any}
    >
      {children}
    </Component>
  );
});
