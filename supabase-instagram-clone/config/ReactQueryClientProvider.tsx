"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 쿼리 관련된 요청을 하는 모든 요청들의 캐시역할
export const queryClient = new QueryClient({});

export default function ReactQueryClientProvider({
  children,
}: React.PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
