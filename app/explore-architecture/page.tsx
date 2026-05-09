import ExploreArch from "../(mainpage)/components/ExploreArch";
import MarketingHeader from "../components/MarketingHeader";
import MarketingFooter from "../components/MarketingFooter";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-[rgb(var(--background))] text-[rgb(var(--foreground))]">

      {/* ================= HEADER ================= */}
      <MarketingHeader />

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1">
        <ExploreArch />
      </main>

      {/* ================= FOOTER ================= */}
      <MarketingFooter />

    </div>
  );
}