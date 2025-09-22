"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

import { GlobalProvider } from "./context/Global";
import { ModalProvider } from "./context/Modal";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalProvider>
        <ModalProvider>{children}</ModalProvider>
      </GlobalProvider>
    </QueryClientProvider>
  );
}
