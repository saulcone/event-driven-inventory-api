import api from './api';

export type UserRole = 'admin' | 'staff' | 'viewer';

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface UserPage {
  items: User[];
  count: number;
  next?: string | null;
  previous?: string | null;
}

export interface UserQuery {
  search?: string;
  page?: number;
}

export interface RegisterInput {
  email: string;
  username: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export const userService = {
  getAll: async (query: UserQuery = {}): Promise<UserPage> => {
    const { search, page } = query;
    const { data } = await api.get<UserPage>('/auth/users', {
      params: {
        search,
        page,
      },
    });
    return data;
  },
  getById: async (id: number): Promise<User> => {
    const { data } = await api.get<User>(`/auth/users/${id}`);
    return data;
  },
  create: async (userData: RegisterInput): Promise<User> => {
    const { data } = await api.post<User>('/auth/register', userData);
    return data;
  },
  login: async (credentials: LoginInput): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials);
    localStorage.setItem('token', data.access_token);
    return data;
  },
  getMe: async (): Promise<User> => {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },
};
