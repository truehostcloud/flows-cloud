import { defineUtility } from "@pandacss/dev";

export const bor = defineUtility({
  values: ["1px"],
  transform(value, { token }) {
    return {
      borderStyle: "solid",
      borderWidth: value,
      borderColor: token("colors.border"),
    };
  },
});

export const borBottom = defineUtility({
  values: ["1px"],
  transform(value, { token }) {
    return {
      borderBottomStyle: "solid",
      borderBottomWidth: value,
      borderBottomColor: token("colors.border"),
    };
  },
});

export const borTop = defineUtility({
  values: ["1px"],
  transform(value, { token }) {
    return {
      borderTopStyle: "solid",
      borderTopWidth: value,
      borderTopColor: token("colors.border"),
    };
  },
});

export const cardWrap = defineUtility({
  transform(_, { token }) {
    return {
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: token("colors.border"),
      borderRadius: token("radii.radius12"),
      backgroundColor: token("colors.bg.card"),
      boxShadow: token("shadows.l1"),
    };
  },
});
