import type { Metadata } from "next";

import "./globals.css";

import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ConvexClientProvider } from "@/components/Providers/convex.provider";

import Modals from "@/components/Modals";

import { Toaster } from "@/components/ui/sonner";
import JotaiProvider from "@/components/Providers/jotai.provider";

export const metadata: Metadata = {
  title: "Slack Clone",
  description: "Fullstack Slack Clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body>
          <ConvexClientProvider>
            <JotaiProvider>
              <Toaster position="top-center" />
              <Modals />
              {children}
            </JotaiProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
