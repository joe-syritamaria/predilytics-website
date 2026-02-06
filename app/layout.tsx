import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-blue-50 text-gray-900">
        <ClerkProvider>{children}</ClerkProvider>
        <Analytics />
      </body>
    </html>
  );
}
