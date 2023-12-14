import { css } from "@flows/styled-system/css";
import type { FC } from "react";
import type { Control } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { t } from "translations";
import { Button, Text } from "ui";

import type { FlowEditFormData } from "../flow-edit-types";
import { PropertyMatcher } from "./property-matcher";

type Props = {
  control: Control<FlowEditFormData>;
  index: number;
};

export const FlowMatchGroup: FC<Props> = ({ control, index }) => {
  const { fields, append } = useFieldArray({ control, name: `userProperties.${index}` });

  return (
    <div
      className={css({ display: "flex", flexDirection: "column", gap: "space8", mb: "space16" })}
    >
      <Text variant="titleM">
        {t.targeting.group} {index + 1}
      </Text>
      {fields.map((f, matcherIndex) => (
        <PropertyMatcher
          control={control}
          groupIndex={index}
          key={f.id}
          matcherIndex={matcherIndex}
        />
      ))}
      <div>
        <Button onClick={() => append({ key: "" })} size="small" variant="black">
          {t.targeting.addMatcher}
        </Button>
      </div>
    </div>
  );
};
