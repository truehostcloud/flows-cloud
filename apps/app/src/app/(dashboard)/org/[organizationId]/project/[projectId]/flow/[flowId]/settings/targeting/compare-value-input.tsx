import { css } from "@flows/styled-system/css";
import { type FC, useEffect, useState } from "react";
import { t } from "translations";
import { Input, Select } from "ui";

import { type CompareValue, type CompareValueKey, compareValueOptions } from "../flow-edit-types";

type Props<T extends CompareValue = CompareValue> = {
  value?: T;
  onChange: (value: T) => void;
};

export const CompareValueInput: FC<Props> = ({ onChange, value }) => {
  const [dataType, setDataType] = useState<CompareValueKey>(compareValueOptions[0].value);

  useEffect(() => {
    if (dataType === "number" && typeof value !== "number") onChange(0);
    if (dataType === "date" && typeof value !== "object") {
      const defaultDate = new Date();
      defaultDate.setHours(0, 0, 0, 0);
      onChange(defaultDate);
    }
    if (dataType === "string" && typeof value !== "string") onChange("");
  }, [dataType, onChange, value]);

  return (
    <>
      <Select
        buttonClassName={css({ minWidth: "124px" })}
        buttonSize="default"
        onChange={(v) => setDataType(v)}
        options={compareValueOptions}
        value={dataType}
      />

      {dataType === "number" && typeof value === "number" && (
        <Input onChange={(e) => onChange(Number(e.target.value))} type="number" value={value} />
      )}
      {dataType === "date" && typeof value === "object" && (
        // TODO: change date picker to UTC time zone
        <Input
          onChange={(e) => onChange(new Date(e.target.value || new Date()))}
          type="datetime-local"
          value={value
            .toLocaleString("sv-SE", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
            .replace(" ", "T")}
        />
      )}
      {dataType === "string" && typeof value === "string" && (
        <Input
          onChange={(e) => onChange(e.target.value)}
          placeholder={t.targeting.value}
          value={value}
        />
      )}
    </>
  );
};
