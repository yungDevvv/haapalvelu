"use client";

import { UserProvider } from "@/contexts/user-context";
import { WeddingProvider } from "@/contexts/wedding-context";

export function Providers({ children }) {
  return (
    <UserProvider>
      <WeddingProvider>
        {children}
      </WeddingProvider>
    </UserProvider>
  );
}
