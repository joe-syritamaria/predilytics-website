import { redirect } from "next/navigation";

import DemoClient from "./DemoClient";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DEMO_MODE } from "@/lib/demo";

export const dynamic = "force-dynamic";

export default async function DemoPage() {
  // 🔓 DEMO MODE: allow public access
  if (!DEMO_MODE) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      redirect("/login");
    }
  }

  return <DemoClient />;
}
