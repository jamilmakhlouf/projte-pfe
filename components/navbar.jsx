"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebaseConfig";
import { signOut } from "firebase/auth";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/signin"); // بعد تسجيل الخروج، يتم توجيه المستخدم إلى صفحة تسجيل الدخول
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-md fixed w-full z-10 top-0 left-0">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-xl font-bold text-white">StageEase</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link href="/dashboard" className="text-white hover:text-indigo-300">
            Home
          </Link>

          <Link href="/requests" className="text-white hover:text-indigo-300">
            Requests
          </Link>

          <Link href="/about" className="text-white hover:text-indigo-300">
            Messages
          </Link>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="bg-red-600 px-4 py-2 rounded text-white hover:bg-red-500"
          >
            Log out
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-white focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 text-white space-y-4 p-4 absolute w-full top-full left-0">
          <Link href="/" className="block">
            Home
          </Link>
          <Link href="/requests" className="block">
            Requests
          </Link>
          <Link href="/about" className="block">
            Messages
          </Link>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="bg-red-600 w-full py-2 rounded text-white hover:bg-red-500"
          >
            Log out
          </button>
        </div>
      )}
    </nav>
  );
}
