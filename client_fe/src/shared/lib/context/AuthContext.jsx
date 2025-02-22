import React, { createContext, useContext, useState, useEffect } from "react";
import ServerAPI from "../API/ServerAPI";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData) => {
    setUser({
      userData: {
        username: userData.username,
        token: userData.token,
      },
    });
    // localStorage.setItem('login-token', userData.token);
    // localStorage.setItem('user_id', userData.username);
  };

  const logout = async () => {
    const token = localStorage.getItem("login-token");
    try {
      await ServerAPI.get("/User/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(null);
      localStorage.removeItem("login-token");
      localStorage.removeItem("user_info");
    } catch (error) {
      console.error("로그아웃 중 에러 발생", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("login-token");
    };

    fetchUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
