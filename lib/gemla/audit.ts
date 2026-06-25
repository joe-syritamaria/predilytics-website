import { getEnterpriseSupabase } from "@/lib/supabase/enterprise";

export async function logGemlaEvent(params: {
  userId?: string | null;
  productId?: string | null;
  eventType: string;
  request?: Request;
  metadata?: Record<string, unknown>;
}) {
  const supabase = getEnterpriseSupabase();

  const headers = params.request?.headers;
  const ip =
    headers?.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers?.get("x-real-ip") ??
    null;

  const country =
    headers?.get("x-vercel-ip-country") ??
    headers?.get("cf-ipcountry") ??
    null;

  const userAgent = headers?.get("user-agent") ?? null;

  await supabase.from("gemla_audit_logs").insert({
    user_id: params.userId ?? null,
    product_id: params.productId ?? null,
    event_type: params.eventType,
    ip_country: country,
    ip_address: ip,
    user_agent: userAgent,
    metadata: params.metadata ?? {},
  });
}