import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ExitModal } from "@/components/modals/exit-modal";
import { HeartsModal } from "@/components/modals/hearts-modal";
import { PractiseModal } from "@/components/modals/practise-modal";

const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MultiLingo",
  description: "Learn and Master Multiple languages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={font.className}>
          <ExitModal />
          <HeartsModal />
          <PractiseModal />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
