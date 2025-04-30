"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebaseConfig"; // تأكد من المسار الصحيح
import { signOut } from "firebase/auth";
import { User } from "firebase/auth";

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    router.push("/"); // توجيه المستخدم بعد تسجيل الخروج
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white">
      <h1 className="text-xl font-bold">StageEase</h1>
      <ul className="flex space-x-6">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/requests">Requests</Link></li>
        <li><Link href="/messages">Messages</Link></li>
      </ul>

      <div>
        {user ? (
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
            Sign Out
          </button>
        ) : (
          <div className="space-x-4">
            <Link href="/auth/signin">
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Sign In</button>
            </Link>
            <Link href="/auth/register">
              <button className="bg-green-500 text-white px-4 py-2 rounded">Register</button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
