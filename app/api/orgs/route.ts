import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getEnterpriseSupabase } from "@/lib/supabase/enterprise";

type CreateOrgPayload = {
  name?: string;
};

export async function POST(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: CreateOrgPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const name = body.name?.trim();
  if (!name) {
    return NextResponse.json({ error: "Missing org name." }, { status: 400 });
  }

  const supabase = getEnterpriseSupabase();

  const { data: org, error: orgError } = await supabase
    .from("orgs")
    .insert({ name })
    .select("id, name, created_at")
    .single();

  if (orgError || !org) {
    return NextResponse.json({ error: orgError?.message ?? "Org insert failed." }, { status: 500 });
  }

  const { error: memberError } = await supabase.from("org_members").insert({
    org_id: org.id,
    user_id: userId,
    role: "owner",
  });

  if (memberError) {
    await supabase.from("orgs").delete().eq("id", org.id);
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  return NextResponse.json({ org }, { status: 201 });
}
