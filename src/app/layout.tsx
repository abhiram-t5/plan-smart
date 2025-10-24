import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "./ConvexClientProvider";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlanSmart - Your AI Travel Planner",
  description: "Plan your trips effortlessly with PlanSmart",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/logo.svg" />
        </head>
        <body className={outfit.className}>
          <ConvexClientProvider> {children} </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
