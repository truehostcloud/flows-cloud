import { css } from "@flows/styled-system/css";
import { Box, Flex, Wrap } from "@flows/styled-system/jsx";
import type { FlowDetail } from "lib/api";
import type { FC } from "react";
import { t } from "translations";
import { Text } from "ui";

type Props = {
  flow: FlowDetail;
};

export const AnalyticsPreview: FC<Props> = ({ flow }) => {
  const starts = flow.preview_stats.find((s) => s.type === "startFlow")?.count ?? 0;
  const finishes = flow.preview_stats.find((s) => s.type === "finishFlow")?.count ?? 0;

  const items = [
    {
      title: t.analytics.starts,
      value: starts,
    },
    {
      title: t.analytics.finishes,
      value: finishes,
    },
    {
      title: t.analytics.finishRate,
      value: `${Math.round((finishes / starts) * 100)}%`,
    },
    {
      title: t.analytics.exits,
      value: flow.preview_stats.find((s) => s.type === "cancelFlow")?.count ?? 0,
    },
    {
      title: t.analytics.users,
      value: flow.preview_stats.find((s) => s.type === "uniqueUsers")?.count ?? 0,
    },
  ];

  return (
    <Box cardWrap="" padding="space16" width="100%">
      <Text className={css({ mb: "space12" })} variant="titleL">
        30 day stats
      </Text>
      <Wrap gap="space32">
        {items.map((item) => (
          <Flex flexDirection="column" gap="space4" key={item.title}>
            <Text>{item.title}</Text>
            <Text variant="titleM">{item.value}</Text>
          </Flex>
        ))}
      </Wrap>
    </Box>
  );
};
