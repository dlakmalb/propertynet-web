import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  type Property,
  type PropertyFilters,
  type CreatePropertyDto,
  type UpdatePropertyDto,
  type PaginatedResponse,
} from '@/lib/api/properties';
import type { ApiError } from '@/lib/api/client';

export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (filters: PropertyFilters) => [...propertyKeys.lists(), filters] as const,
  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
};

export function useProperties(filters: PropertyFilters = {}) {
  return useQuery<PaginatedResponse<Property>, ApiError>({
    queryKey: propertyKeys.list(filters),
    queryFn: () => getProperties(filters),
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useProperty(id: string) {
  return useQuery<Property, ApiError>({
    queryKey: propertyKeys.detail(id),
    queryFn: () => getProperty(id),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation<Property, ApiError, CreatePropertyDto>({
    mutationFn: createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation<Property, ApiError, { id: string; data: UpdatePropertyDto }>({
    mutationFn: ({ id, data }) => updateProperty(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      queryClient.setQueryData(propertyKeys.detail(id), data);
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
    },
  });
}
