const TOKEN_KEY = "app_token";
const ACCESS_TOKEN_KEY = "app_token_access";

import { jwtDecode } from "jwt-decode";

export const authenticate = (appToken, rememberMe, next) => {
  if (typeof window === "undefined") return;

  const token = JSON.stringify(appToken);

  if (rememberMe) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  if (typeof next === "function") next();
};

export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;

  try {
    const token =
      localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);

    return token ? JSON.parse(token) : false;
  } catch {
    return false;
  }
};

export const logout = (next) => {
  if (typeof window === "undefined") return;
  localStorage.clear();

  if (typeof next === "function") next();
};

export const authenticateAccess = (appToken, next) => {
  if (typeof window === "undefined") return;
  const token = JSON.stringify(appToken);
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  if (typeof next === "function") next();
};

export const isAuthenticatedAccess = () => {
  if (typeof window === "undefined") return false;
  try {
    let token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) return false;
    token = JSON.parse(token);
    let data = jwtDecode(token);
    console.log(data);
    if (data.exp * 1000 < Date.now()) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      return false;
    }
    return { data, token };
  } catch (error) {
    console.log("isAuthenticatedAccess", error);
    return false;
  }
};



export const clearAuthenticatedAccess = (next) => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  if (typeof next === "function") next();
};
