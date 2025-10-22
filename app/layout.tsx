"use client";

import { ReactNode } from "react";

import Modal from "@/components/Modal";
import Navigation from "@/components/Navigation";
import ScrollView from "@/components/ScrollView";
import "./global.css";
import { Providers } from "./providers";
import "./util.css";

export default function RootLayout({ children }: { children: ReactNode }) {
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
