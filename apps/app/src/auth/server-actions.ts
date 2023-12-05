"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { routes } from "routes";

import { createClient } from "./server";

export const signOut = async (): Promise<void> => {
  const supabase = createClient(cookies());
  await supabase.auth.signOut();
  return redirect(routes.login());
};

export const signIn = async (formData: FormData): Promise<void> => {
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
