import { createBrowserClient } from "@supabase/ssr";
import type { FC, ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

import { SUPABASE_ANON_KEY, SUPABASE_URL } from "../lib/constants";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- not needed
export const createClient = () => createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);

type Session = { token: string; user: { email: string } };

type AuthContextType = Session | null;
const AuthContext = createContext<AuthContextType>(null);

type Props = {
  children?: ReactNode;
};
export const AuthProvider: FC<Props> = ({ children }) => {
  const supabase = createClient();
  const [value, setValue] = useState<AuthContextType>(null);
  useEffect(() => {
    void supabase.auth.getSession().then((res) => {
      if (!res.data.session) return setValue(null);
      setValue({
        token: res.data.session.access_token,
        user: {
          email: res.data.session.user.email ?? "",
        },
      });
    });
  }, [supabase.auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => useContext(AuthContext);
