import axios from "axios";
// import { type CredentialResponse } from "@react-oauth/google";

// Use relative path for proxy to handle (works on mobile/network)
// Use relative path for proxy to handle (works on mobile/network)
const API_BASE_URL = "/api";

const authApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
});

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  _id: string;
  name: string;
  username?: string;
  email: string;
  picture?: string;
  favorites?: string[];
  message?: string;
  googleId?: string;
}

export const registerUser = async (
  userData: RegisterData
): Promise<AuthResponse> => {
  const response = await authApi.post<AuthResponse>("/auth/register", userData);
  return response.data;
};

export const loginUser = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await authApi.post<AuthResponse>("/auth/login", credentials);
  return response.data;
};

export const logoutUser = async () => {
  const response = await authApi.post("/auth/logout");
  return response.data;
};

export const googleAuth = async (credential: string): Promise<AuthResponse> => {
  const response = await authApi.post<AuthResponse>("/auth/google", {
    token: credential,
  });
  return response.data;
};

// Upload Profile Picture
// Upload Profile Picture
export const uploadProfilePicture = async (
  formData: FormData,
  userId: string
): Promise<{ message: string; picture: string }> => {
  formData.append("userId", userId);
  // Using relative path for proxy
  const response = await authApi.post(
    "/users/upload-profile-picture",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// Update User Profile
export const updateUserProfile = async (userData: {
  name: string;
  email?: string;
}) => {
  const response = await authApi.put("/users/update-profile", userData);
  return response.data;
};

// Delete All Favorites
export const deleteAllFavorites = async () => {
  const response = await authApi.delete("/users/delete-favorites");
  return response.data;
};

// Delete Account
export const deleteAccount = async () => {
  const response = await authApi.delete("/users/delete-account");
  return response.data;
};

// Change Password
export const changePassword = async (passwords: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await authApi.put("/users/change-password", passwords);
  return response.data;
};
