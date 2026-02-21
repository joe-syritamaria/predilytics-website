import ForceLightMode from "@/app/components/ForceLightMode";

export default function ClerkLightLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="force-light min-h-screen bg-[rgb(var(--background))] text-[rgb(var(--foreground))]">
      <ForceLightMode />
      {children}
    </div>
  );
}

