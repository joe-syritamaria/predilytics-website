import dynamic from "next/dynamic";

export const dynamic = "force-dynamic";

const EnterpriseCheckoutClient = dynamic(() => import("./EnterpriseCheckoutClient"), {
  ssr: false,
});

export default function EnterpriseCheckoutPage() {
  return <EnterpriseCheckoutClient />;
}