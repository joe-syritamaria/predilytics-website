import MarketingFooter from "../components/MarketingFooter";
import MarketingHeader from "../components/MarketingHeader";

export default function MainPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-blue-50 text-gray-900">
      <MarketingHeader />
      <div className="flex-1">{children}</div>
      <MarketingFooter />
    </div>
  );
}
