import { css } from "@flows/styled-system/css";
import { Close16 } from "icons";
import { type FC, useState } from "react";
import type { Control } from "react-hook-form";
import { useController } from "react-hook-form";
import { Button, Icon, Input, Select } from "ui";

import type { FlowEditFormData } from "../flow-edit-types";
import { CompareValueInput } from "./compare-value-input";
import { PrimitiveValueInput } from "./primitive-value-input";
import { StringValueInput } from "./string-value-input";

type Props = {
  control: Control<FlowEditFormData>;
  groupIndex: number;
  matcherIndex: number;
  onRemove: () => void;
};

const matcherOptions = [
  { label: "Equals", value: "eq" },
  { label: "Not equals", value: "ne" },
  { label: "Grater than", value: "gt" },
  { label: "Grater than or equals", value: "gte" },
  { label: "Less than", value: "lt" },
  { label: "Less than or equals", value: "lte" },
  { label: "Contains", value: "contains" },
  { label: "Does not contain", value: "notContains" },
  { label: "Regular expression", value: "regex" },
] as const;

export type MatcherKey = (typeof matcherOptions)[number]["value"];

const isPrimitiveKey = (key: MatcherKey): key is "eq" | "ne" => ["eq", "ne"].includes(key);
const isCompareKey = (key: MatcherKey): key is "gt" | "gte" | "lt" | "lte" =>
  ["gt", "gte", "lt", "lte"].includes(key);
const isStringArrayKey = (key: MatcherKey): key is "contains" | "notContains" =>
  ["contains", "notContains"].includes(key);

export const PropertyMatcher: FC<Props> = ({ groupIndex, matcherIndex, control, onRemove }) => {
  const { field } = useController({
    control,
    name: `userProperties.${groupIndex}.${matcherIndex}`,
  });

  const defaultVariant =
    matcherOptions.find(
      (opt) => opt.value === Object.keys(field.value).filter((key) => key !== "key")[0],
    )?.value ?? matcherOptions[0].value;

  const [variant, setVariant] = useState<MatcherKey>(defaultVariant);

  return (
    <div className={css({ display: "flex", gap: "space8", alignItems: "flex-end" })}>
      <Button onClick={onRemove} variant="black">
        <Icon icon={Close16} />
      </Button>
      <Input
        onChange={(e) => field.onChange({ ...field.value, key: e.target.value })}
        placeholder="Property"
        value={field.value.key}
      />

      <Select<MatcherKey>
        buttonClassName={css({ minWidth: "200px" })}
        buttonSize="default"
        onChange={setVariant}
        options={matcherOptions}
        value={variant}
      />

      <div className={css({ display: "flex", alignItems: "center", gap: "space8" })}>
        {isPrimitiveKey(variant) && (
          <PrimitiveValueInput
            onChange={(v) => field.onChange({ key: field.value.key, [variant]: v })}
            value={field.value[variant]}
          />
        )}
        {isCompareKey(variant) && (
          <CompareValueInput
            onChange={(v) => field.onChange({ key: field.value.key, [variant]: v })}
            value={field.value[variant]}
          />
        )}
        {isStringArrayKey(variant) && (
          <StringValueInput
            allowArray
            onChange={(v) => field.onChange({ key: field.value.key, [variant]: v })}
            value={field.value[variant]}
          />
        )}
        {variant === "regex" && (
          <StringValueInput
            onChange={(v) => field.onChange({ key: field.value.key, [variant]: v })}
            value={field.value[variant]}
          />
        )}
      </div>
    </div>
  );
};
