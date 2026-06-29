import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import GemlaCheckoutClient from "./GemlaCheckoutClient";

export const dynamic = "force-dynamic";

export default async function GemlaCheckoutPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect_url=/gemla-zeta/checkout");
  }

  return <GemlaCheckoutClient />;
}