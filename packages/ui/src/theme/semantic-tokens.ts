import { defineSemanticTokens } from "@pandacss/dev";

export const semanticTokens = defineSemanticTokens({
  colors: {
    bg: {
      DEFAULT: { value: { base: "{colors.neutral.0}", _dark: "{colors.neutral.900}" } },
      muted: { value: { base: "{colors.neutral.25}", _dark: "{colors.neutral.875}" } },
      subtle: { value: { base: "{colors.neutral.50}", _dark: "{colors.neutral.750}" } },
      primary: { value: { base: "{colors.primary.400}", _dark: "{colors.primary.400}" } },
      primaryHover: { value: { base: "{colors.primary.500}", _dark: "{colors.primary.500}" } },
      hover: { value: { base: "{colors.neutral.50}", _dark: "{colors.neutral.850}" } },
      card: { value: { base: "{colors.neutral.0}", _dark: "{colors.neutral.850}" } },
      black: { value: "{colors.neutral.850}" },
      blackHover: { value: "{colors.neutral.750}" },
    },
    text: {
      DEFAULT: { value: { base: "{colors.neutral.900}", _dark: "{colors.neutral.25}" } },
      muted: { value: { base: "{colors.neutral.650}", _dark: "{colors.neutral.300}" } },
      subtle: { value: { base: "{colors.neutral.500}", _dark: "{colors.neutral.400}" } },
      white: { value: "{colors.neutral.0}" },
      primary: { value: { base: "{colors.primary.500}", _dark: "{colors.primary.400}" } },
      onPrimary: { value: { base: "{colors.neutral.0}", _dark: "{colors.neutral.900}" } },
      disabled: { value: { base: "{colors.neutral.400}", _dark: "{colors.neutral.500}" } },
    },
    border: {
      DEFAULT: { value: { base: "{colors.neutral.50}", _dark: "{colors.neutral.750}" } },
      strong: { value: { base: "{colors.neutral.100}", _dark: "{colors.neutral.650}" } },
      primary: { value: { base: "{colors.primary.400}", _dark: "{colors.primary.400}" } },
    },
    icon: {
      DEFAULT: { value: { base: "{colors.neutral.650}", _dark: "{colors.neutral.300}" } },
      strong: { value: { base: "{colors.neutral.900}", _dark: "{colors.neutral.25}" } },
      primary: { value: { base: "{colors.primary.500}", _dark: "{colors.primary.400}" } },
    },
  },
  shadows: {
    l1: { value: { base: "{shadows.light1}", _dark: "{shadows.dark1}" } },
    l2: { value: { base: "{shadows.light2}", _dark: "{shadows.dark2}" } },
    l3: { value: { base: "{shadows.light3}", _dark: "{shadows.dark3}" } },
    l4: { value: { base: "{shadows.light4}", _dark: "{shadows.dark4}" } },
    l5: { value: { base: "{shadows.light5}", _dark: "{shadows.dark5}" } },
  },
});