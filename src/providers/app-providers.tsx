'use client';

import React, { useState } from 'react';
import { ConfigProvider } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const antdTheme = {
  token: {
    colorPrimary: '#2563EB',
    colorLink: '#2563EB',
    colorText: '#111827',
    colorTextSecondary: '#6B7280',
    colorBorder: '#E5E7EB',
    fontFamily: 'var(--font-inter), system-ui, -apple-system',
  },
} as const;

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>
    </QueryClientProvider>
  );
}
