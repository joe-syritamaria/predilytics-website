import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  let allCookies: string[] = [];

  if (typeof (cookieStore as { getAll?: () => { name: string }[] }).getAll === "function") {
    allCookies = cookieStore.getAll().map((c) => c.name);
  }

  const cookieNamesToCheck = [
    "__session",
    "__clerk_db_jwt",
    "__clerk_session",
    "__clerk",
    "clerk_session",
  ];

  const hasSessionCookie =
    allCookies.some((name) => name.startsWith("__session")) ||
    allCookies.some((name) => name.startsWith("__clerk")) ||
    allCookies.some((name) => name.startsWith("clerk")) ||
    cookieNamesToCheck.some((name) => Boolean(cookieStore.get?.(name)));

  return NextResponse.json({
    env: {
      nextPublicClerkKey: Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
      clerkSecretKey: Boolean(process.env.CLERK_SECRET_KEY),
    },
    cookies: {
      count: allCookies.length,
      hasSessionCookie,
      names: allCookies.slice(0, 10),
    },
  });
}
