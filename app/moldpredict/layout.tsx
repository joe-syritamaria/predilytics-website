import Sidebar from "./components/Sidebar";
import MarketingFooter from "../components/MarketingFooter";

export default function MoldPredictLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[rgb(var(--background))] text-[rgb(var(--foreground))]">
      <Sidebar />
      <div className="flex min-h-screen flex-col md:ml-64">
        <main className="flex-1 pt-16 md:pt-0">{children}</main>
        <MarketingFooter />
      </div>
    </div>
  );
}

