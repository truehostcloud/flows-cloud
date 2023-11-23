import { getAuth } from "auth/server";
import { redirect } from "next/navigation";
import { Text } from "ui";

import { api } from "../../../lib/api";

export default async function FlowsPage({
  params,
}: {
  params: { projectId: string };
}): Promise<JSX.Element> {
  const auth = await getAuth();
  if (!auth) return redirect("/login");
  const result = await api["/projects/:projectId/flows"](params.projectId)({
    token: auth.access_token,
  });

  return (
    <div>
      <Text variant="title3xl">Flows</Text>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
