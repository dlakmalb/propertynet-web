import { useQuery } from '@tanstack/react-query';
import { getPropertyTypesTree, type PropertyType } from '@/lib/api/property-types';
import type { ApiError } from '@/lib/api/client';

export const propertyTypeKeys = {
  all: ['propertyTypes'] as const,
  tree: () => [...propertyTypeKeys.all, 'tree'] as const,
};

export function usePropertyTypesTree() {
  return useQuery<PropertyType[], ApiError>({
    queryKey: propertyTypeKeys.tree(),
    queryFn: getPropertyTypesTree,
    staleTime: 5 * 60 * 1000, // 5 minutes - types don't change often
  });
}
