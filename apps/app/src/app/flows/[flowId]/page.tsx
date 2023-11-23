import { css } from "@flows/styled-system/css";
import { getAuth } from "auth/server";
import { api } from "lib/api";
import { redirect } from "next/navigation";
import { Text } from "ui";

export default async function FlowDetailPage({
  params,
}: {
  params: { flowId: string };
}): Promise<JSX.Element> {
  const auth = await getAuth();
  if (!auth) return redirect("/login");
  const data = await api["/flows/:flowId"](params.flowId)({ token: auth.access_token });

  return (
    <div>
      <Text className={css({ mb: "space16" })} variant="title3xl">
        {data.name}
      </Text>

      <Text variant="titleL">Daily stats</Text>
      {data.daily_stats.map((stat) => {
        const date = new Date(stat.date).toLocaleDateString();
        return (
          <div className={css({ display: "flex", gap: "space8" })} key={date + stat.type}>
            <Text className={css({ width: "100px" })} color="muted" variant="bodyS">
              {date}
            </Text>
            <Text className={css({ width: "100px" })} variant="bodyS">
              {stat.type}
            </Text>
            <Text align="right" className={css({ width: "64px" })} variant="bodyS">
              {stat.count}
            </Text>
          </div>
        );
      })}
    </div>
  );
}
