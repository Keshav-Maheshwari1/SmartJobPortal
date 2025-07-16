import axios from "axios";
import BASEURL from "../constants/BaseURL";

const axiosInstance = axios.create({
  baseURL: `${BASEURL}/api/v1`,
  withCredentials: false,
});

const getAuthToken = () => {
  return localStorage.getItem("accessToken");
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Axios for public/auth requests
const authAxios = axios.create({
  baseURL: `${BASEURL}/api/v1`,
  withCredentials: false,
});

export const refreshJwtToken = async () => {
  const refreshToken = getRefreshToken();
  try {
    const response = await authAxios.post("/auth/refresh-jwt", {
      token: refreshToken,
    });

    const { jwtToken, refreshToken: newRefreshToken } = response.data;

    if (jwtToken && newRefreshToken) {
      setAccessToken(jwtToken);
      localStorage.setItem("refreshToken", newRefreshToken);
    } else {
      throw new Error("Invalid response from refresh endpoint");
    }

    return jwtToken;
  } catch (error) {
    throw new Error(error.response?.data || "Unable to refresh token");
  }
};

const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

const setAccessToken = (token) => {
  localStorage.setItem("accessToken", token);
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const status = error.response?.status;
    const message = error.response?.data?.message;

    const isTokenExpired =
      (status === 440 || (status === 401 && message === "TOKEN_EXPIRED")) &&
      !originalRequest._retry;

    if (isTokenExpired) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshJwtToken();
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest); // manual retry with fixed headers
      } catch (refreshError) {
        console.log(refreshError);
        alert("Session expired. Please log in again.");
        logOutUser();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export const signUpUser = async (userData) => {
  const res = await authAxios.post("/auth/signup", userData);
  return res.data;
};

export const signInUser = async (loginData) => {
  const res = await authAxios.post("/auth/signin", loginData);
  if (res.data.jwtToken) {
    localStorage.setItem("accessToken", res.data.jwtToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
  }
  return res.data;
};

export const fetchUser = async (email) => {
  const res = await axiosInstance.get(`/users/${email}`);
  return res.data;
};

export const updateUser = async (user) => {
  const { email, ...updatedData } = user;
  const res = await axiosInstance.put(`/users/${email}`, updatedData);
  return res.data;
};

export const logOutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userEmail");
};
