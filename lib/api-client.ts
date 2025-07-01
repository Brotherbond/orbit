import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { getSession, signOut } from "next-auth/react";
import { showError } from "./notifications";

// Configuration constants
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const SESSION_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_RETRY_ATTEMPTS = 1;

// Types
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

interface ApiRequestConfig extends AxiosRequestConfig {
  showToast?: boolean;
  _retry?: boolean;
}

interface SessionCache {
  token: string | null;
  timestamp: number;
}

// Session management class for better encapsulation
class SessionManager {
  private cache: SessionCache | null = null;

  /**
   * Get cached token if still valid
   */
  getCachedToken(): string | null {
    if (!this.cache) return null;
    
    const now = Date.now();
    const isExpired = (now - this.cache.timestamp) >= SESSION_CACHE_DURATION;
    
    if (isExpired) {
      this.clearCache();
      return null;
    }
    
    return this.cache.token;
  }

  /**
   * Update the session cache
   */
  updateCache(token: string | null): void {
    this.cache = {
      token,
      timestamp: Date.now()
    };
  }

  /**
   * Clear the session cache
   */
  clearCache(): void {
    this.cache = null;
  }

  /**
   * Check if cache exists and is valid
   */
  isValid(): boolean {
    if (!this.cache) return false;
    
    const now = Date.now();
    return (now - this.cache.timestamp) < SESSION_CACHE_DURATION;
  }
}

// Error response type
interface ErrorResponse {
  message?: string;
  errors?: Array<{ message: string }>;
}

// Error handling utilities
class ErrorHandler {
  /**
   * Handle API response errors
   */
  static handleResponseError(response: any, config: ApiRequestConfig): void {
    const message = response.data?.message || "API returned an error status";
    const errors = response.data?.errors;
    const showToast = config.showToast !== false;

    if (!showToast) return;

    if (Array.isArray(errors) && errors.length > 0) {
      errors.forEach((err: { message: string }) => {
        showError(err.message, "Error");
      });
    } else {
      showError(message, "Error");
    }
  }

  /**
   * Handle axios errors
   */
  static handleAxiosError(error: AxiosError<ErrorResponse>, config: ApiRequestConfig): void {
    const showToast = config.showToast !== false;
    if (!showToast) return;

    const errors = error.response?.data?.errors;
    if (Array.isArray(errors) && errors.length > 0) {
      errors.forEach((err: { message: string }) => {
        showError(err.message, "Error");
      });
    } else {
      const message = this.getErrorMessage(error);
      showError(message, "Error");
    }
  }

  /**
   * Extract error message from axios error
   */
  static getErrorMessage(error: AxiosError<ErrorResponse>): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.request) {
      return "No response from server";
    }
    return error.message || "An error occurred";
  }

  /**
   * Check if error is authentication related
   */
  static isAuthError(error: AxiosError<ErrorResponse>): boolean {
    return error.response?.status === 401 || 
           error.response?.data?.message === "Unauthenticated.";
  }
}

class ApiClient {
  private axiosInstance: AxiosInstance;
  private sessionManager: SessionManager;

  constructor(baseURL: string) {
    this.sessionManager = new SessionManager();
    this.axiosInstance = this.createAxiosInstance(baseURL);
    this.setupInterceptors();
  }

