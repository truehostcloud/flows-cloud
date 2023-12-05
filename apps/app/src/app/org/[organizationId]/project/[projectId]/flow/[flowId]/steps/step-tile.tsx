/* eslint-disable react/no-array-index-key -- there's no better key */

import { css } from "@flows/styled-system/css";
import type { FlowStep } from "@rbnd/flows";
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

  return (
    <button
      className={css({
        width: "32px",
        height: "24px",
        backgroundColor: active ? "bg.primary" : "bg.muted",
        transitionProperty: "all",
        transitionDuration: "fast",
        transitionTimingFunction: "easeInOut",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: active ? "bg.primary" : "border",
        borderRadius: "radius4",
        cursor: "pointer",
        pointerEvents: active ? "none" : undefined,
        _hover: {
          backgroundColor: "bg.hover",
        },
      })}
      onClick={() => onClick(index)}
      type="button"
    />
  );
};
