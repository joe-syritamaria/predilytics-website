import Sidebar from "./components/Sidebar";

export default function MoldPredictLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-blue-50 text-gray-900">
      <Sidebar />
      <main className="md:ml-64 pt-16 md:pt-0">{children}</main>
    </div>
  );
}
