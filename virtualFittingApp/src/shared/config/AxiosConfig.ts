import axios, { type HeadersDefaults } from "axios";
import Cookies from "js-cookie";

import {
  basilium_ai_refresh_token,
  basilium_refresh_token,
} from "../action/token.action";

// * Default Server

const BASE_URL = import.meta.env.VITE_APPLICATION_BASILIUM_SERVER as string;

export const API_BASILIUM = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

type headers = {
  "Content-Type": string;
  Accept: string;
  Authorization: string;
  [key: string]: string;
};

API_BASILIUM.defaults.headers = {
  "Content-Type": "application/json;",
  Accept: "application/json",
} as headers & HeadersDefaults;

API_BASILIUM.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access-token") ?? null;
    const BearerToken = "Bearer " + token;
    if (token && config.headers) {
      config.headers["Authorization"] = BearerToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API_BASILIUM.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get("refresh-token") ?? ""; // Retrieve the stored refresh token.

        const response = await basilium_refresh_token(refreshToken);

        const { accessToken, newRefreshToken } = response.data;

        Cookies.set("access-token", accessToken);
        Cookies.set("refresh-token", newRefreshToken);

        API_BASILIUM.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;

        return API_BASILIUM(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // Token Clear Up
        Cookies.remove("access-token");
        Cookies.remove("refresh-token");

        // have to login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// * AI Server

const AI_BASE_URL = import.meta.env
  .VITE_APPLICATION_BASILIUM_AI_SERVER as string;

export const API_BASILIUM_AI = axios.create({
  baseURL: AI_BASE_URL,
  withCredentials: true,
});

API_BASILIUM_AI.defaults.headers = {
  "Content-Type": "application/json;",
  Accept: "application/json",
} as headers & HeadersDefaults;

API_BASILIUM_AI.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access-token") ?? null;
    const BearerToken = "Bearer " + token;
    if (token && config.headers) {
      config.headers["Authorization"] = BearerToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API_BASILIUM_AI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get("refresh-token") ?? ""; // Retrieve the stored refresh token.

        const response = await basilium_ai_refresh_token(refreshToken);

        const { accessToken, newRefreshToken } = response.data;

        Cookies.set("access-token", accessToken);
        Cookies.set("refresh-token", newRefreshToken);

        API_BASILIUM_AI.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;

        return API_BASILIUM_AI(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // Token Clear Up
        Cookies.remove("access-token");
        Cookies.remove("refresh-token");

        // have to login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
