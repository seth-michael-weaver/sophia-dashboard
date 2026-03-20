import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';

interface DashboardSummary {
  total_trainees: number;
  by_verification: Record<string, number>;
  avg_walkthrough_progress: number;
  avg_score: number;
  active_users: number;
  overdue: number;
  due_soon: number;
  needs_practice: number;
  total_licenses: number;
  active_licenses: number;
  expiring_licenses: number;
  recent_errors: number;
}

interface ActivityItem {
  type: string;
  trainee: string;
  description: string;
  severity?: string;
  timestamp: string;
}

interface ProgressBreakdown {
  total: number;
  by_unit: Array<{
    unit: string;
    count: number;
    avg_progress: number;
    avg_score: number;
  }>;
  by_verification: Array<{
    verification_status: string;
    count: number;
  }>;
  by_cohort: Array<{
    cohort: string;
    count: number;
    avg_progress: number;
  }>;
}

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => apiFetch<DashboardSummary>('/dashboard/summary/'),
  });
}

export function useActivityFeed(limit = 20) {
  return useQuery({
    queryKey: ['dashboard', 'activity', limit],
    queryFn: () => apiFetch<ActivityItem[]>(`/dashboard/activity/?limit=${limit}`),
  });
}

export function useProgressBreakdown() {
  return useQuery({
    queryKey: ['dashboard', 'progress'],
    queryFn: () => apiFetch<ProgressBreakdown>('/dashboard/progress/'),
  });
}
