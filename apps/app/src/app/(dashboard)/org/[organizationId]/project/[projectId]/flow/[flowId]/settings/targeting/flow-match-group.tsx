import { css } from "@flows/styled-system/css";
import { Close16 } from "icons";
import type { FC } from "react";
import type { Control } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { t } from "translations";
import { Button, Icon, Text } from "ui";

import type { FlowEditFormData } from "../flow-edit-types";
import { PropertyMatcher } from "./property-matcher";

type Props = {
  control: Control<FlowEditFormData>;
  index: number;
  onRemove: () => void;
};

export const FlowMatchGroup: FC<Props> = ({ control, index, onRemove }) => {
  const { fields, append, remove } = useFieldArray({ control, name: `userProperties.${index}` });

  return (
    <div
      className={css({ display: "flex", flexDirection: "column", gap: "space8", mb: "space16" })}
    >
      <div className={css({ display: "flex", gap: "space8", alignItems: "center" })}>
        <Text variant="titleM">
          {t.targeting.group} {index + 1}
        </Text>
        <Button onClick={onRemove} size="small" variant="black">
          <Icon icon={Close16} />
        </Button>
      </div>
      {fields.map((f, matcherIndex) => (
        <PropertyMatcher
          control={control}
          groupIndex={index}
          key={f.id}
          matcherIndex={matcherIndex}
          onRemove={() => remove(matcherIndex)}
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
