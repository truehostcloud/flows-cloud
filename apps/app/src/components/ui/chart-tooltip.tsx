import { useTooltipInPortal } from "@visx/tooltip";
import type { FC, ReactNode } from "react";

type Props = {
  tooltipOpen: boolean;
  tooltipLeft?: number;
  tooltipTop?: number;
  children: (props: {
    containerRef: (element: HTMLElement | SVGElement | null) => void;
  }) => ReactNode;
  content?: ReactNode;
  className?: string;
};

export const ChartTooltip: FC<Props> = ({
  tooltipOpen,
  tooltipLeft,
  tooltipTop,
  children,
  content,
  className,
}) => {
  const { containerRef, TooltipInPortal } = useTooltipInPortal({ scroll: true });

  return (
    <>
      {children({ containerRef })}
      {tooltipOpen && content ? (
        <TooltipInPortal
          applyPositionStyle
          className={className}
          left={tooltipLeft}
          top={tooltipTop}
          unstyled
        >
          {content}
        </TooltipInPortal>
      ) : null}
    </>
  );
};
