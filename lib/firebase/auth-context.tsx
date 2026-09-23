"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile } from "@/types/legal";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  loginAsGuest: () => void;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginAsGuest: () => {},
  loginWithEmail: async () => {},
  signupWithEmail: async () => {},
  loginWithGoogle: async () => {},
  logout: () => {},
});

const DEMO_USER: UserProfile = {
  uid: "usr-demo-12345",
  email: "alex.clarity@example.com",
  displayName: "Alex Rivera",
  isGuest: true,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check localStorage session
    const stored = localStorage.getItem("legalclarity_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(DEMO_USER);
      }
    } else {
      // Default to logged-in demo user for seamless zero-friction hackathon testing
      setUser(DEMO_USER);
      localStorage.setItem("legalclarity_user", JSON.stringify(DEMO_USER));
    }
    setLoading(false);
  }, []);

  const loginAsGuest = () => {
    setUser(DEMO_USER);
    localStorage.setItem("legalclarity_user", JSON.stringify(DEMO_USER));
  };

  const loginWithEmail = async (email: string) => {
    const newUser: UserProfile = {
      uid: "usr-" + Date.now(),
      email,
      displayName: email.split("@")[0],
      isGuest: false,
    };
    setUser(newUser);
    localStorage.setItem("legalclarity_user", JSON.stringify(newUser));
  };

  const signupWithEmail = async (email: string, _pass: string, name: string) => {
    const newUser: UserProfile = {
      uid: "usr-" + Date.now(),
      email,
      displayName: name || email.split("@")[0],
      isGuest: false,
    };
    setUser(newUser);
    localStorage.setItem("legalclarity_user", JSON.stringify(newUser));
  };

  const loginWithGoogle = async () => {
    const googleUser: UserProfile = {
      uid: "usr-google-" + Date.now(),
      email: "google.user@legalclarity.ai",
      displayName: "Google User",
      isGuest: false,
    };
    setUser(googleUser);
    localStorage.setItem("legalclarity_user", JSON.stringify(googleUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("legalclarity_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginAsGuest,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
