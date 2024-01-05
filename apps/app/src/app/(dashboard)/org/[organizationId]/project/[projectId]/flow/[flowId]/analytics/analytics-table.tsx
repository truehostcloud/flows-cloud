import { css } from "@flows/styled-system/css";
import { Box, Flex, Grid } from "@flows/styled-system/jsx";
import { monthDay } from "lib/date";
import type { FC } from "react";
import { Text } from "ui";

import type { EventCategory } from "./page";

type Props = {
  categories: EventCategory[];
};

const titleColumnWidth = 120;
const columnWidth = 88;
const boxCss = css({
  paddingY: "space8",
  paddingX: "space12",
});

export const AnalyticsTable: FC<Props> = ({ categories }) => {
  return (
    <Grid
      borderBottomLeftRadius="0!"
      borderBottomRightRadius="0!"
      cardWrap=""
      gap={0}
      gridTemplateColumns="120px 1fr"
      overflow="auto"
    >
      <Flex backgroundColor="bg.muted" borRight="1px" direction="column" left={0} position="sticky">
        <Box borBottom="1px" className={boxCss} minWidth={titleColumnWidth}>
          <Text color="muted" variant="bodyXs" weight="600">
            Event
          </Text>
        </Box>
        {categories.map((cat) => {
          return (
            <Flex borBottom="1px" borderColor="border.subtle!" key={cat.key}>
              <Box className={boxCss} minWidth={titleColumnWidth}>
                {/* TODO: add checkbox here - it's color should be the same as the category color in the line chart */}
                <Text>{cat.title}</Text>
              </Box>
            </Flex>
          );
        })}
      </Flex>
      <Flex direction="column">
        <Flex borBottom="1px">
          {categories[0].data.map((stat) => {
            return (
              <Box className={boxCss} key={stat.date} minWidth={columnWidth}>
                <Text align="right" color="muted" variant="bodyXs" weight="600">
                  {monthDay(stat.date)}
                </Text>
              </Box>
            );
          })}
        </Flex>
        {categories.map((cat) => {
          return (
            <Flex borBottom="1px" borderColor="border.subtle!" key={cat.key}>
              {cat.data.map((stat) => {
                if (stat.type === "finishRate") {
                  return (
                    <Box className={boxCss} key={stat.date} minWidth={columnWidth}>
                      <Text align="right">{(stat.count * 100).toFixed(2)}%</Text>
                    </Box>
                  );
                }
                return (
                  <Box className={boxCss} key={stat.date} minWidth={columnWidth}>
                    <Text align="right">{stat.count}</Text>
                  </Box>
                );
              })}
            </Flex>
          );
        })}
      </Flex>
    </Grid>
  );
};
