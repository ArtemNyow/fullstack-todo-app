import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "./components/providers/QueryProvider";

export const metadata: Metadata = {
  title: "TODO App",
  description: "Task management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
