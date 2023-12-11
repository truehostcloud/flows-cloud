import { css } from "@flows/styled-system/css";
import { api } from "lib/api";
import { load } from "lib/load";
import { Text } from "ui";

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
      <Text className={css({ mb: "space24" })} variant="titleXl">
        {org.name} - Settings
      </Text>

      <Text className={css({ mb: "space12" })} variant="titleL">
        Members
      </Text>
      <div
        className={css({ display: "flex", gap: "space8", flexDirection: "column", mb: "space16" })}
      >
        {members.map((member) => (
          <div
            className={css({ display: "flex", alignItems: "center", gap: "space16" })}
            key={member.id}
          >
            <Text key={member.id}>{member.email}</Text>
            <MemberRemoveDialog organization={org} user={member} />
          </div>
        ))}
      </div>

      <InviteDialog organizationId={params.organizationId} />
    </>
  );
}
