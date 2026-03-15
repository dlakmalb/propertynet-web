import { apiFetch } from './client';

// Enums based on backend
export type PropertyPurpose = 'sale' | 'rent';
export type PropertyStatus = 'draft' | 'published' | 'sold' | 'rented' | 'archived';
export type LandSizeUnit = 'perch' | 'acre' | 'hectare' | 'sqft' | 'sqm';
export type DwellingSizeUnit = 'sqft' | 'sqm';

// Property Type (from property-types API response)
export interface PropertyType {
  id: string;
  type: string;
  isActive: boolean;
}

// Property Type reference for create/update
export interface PropertyTypeDto {
  mainType: string; // UUID of main type
  subType?: string | null; // UUID of sub type
}

// Location
export interface PropertyLocation {
  id?: string;
  country?: string;
  province: string;
  district: string;
  city: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface CreatePropertyLocationDto {
  country?: string;
  province: string;
  district: string;
  city: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
}

// Land
export interface PropertyLand {
  id?: string;
  size: number;
  sizeUnit?: LandSizeUnit | null;
}

export interface CreatePropertyLandDto {
  size: number;
  sizeUnit?: LandSizeUnit | null;
}

// Dwelling
export interface PropertyDwelling {
  id?: string;
  name?: string | null;
  size?: number | null;
  sizeUnit?: DwellingSizeUnit | null;
  bedroomCount?: number | null;
  bathroomCount?: number | null;
  kitchenCount?: number | null;
  parkingSpaces?: number | null;
}

export interface CreatePropertyDwellingDto {
  name?: string | null;
  size?: number | null;
  sizeUnit?: DwellingSizeUnit | null;
  bedroomCount?: number | null;
  bathroomCount?: number | null;
  kitchenCount?: number | null;
  parkingSpaces?: number | null;
}

// Property type mapper (for response)
export interface PropertyTypeMapper {
  id: string;
  mainType: PropertyType;
  subType?: PropertyType | null;
}

// Main Property interface
export interface Property {
  id: string;
  referenceCode: string;
  ownerId: string;
  title: string;
  description?: string | null;
  purpose: PropertyPurpose;
  typeMappers?: PropertyTypeMapper[];
  dwellings?: PropertyDwelling[];
  land?: PropertyLand | null;
  location?: PropertyLocation | null;
  price: number;
  currency: string;
  status: PropertyStatus;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// Create DTO
export interface CreatePropertyDto {
  title: string;
  description?: string | null;
  purpose: PropertyPurpose;
  types: PropertyTypeDto[];
  price: number;
  currency?: string;
  status?: PropertyStatus;
  ownerId: string;
  dwellings?: CreatePropertyDwellingDto[];
  land?: CreatePropertyLandDto;
  location?: CreatePropertyLocationDto;
}

// Update DTO
export interface UpdatePropertyDto {
  title?: string;
  description?: string | null;
  purpose?: PropertyPurpose;
  types?: PropertyTypeDto[];
  price?: number;
  currency?: string;
  status?: PropertyStatus;
  dwellings?: CreatePropertyDwellingDto[];
  land?: CreatePropertyLandDto | null;
  location?: CreatePropertyLocationDto | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export type PropertyFilters = {
  page?: number;
  limit?: number;
  search?: string;
  purpose?: PropertyPurpose;
  status?: PropertyStatus;
  typeId?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  province?: string;
  district?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
};

function buildQueryString(params: PropertyFilters): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export async function getProperties(filters: PropertyFilters = {}) {
  const query = buildQueryString(filters);
  return apiFetch<PaginatedResponse<Property>>(`/properties${query}`);
}

export async function getProperty(id: string) {
  return apiFetch<Property>(`/properties/${id}`);
}

export async function createProperty(data: CreatePropertyDto) {
  return apiFetch<Property>('/properties', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProperty(id: string, data: UpdatePropertyDto) {
  return apiFetch<Property>(`/properties/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteProperty(id: string) {
  return apiFetch<void>(`/properties/${id}`, {
    method: 'DELETE',
  });
}
