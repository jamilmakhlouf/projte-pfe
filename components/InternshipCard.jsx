"use client";

import React, { useState } from "react";

export default function InternshipPage() {
  const [selectedInternship, setSelectedInternship] = useState(null);

  const internships = [
    {
      id: "1",
      title: "تربص تطوير ويب",
      description: "فرصة لتعلم React وNext.js مع فريق متميز.",
      company: "شركة التقنية الحديثة",
      location: "تونس",
      duration: 3,
    },
    {
      id: "2",
      title: "تربص تصميم جرافيك",
      description: "تعلم استخدام Photoshop وIllustrator في مشاريع حقيقية.",
      company: "وكالة الإبداع",
      location: "سوسة",
      duration: 2,
    },
  ];

  const handleEdit = (internship) => {
    console.log("تعديل:", internship);
  };

  const handleDelete = (id) => {
    console.log("حذف التربص بالآي دي:", id);
  };

  const handleDetails = (internship) => {
    setSelectedInternship(internship);
  };

  const closeModal = () => {
    setSelectedInternship(null);
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen font-sans" dir="rtl">
      <h1 className="text-4xl font-bold text-center text-indigo-700">🔍 قائمة التربصات المتاحة</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {internships.map((internship) => (
          <div
            key={internship.id}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300 border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">{internship.title}</h2>
            <p className="text-gray-600 mb-4">{internship.description}</p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>🏢 <span className="font-medium">{internship.company}</span></p>
              <p>📍 <span>{internship.location}</span></p>
              <p>⏳ {internship.duration} أشهر</p>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={() => handleDetails(internship)}
                className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg"
              >
                👁️ عرض التفاصيل
              </button>
              <button
                onClick={() => handleEdit(internship)}
                className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 rounded-lg"
              >
                ✏️ تعديل
              </button>
              <button
                onClick={() => handleDelete(internship.id)}
                className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
              >
                🗑️ حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* مودال التفاصيل */}
      {selectedInternship && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-2xl animate-fade-in text-gray-800">
            <button
              onClick={closeModal}
              className="absolute top-3 left-3 text-gray-500 hover:text-red-500 text-xl"
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">{selectedInternship.title}</h2>
            <div className="space-y-2">
              <p><strong>الوصف:</strong> {selectedInternship.description}</p>
              <p><strong>الشركة:</strong> {selectedInternship.company}</p>
              <p><strong>الموقع:</strong> {selectedInternship.location}</p>
              <p><strong>المدة:</strong> {selectedInternship.duration} أشهر</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
