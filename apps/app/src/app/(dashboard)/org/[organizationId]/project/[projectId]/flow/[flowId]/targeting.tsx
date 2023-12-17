import { css } from "@flows/styled-system/css";
import { Flex, Wrap } from "@flows/styled-system/jsx";
import type { FlowDetail } from "lib/api";
import { parseIsoDate } from "lib/date";
import type { FC, ReactNode } from "react";
import { Fragment } from "react";
import { t } from "translations";
import { Text } from "ui";

import type { MatchGroup } from "./settings/flow-edit-types";
import type { MatcherKey } from "./settings/targeting/property-matcher";

type Props = {
  flow: FlowDetail;
};

const ValueText: FC<{ children?: ReactNode }> = ({ children }) => {
  const date = parseIsoDate(children);
  return <Text weight="600">{date ? date.toLocaleDateString() : children}</Text>;
};

export const Targeting: FC<Props> = ({ flow }) => {
  const properties = (flow.data as undefined | { userProperties?: MatchGroup[] })?.userProperties;
  return (
    <Flex direction="column" gap="space8">
      <Text variant="titleS">Targeting</Text>
      {properties ? (
        properties.map((group, groupIndex) => {
          return (
            <Fragment key={groupIndex}>
              {groupIndex !== 0 && <Text>or</Text>}

              <Wrap
                align="center"
                className={css({
                  padding: "space4",
                  bor: "1px",
                  borderRadius: "radius12",
                  backgroundColor: "bg.subtle",
                })}
                gap="space8"
              >
                {group.map((item, i) => {
                  const operatorKey = Object.keys(item).filter((key) => key !== "key")[0];
                  const value = item[operatorKey as MatcherKey];
                  return (
                    <Fragment key={i}>
                      {i !== 0 && <Text>and</Text>}
                      <Flex
                        className={css({
                          paddingY: "space4",
                          paddingX: "space8",
                          backgroundColor: "bg",
                          bor: "1px",
                          borderRadius: "radius8",
                        })}
                        gap="space8"
                      >
                        <Text weight="600">{item.key}</Text>
                        <Text color="muted">{t.targeting.operatorExplanation[operatorKey]}</Text>
                        {Array.isArray(value) ? (
                          value.map((v, j) => (
                            <Fragment key={j}>
                              {j !== 0 && <Text>or</Text>}
                              <ValueText>{v}</ValueText>
                            </Fragment>
                          ))
                        ) : (
                          <ValueText>{value}</ValueText>
                        )}
                      </Flex>
                    </Fragment>
                  );
                })}
              </Wrap>
            </Fragment>
          );
        })
      ) : (
        <Text color="muted">No targeting</Text>
      )}
    </Flex>
  );
};
