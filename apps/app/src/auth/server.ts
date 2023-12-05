import { type CookieOptions, createServerClient } from "@supabase/ssr";
import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { routes } from "routes";

import { SUPABASE_ANON_KEY, SUPABASE_URL } from "../lib/constants";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- not needed
export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options } as RequestCookie);
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options } as RequestCookie);
        } catch (error) {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- not needed
export const getAuth = async () => {
  const supabase = createClient(cookies());
  const { data } = await supabase.auth.getSession();
  return data.session;
};

export const signOut = async (): Promise<void> => {
  "use server";

  const supabase = createClient(cookies());
  await supabase.auth.signOut();
  return redirect(routes.login());
};

export const signIn = async (formData: FormData): Promise<void> => {
  "use server";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient(cookies());

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect(routes.login({ message: "Could not authenticate user" }));
  }

  return redirect(routes.home);
};

export const signUp = async (formData: FormData): Promise<void> => {
  "use server";

  const origin = headers().get("x-forwarded-host");
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient(cookies());

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}${routes.authCallback}`,
    },
  });

  if (error) {
    return redirect(routes.login({ message: "Could not authenticate user" }));
  }

  return redirect(routes.login({ message: "Check email to continue sign in process" }));
};
