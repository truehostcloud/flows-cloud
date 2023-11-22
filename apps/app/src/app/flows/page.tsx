import { Text } from "ui";

import { getAuth } from "../../auth/server";
import { API_URL } from "../../lib/constants";

export default async function FlowsPage(): Promise<JSX.Element> {
  const auth = await getAuth();
  const result = await fetch(`${API_URL}/projects/7e4fb6d2-14f8-40c5-bfe3-dd68e2a26d51/flows`, {
    headers: {
      authorization: `Bearer ${auth?.token}`,
    },
  }).then((res) => res.json());

  return (
    <div>
      <Text variant="title3xl">Flows</Text>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
