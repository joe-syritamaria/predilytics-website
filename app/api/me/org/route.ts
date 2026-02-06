import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getEnterpriseSupabase } from "@/lib/supabase/enterprise";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getEnterpriseSupabase();

  const { data: member, error: memberError } = await supabase
    .from("org_members")
    .select("org_id, role")
    .eq("user_id", userId)
    .maybeSingle();

  if (memberError) {
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  if (!member) {
    return NextResponse.json({ org: null }, { status: 404 });
  }

  const { data: org, error: orgError } = await supabase
    .from("orgs")
    .select("id, name, created_at")
    .eq("id", member.org_id)
    .maybeSingle();

  if (orgError) {
    return NextResponse.json({ error: orgError.message }, { status: 500 });
  }

  return NextResponse.json({ org, role: member.role });
}
