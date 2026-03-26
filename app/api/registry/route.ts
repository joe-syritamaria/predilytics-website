import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import crypto from "crypto";

const PUBLIC_ID_PREFIX = "MP";
const PUBLIC_ID_LENGTH = 8;
const PUBLIC_ID_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const getBaseUrl = async () => {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) {
    return configured.replace(/\/$/, "");
  }

  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const proto = headerStore.get("x-forwarded-proto") ?? "https";
  if (!host) {
    return "https://predilyticsinc.com";
  }

  return `${proto}://${host}`;
};

const generatePublicId = () => {
  const bytes = crypto.randomBytes(PUBLIC_ID_LENGTH);
  let value = "";

  for (let i = 0; i < PUBLIC_ID_LENGTH; i += 1) {
    const idx = bytes[i] % PUBLIC_ID_ALPHABET.length;
    value += PUBLIC_ID_ALPHABET[idx];
  }

  return `${PUBLIC_ID_PREFIX}-${value}`;
};

const safeText = (value: FormDataEntryValue | null) => {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
};

const safeNumber = (value: FormDataEntryValue | null) => {
  const text = safeText(value);
  if (!text) {
    return null;
  }
  const num = Number(text);
  return Number.isFinite(num) ? num : null;
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid payload." }, { status: 400 });
  }

  const moldIdentification = safeText(body.moldIdentification ?? null);
  const ownerCompany = safeText(body.ownerCompany ?? null);
  const country = safeText(body.country ?? null);
  const regionState = safeText(body.regionState ?? null);
  const yearsInExistence = safeNumber(body.yearsInExistence ?? null);
  const currentState = safeText(body.currentState ?? null);
  const ownershipType = safeText(body.ownershipType ?? null);
  const moldCostOriginal = safeNumber(body.moldCostOriginal ?? null);
  const moldCostRegistry = safeNumber(body.moldCostRegistry ?? null);
  const comments = safeText(body.description ?? null);
  const acceptTerms = body.acceptTerms === true || body.acceptTerms === "on";

  if (
    !moldIdentification ||
    !ownerCompany ||
    !country ||
    !regionState ||
    yearsInExistence === null ||
    !currentState ||
    !ownershipType ||
    moldCostOriginal === null ||
    moldCostRegistry === null ||
    !comments ||
    !acceptTerms
  ) {
    return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
  }

  let publicId = generatePublicId();
  let moldId: string | null = null;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { data, error } = await supabaseAdmin
      .from("mold_registry")
      .insert({
        public_id: publicId,
        country,
        region_state: regionState,
        years_in_existence: yearsInExistence,
        ownership_type: ownershipType,
        mold_cost_original: moldCostOriginal,
        mold_cost_registry: moldCostRegistry,
      })
      .select("id")
      .single();

    if (error && error.code === "23505") {
      publicId = generatePublicId();
      continue;
    }

    if (error || !data) {
      return NextResponse.json(
        { ok: false, error: "Failed to save registry entry." },
        { status: 500 }
      );
    }

    moldId = data.id as string;
    break;
  }

  if (!moldId) {
    return NextResponse.json(
      { ok: false, error: "Failed to generate a unique mold ID." },
      { status: 500 }
    );
  }

  const identifierInsert = await supabaseAdmin.from("mold_identifiers").insert({
    mold_id: moldId,
    owner_company: ownerCompany,
    owner_mold_id: moldIdentification,
    active: true,
  });

  if (identifierInsert.error) {
    return NextResponse.json(
      { ok: false, error: "Failed to save mold identifier." },
      { status: 500 }
    );
  }

  const eventInsert = await supabaseAdmin.from("mold_registry_events").insert({
    mold_id: moldId,
    current_state: currentState,
    comments,
  });

  if (eventInsert.error) {
    return NextResponse.json(
      { ok: false, error: "Failed to save registry event." },
      { status: 500 }
    );
  }

  const baseUrl = await getBaseUrl();
  const publicUrl = `${baseUrl}/moldpredict/registry/${publicId}`;

  return NextResponse.json({
    ok: true,
    publicId,
    publicUrl,
  });
}
