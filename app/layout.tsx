import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-blue-50 text-gray-900">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
