import { getAuth } from "auth/server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { routes } from "routes";

import { AuthWrapper } from "./auth-wrapper";

type Props = {
  children?: ReactNode;
};

export default async function AuthLayout({ children }: Props): Promise<JSX.Element> {
  const auth = await getAuth();
  if (auth) redirect(routes.home);

  return <AuthWrapper>{children}</AuthWrapper>;
}
