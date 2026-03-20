import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, type PaginatedResponse } from '@/services/api';

interface LicenseAPI {
  id: number;
  trainee: number | null;
  trainee_info: any;
  purchased_date: string;
  expires_date: string;
  status: string;
  days_until_expiry: number;
  created_at: string;
  updated_at: string;
}

interface LicenseStats {
  total: number;
  by_status: Record<string, number>;
  used: number;
  available: number;
}

export function useLicenses() {
  return useQuery({
    queryKey: ['licenses'],
    queryFn: async () => {
      const data = await apiFetch<PaginatedResponse<LicenseAPI>>('/licenses/');
      return data.results;
    },
  });
}

export function useLicenseStats() {
  return useQuery({
    queryKey: ['licenses', 'stats'],
    queryFn: () => apiFetch<LicenseStats>('/licenses/stats/'),
  });
}

export function usePurchaseLicenses() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { quantity: number; purchased_date: string; expires_date: string }) =>
      apiFetch('/licenses/purchase/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licenses'] });
    },
  });
}

export function useAssignLicense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ licenseId, traineeId }: { licenseId: number; traineeId: number }) =>
      apiFetch(`/licenses/${licenseId}/assign/`, {
        method: 'POST',
        body: JSON.stringify({ trainee_id: traineeId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['licenses'] });
    },
  });
}
