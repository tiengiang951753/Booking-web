"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Tránh tạo mới QueryClient ở mỗi lần re-render trong SSR
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // Dữ liệu cũ sau 5 phút
            gcTime: 1000 * 60 * 10, // Giữ trong cache 10 phút
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
