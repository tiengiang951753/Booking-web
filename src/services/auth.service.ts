// src/services/auth.service.ts
import { auth, db } from "@/services/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { UserProfile } from "@/providers/auth-provider";

type LoginInput = {
  email: string;
  password: string;
};

type RegisterInput = {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: string;
};

export const authErrorMessage: Record<string, string> = {
  "auth/invalid-credential": "Email hoặc mật khẩu không chính xác.",
  "auth/user-not-found": "Tài khoản không tồn tại.",
  "auth/wrong-password": "Sai mật khẩu.",
  "auth/invalid-email": "Địa chỉ email không hợp lệ.",
  "auth/user-disabled": "Tài khoản đã bị khóa.",
  "auth/too-many-requests": "Quá nhiều yêu cầu thất bại. Vui lòng thử lại sau.",
  "auth/internal-error": "Lỗi hệ thống khi đăng nhập. Vui lòng thử lại.",
};

export const authService = {
  // 1. Đăng nhập
  login: async ({ email, password }: LoginInput): Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth, email, password);
  },

  // 2. Đăng ký + Tạo user document trên Firestore
  register: async ({
    email,
    password,
    fullName,
    phone,
    role,
  }: RegisterInput): Promise<void> => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const { uid } = userCredential.user;

    // Lưu thông tin bổ sung vào Firestore
    await setDoc(doc(db, "users", uid), {
      uid,
      email,
      fullName,
      phone,
      role,
      createdAt: new Date().toISOString(),
    });
  },
};
