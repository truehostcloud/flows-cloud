import { css } from "@flows/styled-system/css";
import { Flex } from "@flows/styled-system/jsx";
import { Plus16 } from "icons";
import type { FC } from "react";
import { Fragment } from "react";
import type { Control, UseFormSetValue } from "react-hook-form";
import { t } from "translations";
import { Button, Text } from "ui";

import type { FlowEditFormData, MatchGroup } from "../flow-edit-types";
import { FlowMatchGroup } from ".";

type Props = {
  userProperties: MatchGroup[];
  control: Control<FlowEditFormData>;
  setValue: UseFormSetValue<FlowEditFormData>;
  isCloud: boolean;
};

export const TargetingSection: FC<Props> = ({ userProperties, control, isCloud, setValue }) => {
  const handleRemoveGroup = (index: number): void => {
    const updated = [...userProperties];
    updated.splice(index, 1);
    setValue("userProperties", updated);
  };

  return (
    <Flex cardWrap="" flexDirection="column" mb="space16">
      <Flex flexDirection="column" padding="space16">
        <Text variant="titleL">{t.targeting.targeting}</Text>
        <Text color="muted">{t.targeting.description}</Text>
      </Flex>
      {isCloud ? (
        <>
          <div
            className={css({
              borTop: "1px",
            })}
          >
            {userProperties.map((_, i) => (
              <Fragment
                // eslint-disable-next-line react/no-array-index-key -- index is fine here
                key={i}
              >
                {i !== 0 && (
                  <Flex justifyContent="center" width="100%">
                    <Text
                      as="span"
                      className={css({
                        paddingX: "space8",
                        backgroundColor: "bg.strong",
                        borderRadius: "radius8",
                        mt: "-space12",
                        mb: "-space12",
                      })}
                      variant="bodyS"
                    >
                      or
                    </Text>
                  </Flex>
                )}
                <FlowMatchGroup control={control} index={i} onRemove={() => handleRemoveGroup(i)} />
              </Fragment>
            ))}
          </div>
          <div
            className={css({
              padding: "space16",
            })}
          >
            <Button
              onClick={() => setValue("userProperties", [...userProperties, []])}
              size="small"
              startIcon={<Plus16 />}
              variant="secondary"
            >
              {t.targeting.addGroup}
            </Button>
          </div>
        </>
      ) : (
        <Flex justifyContent="center" padding="space40">
          <Text color="muted">{t.targeting.localState}</Text>
        </Flex>
      )}
    </Flex>
  );
};
