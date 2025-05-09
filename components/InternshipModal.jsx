import React, { useState } from "react";
import { db } from "@/app/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const departments = [
  { id: "informatique", name: "شعبة الإعلامية", specialties: ["برمجة", "شبكات", "ذكاء اصطناعي", "قواعد بيانات", "تطوير ويب", "تطبيقات موبايل"] },
  { id: "genie", name: "شعبة الهندسة", specialties: ["هندسة صناعية", "ميكانيك", "كهرباء وإلكترونيات", "طاقة متجددة"] },
  { id: "gestion", name: "شعبة إدارة الأعمال", specialties: ["إدارة أعمال", "نظم معلومات إدارية"] },
];

export default function AddInternship({ isOpen, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [availableSpecialties, setAvailableSpecialties] = useState([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedStudyType, setSelectedStudyType] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return { months: 0, days: 0 };

    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDifference = end - start;
    const totalDays = Math.floor(timeDifference / (1000 * 3600 * 24));
    const months = Math.floor(totalDays / 30);
    const days = totalDays % 30;
    return { months, days };
  };

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setSelectedDepartment(departmentId);
    const department = departments.find(dep => dep.id === departmentId);
    setAvailableSpecialties(department ? department.specialties : []);
    setSelectedSpecialties([]);
  };

  const handleSpecialtiesChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedSpecialties((prev) => [...prev, value]);
    } else {
      setSelectedSpecialties((prev) => prev.filter(s => s !== value));
    }
  };

  const handleAddInternship = async () => {
    if (!title || !description || !company || !location || !startDate || !endDate || !selectedYear || !selectedStudyType) {
      setError("جميع الحقول مطلوبة.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const internshipsRef = collection(db, "internships");
      await addDoc(internshipsRef, {
        title,
        description,
        company,
        location,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        department: selectedDepartment,
        specialties: selectedSpecialties,
        year: selectedYear,
        studyType: selectedStudyType,
      });

      alert("✅ تم إضافة التربص بنجاح!");
      setTitle("");
      setDescription("");
      setCompany("");
      setLocation("");
      setStartDate("");
      setEndDate("");
      setSelectedDepartment("");
      setSelectedYear("");
      setSelectedStudyType("");
      setAvailableSpecialties([]);
      setSelectedSpecialties([]);
      onClose(); // إغلاق النافذة
    } catch (error) {
      console.error("❌ خطأ في إضافة التربص:", error);
      setError("حدث خطأ أثناء إضافة التربص.");
    } finally {
      setLoading(false);
    }
  };

  const { months, days } = calculateDuration(startDate, endDate);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <h2 className="text-2xl font-semibold mb-4 text-center">إضافة تربص جديد</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* الحقول */}
        <input type="text" placeholder="عنوان التربص" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded mb-2 text-black" />
        <textarea placeholder="وصف التربص" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded mb-2 text-black" />
        <input type="text" placeholder="اسم الشركة" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full p-2 border rounded mb-2 text-black" />
        <input type="text" placeholder="المكان" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-2 border rounded mb-2 text-black" />
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-2 border rounded mb-2 text-black" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-2 border rounded mb-4 text-black" />
        <input type="number" placeholder="السنة الدراسية" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="w-full p-2 border rounded mb-4 text-black" />

        <select value={selectedStudyType} onChange={(e) => setSelectedStudyType(e.target.value)} className="w-full p-2 border rounded mb-4 text-black">
          <option value="">اختر نوع الدراسة</option>
          <option value="انفو">انفو</option>
          <option value="مكانيك">مكانيك</option>
          <option value="إلكتريك">إلكتريك</option>
          <option value="جيني سيفيل">جيني سيفيل</option>
          <option value="إدارة أعمال">إدارة أعمال</option>
        </select>

        <select value={selectedDepartment} onChange={handleDepartmentChange} className="w-full p-2 border rounded mb-4 text-black">
          <option value="">اختر الشعبة</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>{department.name}</option>
          ))}
        </select>

        {selectedDepartment && (
          <div className="mb-4">
            {availableSpecialties.map((specialty) => (
              <div key={specialty} className="flex items-center mb-2">
                <input type="checkbox" value={specialty} checked={selectedSpecialties.includes(specialty)} onChange={handleSpecialtiesChange} id={specialty} className="mr-2" />
                <label htmlFor={specialty} className="text-gray-700">{specialty}</label>
              </div>
            ))}
            <p>التخصصات المختارة: {selectedSpecialties.join(", ")}</p>
          </div>
        )}

        {/* زر الإضافة */}
        <button onClick={handleAddInternship} className={`w-full text-white p-2 rounded ${loading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"}`} disabled={loading}>
          {loading ? "جارٍ إضافة التربص..." : "📤 إضافة التربص"}
        </button>

        {/* زر الإغلاق */}
        <button onClick={onClose} className="w-full bg-red-500 text-white p-2 rounded mt-4">إغلاق</button>
      </div>
    </div>
  );
}
