import apiClient from "@/lib/axios";

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export const usersService = {
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get("/users");
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  create: async (userData: Partial<User>): Promise<User> => {
    const response = await apiClient.post("/users", userData);
    return response.data;
  },

  update: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
