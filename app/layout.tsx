import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { PHProvider } from "@/components/posthog-provider";

// Warm, modern geometric sans — used for all text (headings + body).
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DESCRIPTION =
  "Find a cafe to actually study in — see outlets, WiFi, noise and the house rules before you go. Starting in SW Sydney.";

export const metadata: Metadata = {
  metadataBase: new URL("https://findstudyspots.com"),
  title: { default: "Study Spots", template: "%s · Study Spots" },
  description: DESCRIPTION,
  openGraph: {
    title: "Study Spots",
    description: DESCRIPTION,
    url: "/",
    siteName: "Study Spots",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Study Spots",
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        jakarta.variable,
        geistMono.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <PHProvider>{children}</PHProvider>
      </body>
    </html>
  );
}
