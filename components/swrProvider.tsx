"use client";

import { ReactNode } from "react";

import { SWRConfig } from "swr";

interface SwrProviderProps {
  children: ReactNode;
}

export function SwrProviders({ children }: SwrProviderProps) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => fetch(url).then((res) => res.json()),
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
