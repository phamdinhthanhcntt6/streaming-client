/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/api";
import { z } from "zod";

// Define schema and data types for login with Zod
export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export const authService = {
  login: async (credentials: LoginCredentials) => {
    // Change endpoint depending on your actual backend
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // You can add other functions like register, logout here
  register: async (data: any) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  me: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};
