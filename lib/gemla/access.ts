import { getEnterpriseSupabase } from "@/lib/supabase/enterprise";
import { GEMLA_PRODUCT_ID } from "./products";

export async function getGemlaEntitlement(userId: string) {
  const supabase = getEnterpriseSupabase();

  const { data, error } = await supabase
    .from("gemla_entitlements")
    .select("id, status, product_id, granted_at, revoked_at")
    .eq("user_id", userId)
    .eq("product_id", GEMLA_PRODUCT_ID)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function userHasGemlaAccess(userId: string) {
  const entitlement = await getGemlaEntitlement(userId);
  return entitlement?.status === "active";
}