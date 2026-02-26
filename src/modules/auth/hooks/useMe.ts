import { useQuery } from '@tanstack/react-query';
import { me, type AuthUser } from '@/lib/api/auth';
import type { ApiError } from '@/lib/api/http';

export const meQueryKey = ['auth', 'me'] as const;

export function useMe() {
  return useQuery<AuthUser, ApiError>({
    queryKey: meQueryKey,
    queryFn: async () => {
      const res = await me();

      return res.user;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}
