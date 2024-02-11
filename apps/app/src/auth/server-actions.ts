"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { routes } from "routes";
import { createClient } from "supabase/server";

export const signOut = async (): Promise<void> => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  await supabase.auth.signOut();
  return redirect(routes.login());
};

export const signIn = async (formData: FormData): Promise<{ error?: string }> => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Could not authenticate user" };
  }

  return redirect(routes.home);
};

export const signUp = async (formData: FormData): Promise<{ error?: string }> => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const origin = headers().get("x-forwarded-host");
  const protocol = headers().get("x-forwarded-proto");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${protocol}://${origin}${routes.authCallback}`,
    },
  });

  if (error) {
    return { error: "Could not create user" };
  }

  return redirect(routes.signupSuccess({ email }));
};
