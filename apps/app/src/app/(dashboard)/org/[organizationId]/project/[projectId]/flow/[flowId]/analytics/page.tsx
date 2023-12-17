import { css } from "@flows/styled-system/css";
import { Flex } from "@flows/styled-system/jsx";
import { api } from "lib/api";
import { load } from "lib/load";
import { Text } from "ui";

type Props = {
  params: { flowId: string; projectId: string; organizationId: string };
};

export default async function FlowAnalyticsPage({ params }: Props): Promise<JSX.Element> {
  const data = await load(api["/flows/:flowId"](params.flowId));

  return (
    <div>
      <Text className={css({ mb: "space8" })} variant="titleL">
        Daily stats
      </Text>
      {data.daily_stats.length === 0 && <Text>No stats yet</Text>}
      {data.daily_stats.map((stat) => {
        const date = new Date(stat.date).toLocaleDateString();
        return (
          <Flex gap="space8" key={date + stat.type}>
            <Text className={css({ width: "100px" })} color="muted" variant="bodyS">
              {date}
            </Text>
            <Text className={css({ width: "100px" })} variant="bodyS">
              {stat.type}
            </Text>
            <Text align="right" className={css({ width: "64px" })} variant="bodyS">
              {stat.count}
            </Text>
          </Flex>
        );
      })}
    </div>
  );
}
