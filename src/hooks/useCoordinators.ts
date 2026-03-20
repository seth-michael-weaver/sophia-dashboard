import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, type PaginatedResponse } from '@/services/api';

interface CoordinatorAPI {
  id: number;
  user: number;
  name: string;
  username: string;
  email: string;
  assigned_areas: string[];
  created_at: string;
  updated_at: string;
}

interface DepartmentAPI {
  id: number;
  name: string;
  created_at: string;
}

export interface Coordinator {
  id: string;
  name: string;
  email: string;
  assignedAreas: string[];
}

function transformCoordinator(c: CoordinatorAPI): Coordinator {
  return {
    id: String(c.id),
    name: c.name || c.username,
    email: c.email,
    assignedAreas: c.assigned_areas,
  };
}

export function useCoordinators() {
  return useQuery({
    queryKey: ['coordinators'],
    queryFn: async () => {
      const data = await apiFetch<PaginatedResponse<CoordinatorAPI>>('/coordinators/coordinators/');
      return data.results.map(transformCoordinator);
    },
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const data = await apiFetch<PaginatedResponse<DepartmentAPI>>('/coordinators/departments/');
      return data.results.map(d => d.name);
    },
  });
}

export function useCreateCoordinator() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { user: number; email: string; assigned_areas: string[] }) =>
      apiFetch('/coordinators/coordinators/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coordinators'] });
    },
  });
}

export function useDeleteCoordinator() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/coordinators/coordinators/${id}/`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coordinators'] });
    },
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) =>
      apiFetch('/coordinators/departments/', {
        method: 'POST',
        body: JSON.stringify({ name }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/coordinators/departments/${id}/`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}
