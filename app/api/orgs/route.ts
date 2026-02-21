import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getEnterpriseSupabase } from "@/lib/supabase/enterprise";

type CreateOrgPayload = {
  name?: string;
};

export async function POST(request: Request) {
  const { userId } = await auth();

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

  const client = await clerkClient();
  let clerkOrgId: string | null = null;

  try {
    const clerkOrg = await client.organizations.createOrganization({
      name,
      createdBy: userId,
    });
    clerkOrgId = clerkOrg.id;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create Clerk organization." },
      { status: 500 },
    );
  }

  const { data: org, error: orgError } = await supabase
    .from("orgs")
    .insert({ name, clerk_org_id: clerkOrgId })
    .select("id, name, created_at, clerk_org_id")
    .single();

  if (orgError || !org) {
    if (clerkOrgId) {
      await client.organizations.deleteOrganization(clerkOrgId).catch(() => null);
    }
    return NextResponse.json({ error: orgError?.message ?? "Org insert failed." }, { status: 500 });
  }

  const { error: memberError } = await supabase.from("org_members").insert({
    org_id: org.id,
    user_id: userId,
    role: "owner",
  });

  if (memberError) {
    await supabase.from("orgs").delete().eq("id", org.id);
    if (clerkOrgId) {
      await client.organizations.deleteOrganization(clerkOrgId).catch(() => null);
    }
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  return NextResponse.json({ org }, { status: 201 });
}
