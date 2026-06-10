import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api, { retryRequest } from "../api/axios";

const AuthContext =
  createContext(null);

export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem(
        "nexamind_token"
      );

    const savedUser =
      localStorage.getItem(
        "nexamind_user"
      );

    if (token && savedUser) {
      setUser(
        JSON.parse(savedUser)
      );
    }

    setLoading(false);
  }, []);

  const login = async (
    email,
    password
  ) => {
    const res = await retryRequest(() =>
      api.post("/api/auth/login", {
        email,
        password,
      })
    );

    if (res.data.success) {
      localStorage.setItem(
        "nexamind_token",
        res.data.token
      );

      localStorage.setItem(
        "nexamind_user",
        JSON.stringify(
          res.data.user
        )
      );

      setUser(res.data.user);

      return {
        success: true,
      };
    }

    return {
      success: false,
      message:
        res.data.message,
    };
  };

  const register = async (
    name,
    email,
    password
  ) => {
    const res = await retryRequest(() =>
      api.post("/api/auth/register", {
        name,
        email,
        password,
      })
    );

    if (res.data.success) {
      localStorage.setItem(
        "nexamind_token",
        res.data.token
      );

      localStorage.setItem(
        "nexamind_user",
        JSON.stringify(
          res.data.user
        )
      );

      setUser(res.data.user);

      return {
        success: true,
      };
    }

    return {
      success: false,
      message:
        res.data.message,
    };
  };

  const logout = () => {
    localStorage.clear();

    setUser(null);

    window.location.href =
      "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);