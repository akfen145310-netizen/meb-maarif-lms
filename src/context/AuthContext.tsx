"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  type User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "@/lib/firebase/config";
import { syncUserProfile } from "@/lib/firebase/userProfile";
import type { UserProfile } from "@/types";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  isConfigured: false,
  authError: null,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  logout: async () => {},
  clearError: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearError = () => setAuthError(null);

  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          try {
            const profile = await syncUserProfile(currentUser);
            if (profile) setUserProfile(profile);
          } catch (e) {
            console.warn("Could not sync user profile:", e);
          }
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Auth state change error:", error);
        setAuthError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    clearError();
    if (!auth || !isFirebaseConfigured) {
      setAuthError("Firebase yapılandırması henüz tamamlanmadı. Lütfen .env.local dosyasını doldurun.");
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Google sign in error:", error);
      setAuthError(error.message || "Google ile giriş yapılırken bir hata oluştu.");
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    clearError();
    if (!auth || !isFirebaseConfigured) {
      setAuthError("Firebase yapılandırması henüz tamamlanmadı. Lütfen .env.local dosyasını doldurun.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Email sign in error:", error);
      setAuthError(error.message || "Giriş yapılırken bir hata oluştu.");
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    clearError();
    if (!auth || !isFirebaseConfigured) {
      setAuthError("Firebase yapılandırması henüz tamamlanmadı. Lütfen .env.local dosyasını doldurun.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Email sign up error:", error);
      setAuthError(error.message || "Kayıt olunurken bir hata oluştu.");
      throw err;
    }
  };

  const logout = async () => {
    clearError();
    if (!auth) return;
    try {
      await signOut(auth);
      setUser(null);
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Sign out error:", error);
      setAuthError(error.message || "Çıkış yapılırken bir hata oluştu.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isConfigured: isFirebaseConfigured,
        authError,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
        clearError,
      }}
    >
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
