import { useState } from "react";
import { auth, db } from "../firebaseConfig"; // تأكد من المسار الصحيح
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, setDoc, doc } from "firebase/firestore";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [userType, setUserType] = useState(""); // "student" أو "company"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userType || !name || !email || !password) {
      alert("يرجى ملء جميع الحقول");
      return;
    }

    setLoading(true);

    try {
      // ✅ تسجيل المستخدم في Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ حفظ بيانات المستخدم في Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        userType,
        createdAt: new Date(),
      });

      alert("تم إنشاء الحساب بنجاح!");
      setName("");
      setUserType("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("خطأ أثناء التسجيل:", error);
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" required />
      <select value={userType} onChange={(e) => setUserType(e.target.value)} required>
        <option value="" disabled>Select User Type</option>
        <option value="student">Student</option>
        <option value="company">Company</option>
      </select>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
    </form>
  );
};

export default RegisterForm;
