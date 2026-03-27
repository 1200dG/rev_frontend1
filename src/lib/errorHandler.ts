import { AxiosError } from "axios";
import { toast } from "react-toastify";

export function handleApiError(error: unknown, defaultMessage = "Something went wrong.") {
  let errorMessage = defaultMessage;

  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<{
      errors?: { detail?: string };
      message?: string;
    }>;

    const data = axiosError.response?.data;

    errorMessage =
      data?.errors?.detail ||
      data?.message ||
      defaultMessage;
  }
  if (typeof window !== "undefined")
  toast.error(errorMessage);
}
