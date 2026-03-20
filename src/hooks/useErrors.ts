import { useQuery } from '@tanstack/react-query';
import { apiFetch, type PaginatedResponse } from '@/services/api';
import type { ErrorType } from '@/data/mockData';

interface ErrorSummaryItem {
  name: string;
  count: number;
}

interface CaseAttemptAPI {
  id: number;
  trainee: number;
  trainee_name: string;
  case: number;
  case_name: string;
  score: number;
  passed: boolean;
  errors: string[];
  created_at: string;
}

/**
 * Get global error summary (name + count) from all case attempts.
 * Maps to the ErrorType interface the frontend expects.
 */
export function useErrorTypes() {
  return useQuery({
    queryKey: ['errorTypes'],
    queryFn: async () => {
      const data = await apiFetch<ErrorSummaryItem[]>('/cases/attempts/error-summary/');
      return data.map((e): ErrorType => ({
        name: e.name,
        count: e.count,
        severity: 'critical' as const, // severity determined by display logic
      }));
    },
  });
}

/**
 * Build a mapping of trainee ID -> error names from their case attempts.
 */
export function useStudentErrorMap() {
  return useQuery({
    queryKey: ['studentErrorMap'],
    queryFn: () => apiFetch<Record<string, string[]>>('/cases/attempts/student-errors/'),
  });
}

/**
 * Get all attempts for a specific trainee.
 */
export function useTraineeAttempts(traineeId?: string) {
  return useQuery({
    queryKey: ['traineeAttempts', traineeId],
    queryFn: async () => {
      const data = await apiFetch<PaginatedResponse<CaseAttemptAPI>>(
        `/cases/attempts/by-trainee/${traineeId}/`
      );
      return data.results;
    },
    enabled: !!traineeId,
  });
}
