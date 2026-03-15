import { apiFetch } from './client';

export interface PropertySubType {
  id: string;
  type: string;
  isActive: boolean;
}

export interface PropertyType {
  id: string;
  type: string;
  isActive: boolean;
  subTypes?: PropertySubType[];
}

// Get property types as tree (with subTypes)
export async function getPropertyTypesTree() {
  return apiFetch<PropertyType[]>('/property-types/tree');
}
