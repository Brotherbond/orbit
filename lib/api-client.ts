import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { getSession, signOut } from "next-auth/react";
import { showError } from "./notifications";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

/**
 * ApiResponse<T>:
 * - For single fetch:   ApiResponse<{ item: Entity }>
 * - For list fetch:     ApiResponse<{ items: Entity[] }>
 * - For other calls: Use { item: Entity }
 */
export interface ApiResponse<T> {
  status: "success" | "error";
  code: number;
  message: string;
  data: T;
  errors: Array<{
    field: string;
    message: string;
  }>;
  meta: {
    pagination?: {
      total: number;
      perPage: number;
      currentPage: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": API_KEY,
      },
    });

    this.axiosInstance.interceptors.request.use(async (config) => {
      const session = await getSession();
      const token = session?.accessToken || null;
      if (token) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Only return data if status is "success"
        if (response.data && response.data.status === "success") {
          return response.data;
        } else {
          const message =
            response.data?.message || "API returned an error status";
          showError(message, "API Error");
          return Promise.reject(new Error(message));
        }
      },
      (error) => {
        let message = "An error occurred";
        if (error.response) {
          message = error.response.data?.message || message;
        } else if (error.request) {
          message = "No response from server";
        } else if (error.message) {
          message = error.message;
        }
        if (message === "Unauthenticated.") {
          signOut();
        }
        showError(message, "API Error");
        return Promise.reject(new Error(message));
      },
    );
  }

  async get<T>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return await this.axiosInstance.get(endpoint, config);
  }

  async post<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return await this.axiosInstance.post(endpoint, data, config);
  }

  async put<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return await this.axiosInstance.put(endpoint, data, config);
  }

  async delete<T>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    return await this.axiosInstance.delete(endpoint, config);
  }
}

export const apiClient = new ApiClient(`${API_BASE_URL}/api/v1`);
