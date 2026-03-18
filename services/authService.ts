import axiosPublic from "../api/axiosPublic";

/**
 * Get or create a unique device ID (browser only)
 */
const getDeviceId = () => {
  if (typeof window === "undefined") return null; // SSR safe

  let id = localStorage.getItem("deviceId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("deviceId", id);
  }
  return id;
};

const AuthService = {
  /**
   * Login with email/password
   * Returns { accessToken } from server
   */
  login: async ({ email, password }: { email: string; password: string }) => {
    const deviceId = getDeviceId(); // client-only
    const response = await axiosPublic.post(
      "/login",
      { email, password, deviceId },
      { withCredentials: true }, // server sets HttpOnly refresh token
    );

    return response.data; // { accessToken }
  },

  /**
   * Logout user
   */
  logout: async () => {
    return axiosPublic.delete("/logout", { withCredentials: true });
  },

  /**
   * Refresh access token using HttpOnly cookie
   */
  refreshToken: async () => {
    const response = await axiosPublic.post("/refresh", null, {
      withCredentials: true, // uses HttpOnly cookie
    });
    return response.data.accessToken; // just return, don't store in localStorage
  },

  /**
   * Get current user info
   * axiosInstance: axios instance (can include interceptors)
   * token: access token from login or refreshToken
   */
  getMe: async (axiosInstance: any, token: string) => {
    const response = await axiosInstance.get("/me", {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  },
};

export default AuthService;
