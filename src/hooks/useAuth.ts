"use client";

import { useContext } from "react";
import { AuthContext, AuthContextType } from "@/providers/auth-provider";

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth phải được sử dụng bên trong một AuthProvider");
  }
  return context;
}
