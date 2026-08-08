import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import type { Metadata } from "next";
import { Manrope, Syne, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import "@clerk/ui/themes/shadcn.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Cascade Peer Academy | Oregon PSS & PWS Training",
    template: "%s | Cascade Peer Academy",
  },
  description:
    "Modern OHA-aligned Peer Support Specialist (40-hour) and Peer Wellness Specialist (80-hour) training with AI practice labs, hybrid and at-your-own-pace options.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ClerkProvider appearance={{ theme: shadcn }}>
          {children}
          <Toaster richColors position="top-center" />
        </ClerkProvider>
      </body>
    </html>
  );
}
