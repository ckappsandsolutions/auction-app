// src/hooks/useAuth.js
import { useState } from "react";
import { loginUser } from "../services/api";

export default function useAuth() {
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    try {
      setLoading(true);

      const data = await loginUser({ username, password });

      localStorage.setItem("token", data.token);

      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
  };

  return {
    login,
    logout,
    loading
  };
}