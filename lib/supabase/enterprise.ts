import { createClient } from "@supabase/supabase-js";

export function getEnterpriseSupabase() {
  const url = process.env.SUPABASE_ENTERPRISE_URL;
  const serviceRoleKey = process.env.SUPABASE_ENTERPRISE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing enterprise Supabase env vars.");
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
