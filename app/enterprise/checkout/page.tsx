import dynamicImport from "next/dynamic";

export const dynamic = "force-dynamic";

const EnterpriseCheckoutClient = dynamicImport(() => import("./EnterpriseCheckoutClient"), {
  ssr: false,
});

export default function EnterpriseCheckoutPage() {
  return <EnterpriseCheckoutClient />;
}
