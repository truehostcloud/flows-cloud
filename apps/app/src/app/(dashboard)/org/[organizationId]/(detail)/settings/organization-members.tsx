import { Flex } from "@flows/styled-system/jsx";
import { Person24 } from "icons";
import type { OrganizationDetail, OrganizationUser } from "lib/api";
import type { FC } from "react";
import { plural, t } from "translations";
import { Icon, Text } from "ui";

import { InviteDialog } from "./invite-dialog";
import { MemberRemoveDialog } from "./member-remove-dialog";

type Props = {
  org: OrganizationDetail;
  members: OrganizationUser[];
};

export const OrganizationMembers: FC<Props> = ({ members, org }) => {
  return (
    <Flex
      alignItems="flex-start"
      cardWrap="-"
      flexDirection="column"
      gap="space16"
      padding="space16"
    >
      <Flex flexDirection="column">
        <Text variant="titleL">{t.organization.members.title}</Text>
        <Text color="muted">
          {plural(
            members.length,
            t.organization.members.description,
            t.organization.members.description_plural,
          )}
        </Text>
      </Flex>
      <Flex flexDirection="column" gap="space12">
        {members.map((member) => (
          <Flex alignItems="center" gap="space8" key={member.id}>
            <Icon icon={Person24} />
            <Text key={member.id}>{member.email}</Text>
            <MemberRemoveDialog organization={org} user={member} />
          </Flex>
        ))}
      </Flex>
      <InviteDialog organizationId={org.id} />
    </Flex>
  );
};
