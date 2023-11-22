import { createBrowserClient } from "@supabase/ssr";
import type { FC, ReactNode } from "react";
import { createContext, useEffect, useState } from "react";

import { SUPABASE_ANON_KEY, SUPABASE_URL } from "../lib/constants";
import type { Auth } from "./types";

const getAuth = async (): Promise<Auth | undefined> => {
  const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const result = await supabase.auth.getSession();
  if (!result.data.session) return;
  const session = result.data.session;
  return { token: session.access_token, user: { email: session.user.email ?? "" } };
};

const AuthContext = createContext<Auth | undefined>(undefined);

type Props = {
  children: ReactNode;
};
export const AuthProvider: FC<Props> = ({ children }) => {
  const [auth, setAuth] = useState<Auth>();
  useEffect(() => {
    void getAuth().then(setAuth);
  }, []);
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
