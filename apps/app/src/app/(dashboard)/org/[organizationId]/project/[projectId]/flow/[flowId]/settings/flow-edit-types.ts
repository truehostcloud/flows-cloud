import type { Flow } from "@rbnd/flows";
import type { UpdateFlow } from "lib/api";

export type MatchGroup = NonNullable<FlatArray<Flow["userProperties"], 1>>[];

export type FlowEditFormData = {
  name: string;
  description: string;
  human_id: string;
  human_id_alias: string;
  published: boolean;
  frequency?: UpdateFlow["frequency"];
  userProperties: MatchGroup[];
};

export const primitiveValueOptions = [
  { label: "String", value: "string" },
  { label: "Number", value: "number" },
  { label: "Boolean", value: "boolean" },
  { label: "Null", value: "null" },
  { label: "Undefined", value: "undefined" },
] as const;
export type PrimitiveValue = string | number | boolean | null | undefined;
export type PrimitiveValueKey = (typeof primitiveValueOptions)[number]["value"];

export const compareValueOptions = [
  { label: "Number", value: "number" },
  { label: "Date", value: "date" },
  { label: "String", value: "string" },
] as const;
export type CompareValue = number | Date | string;
export type CompareValueKey = (typeof compareValueOptions)[number]["value"];
