"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type User = {
  name: string;
  role: "student" | "mentor" | "mentor";
};

const AuthContext = createContext<{ user: User | null } | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
       const roleFromStorage = localStorage.getItem("role");
       if (roleFromStorage === "student" || roleFromStorage === "mentor" || roleFromStorage === "mentor") {
      const userData: User = {
        name: "BSP LMS Dashboard",
       // role: "mentor", // or "student" or "mentor"
        role: roleFromStorage,
      };
      setUser(userData);
      } else {
      console.warn("Invalid or missing role in localStorage");
      // Optional: fallback, redirect, or keep user null
      setUser(null);
    }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
