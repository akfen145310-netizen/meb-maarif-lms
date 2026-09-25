import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { type User } from "firebase/auth";
import { db, isFirebaseConfigured } from "./config";
import type { UserProfile } from "@/types";

export async function syncUserProfile(user: User): Promise<UserProfile | null> {
  if (!db || !isFirebaseConfigured || !user) return null;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email?.split("@")[0] || "Kullanıcı",
      photoURL: user.photoURL,
      role: "member",
    };
    await setDoc(userRef, {
      ...newProfile,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });
    return newProfile;
  } else {
    await setDoc(
      userRef,
      {
        lastLoginAt: serverTimestamp(),
        displayName: user.displayName || snap.data()?.displayName,
        photoURL: user.photoURL || snap.data()?.photoURL,
      },
      { merge: true }
    );
    return snap.data() as UserProfile;
  }
}
