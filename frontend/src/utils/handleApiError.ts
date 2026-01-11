// utils/handleApiError.ts
import axios from "axios";
import { toast } from "react-toastify";

/* ----------------------------------
   Expected API error response shape
----------------------------------- */
type ApiErrorResponse = {
  message?: string;
};

/* ----------------------------------
   Central API error handler
----------------------------------- */
export function handleApiError(error: unknown): void {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const message = error.response?.data?.message ?? "Something went wrong";

    toast.error(message);
  } else {
    toast.error("Unexpected error occurred");
  }
}
