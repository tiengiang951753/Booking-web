import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { UserProfile } from "@/providers/auth-provider";

export const profileService = {
  getProfile: async (uid: string): Promise<UserProfile> => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error("Không tìm thấy thông tin người dùng!");
    }
    return docSnap.data() as UserProfile;
  },
};
