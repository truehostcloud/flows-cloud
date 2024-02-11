import type { FC, ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "supabase/client";

type Session = { token: string; user: { email: string; id?: string } };

type AuthContextType = Session | null;
const AuthContext = createContext<AuthContextType>(null);

type Props = {
  children?: ReactNode;
};
export const AuthProvider: FC<Props> = ({ children }) => {
  const supabase = createClient();
  const [value, setValue] = useState<AuthContextType>(null);

  useEffect(() => {
    const setSession = (
      session: { access_token: string; user: { email?: string; id?: string } } | null,
    ): void => {
      if (!session) return setValue(null);
      setValue({
        token: session.access_token,
        user: {
          email: session.user.email ?? "",
          id: session.user.id ?? "",
        },
      });
    };

    void supabase.auth.getSession().then((res) => {
      setSession({
        access_token: res.data.session?.access_token ?? "",
        user: {
          email: res.data.session?.user.email ?? "",
          id: res.data.session?.user.id ?? "",
        },
      });
    });

    supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });
  }, [supabase.auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => useContext(AuthContext);
