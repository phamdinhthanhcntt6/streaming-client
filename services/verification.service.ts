import { api } from "@/lib/api";

export type VerificationStatus =
  "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface VerificationRequest {
  id: string;
  artistName: string;
  links: string[];
  status: VerificationStatus;
  reviewNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
  targetArtist: { id: string; slug: string; name: string } | null;
}

/** Admin listings carry the requester alongside the request itself. */
export interface AdminVerificationRequest extends VerificationRequest {
  user: { id: string; email: string; displayName: string };
}

export interface CreateVerificationRequestBody {
  artistName: string;
  links: string[];
}

export interface ReviewVerificationRequestBody {
  action: "APPROVE" | "REJECT";
  note?: string;
  targetArtistId?: string | null;
}

export const verificationKeys = {
  me: ["verification", "me"] as const,
  adminList: (status?: VerificationStatus) =>
    ["verification", "admin", status ?? "ALL"] as const,
};

export const verificationService = {
  getMyRequest: async () => {
    const response = await api.get<{ request: VerificationRequest | null }>(
      "/verification/requests/me",
    );
    return response.data.request;
  },

  createRequest: async (body: CreateVerificationRequestBody) => {
    const response = await api.post<{ request: VerificationRequest }>(
      "/verification/requests",
      body,
    );
    return response.data.request;
  },

  cancelMyRequest: async () => {
    const response = await api.delete<{ message: string }>(
      "/verification/requests/me",
    );
    return response.data;
  },

  listRequests: async (status?: VerificationStatus) => {
    const response = await api.get<{
      requests: AdminVerificationRequest[];
      pagination: { page: number; pageSize: number; total: number };
    }>("/verification/admin/requests", { params: status ? { status } : {} });
    return response.data;
  },

  reviewRequest: async (id: string, body: ReviewVerificationRequestBody) => {
    const response = await api.patch<{ request: VerificationRequest }>(
      `/verification/admin/requests/${id}`,
      body,
    );
    return response.data.request;
  },
};
