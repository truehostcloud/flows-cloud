import { Box, Flex } from "@flows/styled-system/jsx";
import { api } from "lib/api";
import { load } from "lib/load";
import Link from "next/link";
import { routes } from "routes";
import { t } from "translations";
import { Button } from "ui";

import { AnalyticsChart } from "./analytics-chart";

type Props = {
  params: { flowId: string; projectId: string; organizationId: string };
  searchParams?: { category?: string };
};

export default async function FlowAnalyticsPage({
  params,
  searchParams,
}: Props): Promise<JSX.Element> {
  const analytics = await load(api["/flows/:flowId/analytics"](params.flowId));
  const categoryKey = searchParams?.category ?? "starts";

  const starts = analytics.daily_stats.filter((stat) => stat.type === "startFlow");
  const finishes = analytics.daily_stats.filter((stat) => stat.type === "finishFlow");

  const finishRate =
    starts.length === finishes.length
      ? finishes.map((stat, i) => {
          const startStat = starts[i];
          const count = stat.count / startStat.count;
          return {
            date: stat.date,
            count: isNaN(count) ? 0 : count,
          };
        })
      : [];

  const categories = [
    {
      key: "starts",
      title: t.analytics.starts,
      data: starts,
    },
    {
      key: "finishes",
      title: t.analytics.finishes,
      data: finishes,
    },
    {
      key: "finish-rate",
      title: t.analytics.finishRate,
      data: finishRate,
    },
    {
      key: "exits",
      title: t.analytics.exits,
      data: analytics.daily_stats.filter((stat) => stat.type === "cancelFlow"),
    },
  ] as const;

  const currentCategory = categories.find((cat) => cat.key === categoryKey);
  const chartData = (currentCategory?.data ?? []).map((bucket) => ({
    label: bucket.date.slice(0, 10),
    value: bucket.count,
  }));

  return (
    <>
      <Flex gap="space8">
        {categories.map((cat) => {
          return (
            <Button
              asChild
              key={cat.title}
              size="small"
              variant={categoryKey === cat.key ? "primary" : "secondary"}
            >
              <Link href={routes.flowAnalytics({ ...params, category: cat.key })}>{cat.title}</Link>
            </Button>
          );
        })}
      </Flex>

      <Box height={320}>
        {currentCategory ? (
          <AnalyticsChart categoryKey={currentCategory.key} data={chartData} />
        ) : null}
      </Box>
    </>
  );
}