  /**
   * Create and configure axios instance
   */
  private createAxiosInstance(baseURL: string): AxiosInstance {
    return axios.create({
      baseURL,
      withCredentials: true,
      timeout: 30000, // 30 seconds timeout
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(API_KEY && { "x-api-key": API_KEY }),
      },
    });
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await this.getAuthToken();
        if (token) {
          config.headers = config.headers || {};
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => this.handleSuccessResponse(response),
      (error) => this.handleErrorResponse(error)
    );
  }

  /**
   * Handle successful responses
   */
  private handleSuccessResponse(response: any): any {
    if (response.data?.status === "success") {
      return response.data;
    }

    // Handle non-success status
    const config = response.config as ApiRequestConfig;
    ErrorHandler.handleResponseError(response, config);
    
    const message = response.data?.message || "API returned an error status";
    return Promise.reject(new Error(message));
  }

  /**
   * Handle error responses with retry logic
   */
  private async handleErrorResponse(error: AxiosError<ErrorResponse>): Promise<any> {
    const config = (error.config || {}) as ApiRequestConfig;
    
    // Handle authentication errors with retry
    if (ErrorHandler.isAuthError(error) && !config._retry) {
      return this.handleAuthError(error, config);
    }

    // Handle other errors
    if (ErrorHandler.isAuthError(error)) {
      this.handleSignOut();
    }

    ErrorHandler.handleAxiosError(error, config);
    const message = ErrorHandler.getErrorMessage(error);
    return Promise.reject(new Error(message));
  }

  /**
   * Handle authentication errors with token refresh and retry
   */
  private async handleAuthError(error: AxiosError<ErrorResponse>, config: ApiRequestConfig): Promise<any> {
    this.sessionManager.clearCache();
    config._retry = true;

    try {
      const token = await this.getAuthToken(true);
      if (token) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${token}`;
        return this.axiosInstance.request(config);
      }
    } catch (refreshError) {
      console.error("Token refresh failed:", refreshError);
    }

    // If refresh fails, sign out
    this.handleSignOut();
    throw error;
  }


  /**
   * Get authentication token with intelligent caching
   */
  private async getAuthToken(forceRefresh = false): Promise<string | null> {
    // Return cached token if valid and not forcing refresh
    if (!forceRefresh) {
      const cachedToken = this.sessionManager.getCachedToken();
      if (cachedToken) {
        return cachedToken;
      }
    }

    try {
      const session = await getSession();
      const token = session?.accessToken || null;
      
      this.sessionManager.updateCache(token);
      return token;
    } catch (error) {
      console.error("Failed to get session:", error);
      this.sessionManager.clearCache();
      return null;
    }
  }

  // Public API methods

  /**
   * Clear the session cache
   */
  public clearSessionCache(): void {
    this.sessionManager.clearCache();
  }

  /**
   * Manually refresh the session cache
   */
  public async refreshSession(): Promise<void> {
    await this.getAuthToken(true);
  }

  /**
   * Check if session is cached and valid
   */
  public isSessionCached(): boolean {
    return this.sessionManager.isValid();
  }

  /**
   * Get current cached token (for debugging)
   */
  public getCachedToken(): string | null {
    return this.sessionManager.getCachedToken();
  }

  /**
   * Handle complete sign out process
   * Clears session cache and localStorage, then signs out
   */
  public async handleSignOut(): Promise<void> {
    // Clear session cache
    this.clearSessionCache();
    
    // Clear any localStorage tokens if using custom auth
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    
    // Sign out with NextAuth
    await signOut({ callbackUrl: "/auth/login" });
  }

  /**
   * Handle post-login session refresh
   * Should be called after successful login to ensure fresh session
   */
  public async handlePostLogin(): Promise<void> {
    await this.refreshSession();
  }

  // HTTP methods

  async get<T>(
    endpoint: string,
    config?: ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.axiosInstance.get(endpoint, config);
  }

  async post<T>(
    endpoint: string,
    data?: any,
    config?: ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.axiosInstance.post(endpoint, data, config);
  }

  async put<T>(
    endpoint: string,
    data?: any,
    config?: ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.axiosInstance.put(endpoint, data, config);
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    config?: ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.axiosInstance.patch(endpoint, data, config);
  }

  async delete<T>(
    endpoint: string,
    config?: ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.axiosInstance.delete(endpoint, config);
  }
}

// Export singleton instance
export const apiClient = new ApiClient(`${API_BASE_URL}/api/v1`);

// Export types for external use
export type { ApiRequestConfig };
