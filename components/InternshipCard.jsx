"use client";

import React, { useState } from "react";

export default function InternshipCard({ internship, onEdit, onDelete, onDetails }) {
  const [showModal, setShowModal] = useState(false);

  // حساب المدة بين startDate و endDate
  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return { months: 0, days: 0 };

    const start = new Date(startDate);
    const end = new Date(endDate);

    // التحقق إذا كانت التواريخ صحيحة
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { months: 0, days: 0 };
    }

    const timeDifference = end - start; // الفرق بالميلي ثانية
    const durationInMonths = Math.floor(timeDifference / (1000 * 3600 * 24 * 30)); // تحويل إلى أشهر
    const durationInDays = Math.floor((timeDifference % (1000 * 3600 * 24 * 30)) / (1000 * 3600 * 24)); // أيام متبقية

    return { months: durationInMonths, days: durationInDays };
  };

  const handleDetails = () => {
    setShowModal(true);
    onDetails && onDetails(internship);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (!internship) return null;

  const { months, days } = calculateDuration(internship.startDate, internship.endDate);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300 border border-gray-100">
        <h2 className="text-xl font-semibold text-indigo-600 mb-2">
          {internship.title}
        </h2>
        <p className="text-gray-600 mb-4">{internship.description}</p>
        <div className="text-sm text-gray-500 space-y-1">
          <p>🏢 <span className="font-medium">{internship.company}</span></p>
          <p>📍 <span>{internship.location}</span></p>
          <p>⏳ {months} أشهر {days} أيام</p> {/* عرض المدة بالأشهر والأيام */}
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={handleDetails}
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg"
          >
            👁️ عرض التفاصيل
          </button>
          {onEdit && (
            <button
              onClick={() => onEdit(internship)}
              className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 rounded-lg"
            >
              ✏️ تعديل
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(internship.id)}
              className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
            >
              🗑️ حذف
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-2xl animate-fade-in text-gray-800">
            <button
              onClick={closeModal}
              className="absolute top-3 left-3 text-gray-500 hover:text-red-500 text-xl"
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">
              {internship.title}
            </h2>
            <div className="space-y-2">
              <p><strong>الوصف:</strong> {internship.description}</p>
              <p><strong>الشركة:</strong> {internship.company}</p>
              <p><strong>الموقع:</strong> {internship.location}</p>
              <p><strong>المدة:</strong> {months} أشهر {days} أيام</p> {/* عرض المدة بالأشهر والأيام في التفاصيل */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
