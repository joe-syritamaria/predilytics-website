import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-blue-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
