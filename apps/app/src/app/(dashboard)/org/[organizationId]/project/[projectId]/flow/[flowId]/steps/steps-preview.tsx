"use client";

import "@rbnd/flows/flows.css";

import { css } from "@flows/styled-system/css";
import type { FlowStep, FlowSteps } from "@rbnd/flows";
import { endFlow, init, nextStep, startFlow } from "@rbnd/flows";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { Text } from "ui";

import { StepTile } from "./step-tile";

type Props = {
  steps?: FlowSteps;
};

export const StepsPreview: FC<Props> = ({ steps }) => {
  const [stepIndex, setStepIndex] = useState<number | number[]>(0);

  useEffect(() => {
    if (!steps) return;
    init({
      flows: [
        {
          id: "flow",
          steps: prepareSteps(steps),
        },
      ],
      rootElement: "#preview-root",
    });
    startFlow("flow");

    if (!Array.isArray(stepIndex)) {
      for (let i = 0; i < stepIndex; i++) {
        nextStep("flow");
      }
    } else {
      for (let i = 0; i < stepIndex[0]; i++) {
        const isLast = i === stepIndex[0] - 1;
        nextStep("flow", isLast ? stepIndex[1] : undefined);
      }
      for (let i = 0; i < stepIndex[2]; i++) {
        nextStep("flow");
      }
    }

    return () => endFlow("flow");
  }, [stepIndex, steps]);

  return (
    <>
      <Text variant="titleL">Preview step</Text>

      <div className={css({ display: "flex", alignItems: "center", gap: "space8", mt: "space16" })}>
        {steps?.map((s, i) => (
          <StepTile
            activeIndex={stepIndex}
            index={i}
            // eslint-disable-next-line react/no-array-index-key -- there's no better key
            key={i}
            onClick={setStepIndex}
            step={s as FlowStep}
          />
        ))}
      </div>

      <div
        className={css({
          height: "300px",
          display: "grid",
          placeItems: "center",
          transform: "translate3d(0,0,0)",
          mt: "space16",
        })}
        id="preview-root"
      >
        <div
          className={css({
            height: "16px",
            width: "16px",
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: "border.strong",
            borderRadius: "radius100",
            backgroundColor: "bg.subtle",
          })}
          id="preview-target"
        />
      </div>
    </>
  );
};

const prepareSteps = (steps: FlowSteps): FlowSteps =>
  steps.map((s) => {
    if (Array.isArray(s)) return s.map((ss) => prepareSteps(ss) as FlowStep[]);

    return {
      ...s,
      element: "element" in s && s.element ? "#preview-target" : undefined,
    };
  });
