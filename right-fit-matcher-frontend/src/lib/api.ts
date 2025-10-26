import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface University {
  id: number;
  name: string;
  country: string;
  program_type: string;
  avg_gmat: number;
  avg_gpa: number;
  avg_work_exp: number;
  admit_rate: number;
}

export interface MatchResult {
  university_id: number;
  name: string;
  probability: number;
  compatibility: number;
  details: {
    s_gmat: number;
    s_gpa: number;
    s_work: number;
  };
}

export interface MatchRequest {
  gmat: number;
  gpa: number;
  work_exp: number;
  target_program: string;
  top_k?: number;
  user_id?: number;
}

export interface MatchResponse {
  matches: MatchResult[];
}

export const universitiesApi = {
  getAll: (program?: string) =>
    api.get<{ universities: University[] }>(`/api/universities`, {
      params: program ? { program } : {},
    }),
  getById: (id: number) =>
    api.get<{ university: University }>(`/api/universities/${id}`),
  getStats: () => api.get<{ statistics: unknown }>(`/api/universities/stats`),
};

export const matchingApi = {
  findMatches: (data: MatchRequest) =>
    api.post<MatchResponse>(`/api/match`, data),
};

export const usersApi = {
  getAll: () => api.get<{ users: unknown[] }>(`/api/users`),
  getById: (id: number) => api.get<{ user: unknown }>(`/api/users/${id}`),
  create: (data: unknown) => api.post(`/api/users`, data),
};

export default api;
