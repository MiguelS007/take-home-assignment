"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  userId: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  const checkTokenValidity = (): boolean => {
    const token = localStorage.getItem("auth_token");

    if (!token) return false;

    try {
      const decoded: unknown = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  };

  const initAuth = async () => {
    setIsLoading(true);

    const isValidToken = checkTokenValidity();

    if (isValidToken) {
      try {
        const storedUserData = localStorage.getItem("user_data");
        let userData = storedUserData ? JSON.parse(storedUserData) : null;

        try {
          const userProfile = await authService.getProfile();
          userData = userProfile;
        } catch (error) {
          console.error(
            "Could not fetch updated profile, using stored data",
            error
          );
        }

        if (userData) {
          setUser(userData);
          setUserId(userData.id);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user_data");
          setIsAuthenticated(false);
          setUser(null);
          setUserId(null);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsAuthenticated(false);
        setUser(null);
        setUserId(null);
      }
    } else {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      setIsAuthenticated(false);
      setUser(null);
      setUserId(null);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });

      setUser(response.user);
      setUserId(response.user.id);
      setIsAuthenticated(true);

      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      const response = await authService.register({
        email,
        password,
        firstName,
        lastName,
      });

      setUser(response.user);
      setUserId(response.user.id);
      setIsAuthenticated(true);

      router.push("/dashboard");
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setUserId(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        userId,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
