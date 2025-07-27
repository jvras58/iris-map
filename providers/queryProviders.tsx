'use client';

import { isServer } from '@/lib/utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = isServer
  ? new QueryClient()
  : new QueryClient({ defaultOptions: { queries: { staleTime: 60 * 1000 } } });

export function UseQueryProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}