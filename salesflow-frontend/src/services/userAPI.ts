// src/services/userAPI.ts
import { javaApi } from "../services/api/javaApi";
import type { User } from "../types/auth";

export interface UpdateUserPayload {
  username: string;
  email: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

// ------------------------------------------------------
// GET /user/me → Retrieve user profile
// ------------------------------------------------------
export const getMe = async (): Promise<User> => {
  const response = await javaApi.get("/user/me");
  return response.data;
};

// ------------------------------------------------------
// PUT /user/update → Update username + email
// ------------------------------------------------------
export const updateUser = async (
  payload: UpdateUserPayload
): Promise<User> => {
  const response = await javaApi.post("/user/update", payload);
  return response.data;
};

// ------------------------------------------------------
// PUT /user/change-password → Update password
// ------------------------------------------------------
export const changePassword = async (
  payload: ChangePasswordPayload
): Promise<string> => {
  const response = await javaApi.post("/user/change-password", payload);
  return response.data;
};
