"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const checkUserType = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userType = docSnap.data().userType;
            if (userType === "company") {
              router.push("/dashboard/company");
            } else if (userType === "student") {
              router.push("/dashboard/student");
            } else {
              router.push("/signin");
            }
          } else {
            router.push("/signin");
          }
        } else {
          router.push("/signin");
        }
      });
    };

    checkUserType();
  }, [router]);

  return <p className="text-center text-white mt-20">جارٍ تحميل حسابك...</p>;
}
