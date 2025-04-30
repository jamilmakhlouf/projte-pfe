"use client";

import { useState } from "react";
import { auth, db } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function SignUp() {
  const [userType, setUserType] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [university, setUniversity] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !userType ||
      !email ||
      !password ||
      !name ||
      (userType === "student" && !university) ||
      (userType === "company" && !address)
    ) {
      setError("Please fill in all the required fields.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData =
        userType === "student"
          ? { name, email, userType, university, createdAt: new Date() }
          : { name, email, userType, address, createdAt: new Date() };

      await setDoc(doc(db, "users", user.uid), userData);
      alert("Registration successful!");

      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setUserType("");
      setUniversity("");
      setAddress("");
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred.");
    }
    setLoading(false);
  };

  return (
    <section>
      <div className="mx-auto max-w-xl px-4 py-12">
        <h1 className="text-center text-3xl text-white font-semibold mb-6">Create a New Account</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          {/* User Type */}
          <div>
            <label className="block text-sm font-medium text-white mb-1" htmlFor="userType">
              Are you a student or a company? <span className="text-red-500">*</span>
            </label>
            <select
              id="userType"
              className="w-full p-2 border border-gray-700 rounded-md bg-gray-900 text-white"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              required
            >
              <option value="" disabled>Select account type</option>
              <option value="student">Student</option>
              <option value="company">Company</option>
            </select>
          </div>

          {/* Name */}
          {userType && (
            <div>
              <label className="block text-white font-medium mb-1">
                {userType === "student" ? "Full Name" : "Company Name"} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          {/* University for Student */}
          {userType === "student" && (
            <div>
              <label className="block text-white font-medium mb-1">
                University <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                required
              />
            </div>
          )}

          {/* Address for Company */}
          {userType === "company" && (
            <div>
              <label className="block text-white font-medium mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white mb-1" htmlFor="email">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              autoComplete="off"
              className="w-full p-2 border border-gray-700 rounded-md bg-gray-900 text-white"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-white mb-1" htmlFor="password">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              autoComplete="off"
              className="w-full p-2 border border-gray-700 rounded-md bg-gray-900 text-white"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full p-3 rounded-md bg-indigo-500 text-white"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center mt-4 text-white">
            Already have an account?{" "}
            <a href="/signin" className="text-indigo-400 hover:underline">
              Sign In
            </a>
          </div>
        </form>
      </div>
    </section>
  );
}
