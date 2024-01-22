/* eslint-disable react/no-array-index-key -- there's no better key */

import type { FlowStep } from "@flows/js";
import { css } from "@flows/styled-system/css";
import type { FC } from "react";

type Props = {
  step: FlowStep | FlowStep[][];
  activeIndex?: number | number[];
  index: number;
  onClick: (index: number | number[]) => void;
};

export const StepTile: FC<Props> = ({ step, activeIndex, index, onClick }) => {
  if (Array.isArray(step)) {
    return (
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "space8",
        })}
      >
        {step.map((s, i) => (
          <div className={css({ display: "flex", gap: "space8" })} key={i}>
            {s.map((subS, j) => {
              const activeI = (() => {
                if (!Array.isArray(activeIndex)) return undefined;
                if (activeIndex[0] === index && activeIndex[1] === i) return activeIndex[2];
                return undefined;
              })();

              return (
                <StepTile
                  activeIndex={activeI}
                  index={j}
                  key={j}
                  onClick={(clickIndex) =>
                    onClick([index, i, ...(Array.isArray(clickIndex) ? clickIndex : [clickIndex])])
                  }
                  step={subS}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  const active = activeIndex === index;

  const title = "title" in step ? step.title : "Wait";

  return (
    <button
      className={css({
        width: "120px",
        height: "48px",
        backgroundColor: active ? "bg.subtle" : "bg",
        transitionProperty: "all",
        transitionDuration: "fast",
        transitionTimingFunction: "easeInOut",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: active ? "border.primary" : "border",
        borderRadius: "radius8",
        cursor: "pointer",
        pointerEvents: active ? "none" : undefined,
        textStyle: "bodyXs",
        paddingX: "space4",
        overflow: "hidden",

        _hover: {
          backgroundColor: "bg.hover",
        },
      })}
      onClick={() => onClick(index)}
      type="button"
    >
      {title}
    </button>
  );
};
