/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/api";
import { z } from "zod";

// Định nghĩa schema và kiểu dữ liệu cho login bằng Zod
export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export const authService = {
  login: async (credentials: LoginCredentials) => {
    // Thay đổi endpoint tùy thuộc vào BE thực tế của bạn
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // Bạn có thể thêm các hàm khác như register, logout ở đây
  register: async (data: any) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },
};
