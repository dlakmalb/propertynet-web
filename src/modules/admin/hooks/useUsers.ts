import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  type User,
  type UserFilters,
  type CreateUserDto,
  type UpdateUserDto,
  type PaginatedResponse,
} from '@/lib/api/users';
import type { ApiError } from '@/lib/api/client';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

export function useUsers(filters: UserFilters = {}) {
  return useQuery<PaginatedResponse<User>, ApiError>({
    queryKey: userKeys.list(filters),
    queryFn: () => getUsers(filters),
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useUser(id: string) {
  return useQuery<User, ApiError>({
    queryKey: userKeys.detail(id),
    queryFn: () => getUser(id),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation<User, ApiError, CreateUserDto>({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<User, ApiError, { id: string; data: UpdateUserDto }>({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.setQueryData(userKeys.detail(id), data);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
