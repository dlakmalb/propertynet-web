'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Spin } from 'antd';

import { useMe } from '@/modules/auth/hooks/useMe';

export default function ProtectedExtranetLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoading, error } = useMe();

  useEffect(() => {
    if (error?.status === 401) {
      router.replace('/extranet/login');
    }
  }, [error, router]);

  if (isLoading) {
    return (
      <main style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <Spin size="large" />
      </main>
    );
  }

  // Non-auth error (API down etc.)
  if (error && error.status !== 401) {
    return (
      <main style={{ padding: 24 }}>
        <Alert type="error" showIcon title="Could not verify session" description={error.message} />
      </main>
    );
  }

  // If user exists, allow rendering
  return <>{children}</>;
}
