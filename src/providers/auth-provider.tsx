"use client";

import React, { createContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phone: string;
  role: "user" | "owner";
  businessName?: string;
  businessAddress?: string;
  sportType?: string;
  createdAt?: string;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          } else {
            setProfile(null);
          }
        } catch (err) {
          console.error("Lỗi khi tải thông tin người dùng từ Firestore:", err);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Lỗi khi đăng xuất khỏi Firebase:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
