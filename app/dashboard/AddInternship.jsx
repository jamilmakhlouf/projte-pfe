"use client";

import { useState } from "react";
import { db } from "@/app/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export default function AddInternship() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");  // حقل اسم الشركة
  const [location, setLocation] = useState("");  // حقل المكان
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddInternship = async () => {
    if (!title || !description || !company || !location || !startDate || !endDate) {
      setError("جميع الحقول مطلوبة.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // إضافة التربص إلى قاعدة البيانات
      const internshipsRef = collection(db, "internships");
      await addDoc(internshipsRef, {
        title,
        description,
        company, // إضافة اسم الشركة
        location, // إضافة المكان
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });

      alert("تم إضافة التربص بنجاح!");
      // إعادة تعيين الحقول
      setTitle("");
      setDescription("");
      setCompany("");
      setLocation("");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      console.error("❌ خطأ في إضافة التربص:", error);
      setError("حدث خطأ أثناء إضافة التربص.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-lg w-96 mx-auto">
      <h2 className="text-xl font-semibold mb-4">إضافة تربص جديد</h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input 
        type="text" 
        placeholder="عنوان التربص" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        className="w-full p-2 border rounded mb-2"
      />
      <textarea 
        placeholder="وصف التربص" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        className="w-full p-2 border rounded mb-2"
      />
      <input 
        type="text" 
        placeholder="اسم الشركة" 
        value={company} 
        onChange={(e) => setCompany(e.target.value)} 
        className="w-full p-2 border rounded mb-2" 
      />
      <input 
        type="text" 
        placeholder="المكان" 
        value={location} 
        onChange={(e) => setLocation(e.target.value)} 
        className="w-full p-2 border rounded mb-2" 
      />
      <input 
        type="date" 
        value={startDate} 
        onChange={(e) => setStartDate(e.target.value)} 
        className="w-full p-2 border rounded mb-2" 
      />
      <input 
        type="date" 
        value={endDate} 
        onChange={(e) => setEndDate(e.target.value)} 
        className="w-full p-2 border rounded mb-4" 
      />

      <button 
        onClick={handleAddInternship} 
        className={`w-full text-white p-2 rounded ${loading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"}`}
        disabled={loading}
      >
        {loading ? "جارٍ إضافة التربص..." : "📤 إضافة التربص"}
      </button>
    </div>
  );
}
