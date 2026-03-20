import { useQuery } from '@tanstack/react-query';
import { apiFetch, type PaginatedResponse } from '@/services/api';
import type { PatientCase } from '@/data/mockData';

interface PatientCaseAPI {
  id: number;
  case_name: string;
  patient_name: string;
  race: string;
  sex: string;
  age: number | null;
  preexisting_conditions: string;
  symptoms: string;
  difficulty: string;
  error_rate: number;
  avg_score: number;
  attempts: number;
  completions: number;
  top_errors: string[];
  created_at: string;
  updated_at: string;
}

const DIFFICULTY_MAP: Record<string, PatientCase['difficulty']> = {
  easy: 'Easy',
  moderate: 'Moderate',
  hard: 'Hard',
};

function transformCase(c: PatientCaseAPI): PatientCase {
  return {
    id: c.id,
    caseName: c.case_name,
    patientName: c.patient_name,
    race: c.race,
    sex: c.sex,
    age: c.age ?? 0,
    preexistingConditions: c.preexisting_conditions,
    symptoms: c.symptoms,
    difficulty: DIFFICULTY_MAP[c.difficulty] || c.difficulty as PatientCase['difficulty'],
    errorRate: c.error_rate,
    avgScore: c.avg_score,
    attempts: c.attempts,
    completions: c.completions,
    topErrors: c.top_errors,
  };
}

export function usePatientCases(filters?: { difficulty?: string }) {
  const params = new URLSearchParams();
  if (filters?.difficulty && filters.difficulty !== 'All') {
    params.set('difficulty', filters.difficulty.toLowerCase());
  }
  const query = params.toString();
  const path = `/cases/patient-cases/${query ? `?${query}` : ''}`;

  return useQuery({
    queryKey: ['cases', filters],
    queryFn: async () => {
      const data = await apiFetch<PaginatedResponse<PatientCaseAPI>>(path);
      return data.results.map(transformCase);
    },
  });
}

export function useCaseAnalytics(caseId: number | null) {
  return useQuery({
    queryKey: ['cases', caseId, 'analytics'],
    queryFn: () => apiFetch(`/cases/patient-cases/${caseId}/analytics/`),
    enabled: !!caseId,
  });
}
