"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/firebaseConfig";
import { signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import { doc, getDoc, db } from "@/firebaseConfig";

export default function Header() {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserType(userSnap.data().userType);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    setUserType(null);
    router.push("/signin");
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold text-white">StageEase</h1>
      <ul className="flex space-x-6 text-white">
        <li><Link href="/dashboard">Home</Link></li>
        <li><Link href="/requests">Requests</Link></li>
        <li><Link href="/messages">Messages</Link></li>
      </ul>
      {user ? (
        <button onClick={handleSignOut} className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700">
          Sign Out
        </button>
      ) : (
        <div className="space-x-4">
          <Link href="/signin" className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700">
            Sign In
          </Link>
          <Link href="/signup" className="bg-green-600 px-4 py-2 rounded-md hover:bg-green-700">
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}
