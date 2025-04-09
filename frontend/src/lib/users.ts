import { User } from "@/types/auth.types";
import apiClient from "./axios";

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  active?: boolean;
}

export const fetchUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<User[]>("/users");
  return response.data;
};

export const fetchUser = async (id: string): Promise<User> => {
  const response = await apiClient.get<User>(`/users/${id}`);
  return response.data;
};

export const createUser = async (user: CreateUserDto): Promise<User> => {
  const response = await apiClient.post<User>("/users", user);
  return response.data;
};

export const updateUser = async (
  id: string,
  user: UpdateUserDto
): Promise<User> => {
  const response = await apiClient.put<User>(`/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};
