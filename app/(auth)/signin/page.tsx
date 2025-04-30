"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { auth, db } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(""); // إعادة تعيين الخطأ في بداية العملية

    // التحقق إذا كان تم ملء الحقول
    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      console.log("🔹 Signing in with:", email, password);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Fetch user type from Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userType = docSnap.data().userType;

        // ✅ Redirect based on user type
        if (userType === "company") {
          router.push("/dashboard/company");  // إذا كان المستخدم شركة
        } else if (userType === "student") {
          router.push("/dashboard/student");  // إذا كان المستخدم طالب
        } if (userType === "admin") {
          router.push("/admin");  // التوجيه إلى صفحة الأدمين 
        } else {
          setError("Unknown user type.");
        }
      } else {
        setError("User data not found.");
      }
    } catch (error) {
      setError("Sign-in failed: " + (error instanceof Error ? error.message : "An unexpected error occurred."));
    }
    setLoading(false);
  };

  useEffect(() => {
    localStorage.removeItem("email");
    localStorage.removeItem("password");
  }, []);

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="pb-12 text-center">
            <h1 className="text-3xl font-semibold text-white md:text-4xl">Welcome back</h1>
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSignIn} className="mx-auto max-w-[400px] space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-white" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="form-input w-full border-gray-300 rounded-md p-2"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="form-input w-full border-gray-300 rounded-md p-2"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-lg text-gray-300">
            Don't have an account?{" "}
            <Link 
              className="font-semibold text-blue-400 hover:text-blue-500 transition duration-300"
              href="/signup"
            >
              Create a new account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
