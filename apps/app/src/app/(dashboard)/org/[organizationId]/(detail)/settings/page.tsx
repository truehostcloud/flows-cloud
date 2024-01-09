import { Flex } from "@flows/styled-system/jsx";
import { Person24 } from "icons";
import { api } from "lib/api";
import { load } from "lib/load";
import { plural, t } from "translations";
import { Icon, Text } from "ui";

import { OrganizationDeleteDialog } from "../../organization-delete-dialog";
import { InviteDialog } from "./invite-dialog";
import { MemberRemoveDialog } from "./member-remove-dialog";

type Props = {
  params: {
    organizationId: string;
  };
};

export default async function OrganizationSettingsPage({ params }: Props): Promise<JSX.Element> {
  const [org, members] = await Promise.all([
    load(api["/organizations/:organizationId"](params.organizationId)),
    load(api["/organizations/:organizationId/users"](params.organizationId)),
  ]);

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between" mb="space16">
        <Text variant="titleXl">{org.name}</Text>
        <OrganizationDeleteDialog organization={org} />
      </Flex>

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
        <InviteDialog organizationId={params.organizationId} />
      </Flex>
    </>
  );
}
