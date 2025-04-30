"use client";

import { useState } from "react";
import { auth, db, storage } from "@/app/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function ApplyModal({ internship, onClose }) {
  const [fullName, setFullName] = useState("");
  const [university, setUniversity] = useState("");
  const [major, setMajor] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    setError("");
    setSuccess("");

    if (!auth.currentUser) {
      setError("🔒 يجب تسجيل الدخول أولاً قبل التقديم.");
      return;
    }

    if (!fullName || !university || !major || !cvFile) {
      setError("📝 يرجى تعبئة جميع الحقول وتحميل السيرة الذاتية.");
      return;
    }

    setLoading(true);

    try {
      const currentUser = auth.currentUser;
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}_${cvFile.name}`;

      // إنشاء المرجع للملف في Firebase Storage
      const storageRef = ref(storage, `requests/${currentUser.uid}/${uniqueFileName}`);

      // رفع الملف مع uploadBytesResumable
      const uploadTask = uploadBytesResumable(storageRef, cvFile);

      // ننتظر حتى يكتمل الرفع
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // يمكنك عرض Progress إذا تحب هنا
        },
        (error) => {
          console.error("❌ خطأ أثناء رفع الملف:", error);
          setError("حدث خطأ أثناء رفع السيرة الذاتية.");
          setLoading(false);
        },
        async () => {
          // بعد ما يكتمل الرفع بنجاح
          const cvUrl = await getDownloadURL(uploadTask.snapshot.ref);

          // تحضير بيانات الطلب
          const requestData = {
            internshipId: internship.id,
            internshipTitle: internship.title || "بدون عنوان",
            company: internship.company || "غير معروف",
            userId: currentUser.uid,
            userEmail: currentUser.email,
            fullName,
            university,
            major,
            status: "Pending",
            createdAt: new Date(),
            cvFileName: uniqueFileName,
            cvUrl,
          };

          // حفظ الطلب للمستخدم
          const userRequestRef = doc(db, "users", currentUser.uid, "requests", internship.id);
          await setDoc(userRequestRef, requestData);

          // حفظ الطلب للشركة
          const companyRequestRef = doc(db, "internships", internship.id, "requests", currentUser.uid);
          await setDoc(companyRequestRef, requestData);

          setSuccess("✅ تم إرسال طلبك بنجاح!");
          setFullName("");
          setUniversity("");
          setMajor("");
          setCvFile(null);
          setLoading(false);
        }
      );
    } catch (error) {
      console.error("❌ خطأ أثناء التقديم:", error);
      setError("حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 text-black">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-indigo-600">📩  22 تقديم طلب</h2>
          <button onClick={onClose} className="text-red-500 hover:text-red-700 text-2xl">&times;</button>
        </div>

        <p className="text-gray-700 mb-4 text-center font-semibold">{internship.title}</p>

        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-2 rounded mb-4">{success}</div>}

        <div className="space-y-3">
          <input
            type="text"
            placeholder="👤 الإسم الكامل"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border rounded p-2 focus:ring-2 focus:ring-indigo-300"
          />
          <input
            type="text"
            placeholder="🏫 الجامعة"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className="w-full border rounded p-2 focus:ring-2 focus:ring-indigo-300"
          />
          <input
            type="text"
            placeholder="🎓 التخصص"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            className="w-full border rounded p-2 focus:ring-2 focus:ring-indigo-300"
          />
          <input
            type="file"
            onChange={(e) => setCvFile(e.target.files[0])}
            className="w-full border rounded p-2 focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <button
          onClick={handleApply}
          className={`mt-6 w-full py-2 rounded text-white font-semibold transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
          disabled={loading}
        >
          {loading ? "⏳ جاري الإرسال..." : "📤 إرسال الطلب"}
        </button>
      </div>
    </div>
  );
}
