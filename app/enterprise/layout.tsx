import ClerkLightLayout from "@/app/components/ClerkLightLayout";

export default function EnterpriseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkLightLayout>{children}</ClerkLightLayout>;
}
