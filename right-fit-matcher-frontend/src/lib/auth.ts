import api from "./api";

export interface User {
  id: number;
  name: string;
  email: string;
  gmat?: number;
  gpa?: number;
  work_exp?: number;
  target_program?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export const authApi = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    gmat?: number;
    gpa?: number;
    work_exp?: number;
    target_program?: string;
  }) => {
    return api.post<AuthResponse>("/api/auth/register", data);
  },

  login: async (email: string, password: string) => {
    return api.post<AuthResponse>("/api/auth/login", { email, password });
  },

  getProfile: async (): Promise<{ user: User }> => {
    return api.get("/api/auth/profile");
  },

  updateProfile: async (data: Partial<User>) => {
    return api.put("/api/auth/profile", data);
  },
};

export const getToken = () => {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
};

export const saveToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};

if (typeof window !== "undefined") {
  const token = getToken();
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  api.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}
