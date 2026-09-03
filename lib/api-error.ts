import axios from "axios";

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiErrorDetails {
  message: string;
  status?: number;
  errors: ApiFieldError[];
  isNetworkError: boolean;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const parseFieldErrors = (value: unknown): ApiFieldError[] => {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (
      !isRecord(item) ||
      typeof item.field !== "string" ||
      typeof item.message !== "string"
    ) {
      return [];
    }

    return [{ field: item.field, message: item.message }];
  });
};

export const getApiError = (
  error: unknown,
  fallbackMessage = "Something went wrong. Please try again.",
): ApiErrorDetails => {
  if (!axios.isAxiosError(error)) {
    return {
      message: error instanceof Error ? error.message : fallbackMessage,
      errors: [],
      isNetworkError: false,
    };
  }

  const data = error.response?.data;
  const payload = isRecord(data) ? data : undefined;
  const serverMessage =
    typeof payload?.message === "string" && payload.message.trim()
      ? payload.message
      : undefined;
  const isTimeout = error.code === "ECONNABORTED" || error.code === "ETIMEDOUT";
  const isNetworkError = !error.response;

  let message = serverMessage ?? fallbackMessage;

  if (!serverMessage && isTimeout) {
    message = "The request timed out. Please try again.";
  } else if (!serverMessage && isNetworkError) {
    message =
      "Unable to connect to the server. Check your connection and try again.";
  }

  return {
    message,
    status: error.response?.status,
    errors: parseFieldErrors(payload?.errors),
    isNetworkError,
  };
};

export const getApiErrorMessage = (error: unknown, fallbackMessage?: string) =>
  getApiError(error, fallbackMessage).message;

export const getApiErrorStatus = (error: unknown) => getApiError(error).status;
