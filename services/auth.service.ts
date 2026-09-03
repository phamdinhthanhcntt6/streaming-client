import { API_BASE_URL, api } from "@/lib/api";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export interface RegisterBody {
  email: string;
  password: string;
  displayName: string;
}

export const createChangePasswordSchema = (hasPassword: boolean) =>
  z
    .object({
      currentPassword: z.string().optional(),
      newPassword: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z
        .string()
        .min(6, "Password must be at least 6 characters"),
    })
    .superRefine((data, context) => {
      if (hasPassword && !data.currentPassword?.trim()) {
        context.addIssue({
          code: "custom",
          message: "Current password is required",
          path: ["currentPassword"],
        });
      }

      if (data.newPassword !== data.confirmPassword) {
        context.addIssue({
          code: "custom",
          message: "Passwords do not match",
          path: ["confirmPassword"],
        });
      }
    });

export type ChangePasswordBody = z.infer<
  ReturnType<typeof createChangePasswordSchema>
>;

interface ChangePasswordResponse {
  message: string;
  hasPassword: boolean;
}

export const authService = {
  getGoogleLoginUrl: () => `${API_BASE_URL}/auth/google`,

  login: async (credentials: LoginCredentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  register: async (data: RegisterBody) => {
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

  changePassword: async (data: ChangePasswordBody) => {
    const response = await api.post<ChangePasswordResponse>(
      "/auth/change-password",
      data,
    );
    return response.data;
  },

  deleteAccount: async (password?: string) => {
    const response = await api.delete("/auth/delete-account", {
      data: { password },
    });
    return response.data;
  },
};
