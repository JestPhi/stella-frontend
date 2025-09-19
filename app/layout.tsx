"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Modal from "./components/Modal";
import Navigation from "./components/Navigation";
import ScrollView from "./components/ScrollView";
import "./globals.css";
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body>
        <Providers>
          <ScrollView>{children}</ScrollView>
          <Navigation />
          <Modal />
        </Providers>
      </body>
    </html>
  );
}
