import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import ClerkThemeProvider from "@/app/components/ClerkThemeProvider";

const themeScript = `
  (function () {
    try {
      const stored = localStorage.getItem("theme");
      const theme = stored === "light" ? "light" : "dark";
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
    } catch (e) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[rgb(var(--background))] text-[rgb(var(--foreground))] transition-colors duration-300">
        <ClerkThemeProvider>{children}</ClerkThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
