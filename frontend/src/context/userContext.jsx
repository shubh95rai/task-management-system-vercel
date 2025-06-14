import { createContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setUserLoading(false);
      return;
    }

    // fetch user details
    async function fetchUser() {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);

        const { user } = response.data;
        setUser(user);
      } catch (error) {
        console.error("User not authenticated", error.message);
        clearUser();
      } finally {
        setUserLoading(false);
      }
    }

    fetchUser();
  }, []);

  function updateUser(userData) {
    setUser(userData.user);
    localStorage.setItem("token", userData.token);
    setUserLoading(false);
  }

  function clearUser() {
    setUser(null);
    localStorage.removeItem("token");
  }

  const value = {
    user,
    userLoading,
    loading,
    setLoading,
    updateUser,
    clearUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
