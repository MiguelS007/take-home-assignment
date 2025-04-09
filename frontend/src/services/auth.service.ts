import apiClient from "@/lib/api-client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    name?: string;
  };
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>("/auth/login", data);

      localStorage.setItem("auth_token", response.data.access_token);
      localStorage.setItem("user_data", JSON.stringify(response.data.user));

      return response.data;
    } catch (error) {
      console.error("Login request failed:", error);
      throw error;
    }
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const backendData = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      password: data.password,
    };

    try {
      const response = await apiClient.post<AuthResponse>(
        "/auth/register",
        backendData
      );

      if (
        response.data.user &&
        response.data.user.name &&
        !response.data.user.firstName
      ) {
        const nameParts = response.data.user.name.split(" ");
        response.data.user.firstName = nameParts[0];
        response.data.user.lastName = nameParts.slice(1).join(" ");
      }

      localStorage.setItem("auth_token", response.data.access_token);
      localStorage.setItem("user_data", JSON.stringify(response.data.user));

      return response.data;
    } catch (error) {
      console.error("Registration request failed:", error);
      throw error;
    }
  },

  async getProfile(): Promise<AuthResponse["user"]> {
    try {
      const response = await apiClient.get<AuthResponse["user"]>(
        "/auth/profile"
      );

      if (response.data && response.data.name && !response.data.firstName) {
        const nameParts = response.data.name.split(" ");
        response.data.firstName = nameParts[0];
        response.data.lastName = nameParts.slice(1).join(" ");
      }

      localStorage.setItem("user_data", JSON.stringify(response.data));

      return response.data;
    } catch (error) {
      console.error("Profile fetch failed:", error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
  },
};
