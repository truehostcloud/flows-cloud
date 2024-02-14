import { cookies } from "next/headers";
import { createClient } from "supabase/server";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- not needed
export const getAuth = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase.auth.getSession();
  return data.session;
};
