import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables."
  );
}

type SupabaseServerClientOptions = {
  allowSetCookie?: boolean;
};

export const createSupabaseServerClient = async (
  options: SupabaseServerClientOptions = {}
) => {
  const cookieStore = await cookies();
  const allowSetCookie = options.allowSetCookie ?? false;
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get: (name) => cookieStore.get(name)?.value,
      set: (name, value, options) => {
        if (!allowSetCookie) {
          return;
        }
        cookieStore.set({ name, value, ...options });
      },
      remove: (name, options) => {
        if (!allowSetCookie) {
          return;
        }
        cookieStore.set({ name, value: "", ...options });
      },
    },
  });
};
