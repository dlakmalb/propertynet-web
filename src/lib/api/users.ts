import { apiFetch } from './client';

export type UserRole = 'admin' | 'editor' | 'viewer';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
  password?: string;
  role?: UserRole;
  status?: UserStatus;
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

export type UserFilters = {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
};

function buildQueryString(params: UserFilters): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export async function getUsers(filters: UserFilters = {}) {
  const query = buildQueryString(filters);
  return apiFetch<PaginatedResponse<User>>(`/users${query}`);
}

export async function getUser(id: string) {
  return apiFetch<User>(`/users/${id}`);
}

export async function createUser(data: CreateUserDto) {
  return apiFetch<User>('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateUser(id: string, data: UpdateUserDto) {
  return apiFetch<User>(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteUser(id: string) {
  return apiFetch<void>(`/users/${id}`, {
    method: 'DELETE',
  });
}
