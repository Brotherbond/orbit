"use server";

import { apiClient } from "@/lib/api-client";

export async function resetPassword({
  token,
  email,
  password,
}: {
  token: string;
  email: string;
  password: string;
}) {
  try {
    const res = await apiClient.post<any>(
      "/auth/reset-password",
      { token, email, password, password_confirmation: password },
      { showToast: false },
    );
    return { success: true, message: res.message };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to reset password.",
    };
  }
}
