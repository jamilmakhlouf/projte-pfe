"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Navbar from "@/components/Navbar";
import RequestModal from "@/components/RequestModal";

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedStudyType, setSelectedStudyType] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedInternship, setSelectedInternship] = useState(null);

  const router = useRouter();

  const studyTypes = ["انفو", "مكانيك", "إلكتريك", "جيني سيفيل", "إدارة أعمال"];
  const specializations = {
    انفو: ["RSI", "DSI", "MW"],
    مكانيك: ["خاص", "عمومي"],
    إلكتريك: ["محمول", "مستقر"],
    "جيني سيفيل": ["خاص", "عمومي"],
    "إدارة أعمال": ["إدارة مشاريع", "موارد بشرية"],
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists() || userSnap.data().userType !== "student") {
          router.push("/dashboard");
        } else {
          fetchInternships();
        }
      } else {
        router.push("/signin");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchInternships = async () => {
    const querySnapshot = await getDocs(collection(db, "internships"));
    const fetched = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setInternships(fetched);
    setFilteredInternships(fetched);
  };

  const applyFilters = () => {
    let filtered = internships;

    if (selectedYear) {
      filtered = filtered.filter((i) => i.year === selectedYear);
    }

    if (selectedStudyType) {
      filtered = filtered.filter((i) => i.studyType === selectedStudyType);
    }

    if (selectedSpecialization) {
      filtered = filtered.filter((i) => i.specialization === selectedSpecialization);
    }

    setFilteredInternships(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedYear, selectedStudyType, selectedSpecialization, internships]);

  const handleSubmitRequest = async (file) => {
    try {
      const fileRef = ref(storage, `requests/${user.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const fileURL = await getDownloadURL(fileRef);

      await addDoc(collection(db, "requests"), {
        studentId: user.uid,
        internshipId: selectedInternship.id,
        internshipTitle: selectedInternship.title,
        company: selectedInternship.company,
        fileURL,
        status: "معلق",
        createdAt: new Date(),
      });

      alert("✅ تم تقديم الطلب بنجاح!");
    } catch (error) {
      console.error("فشل التقديم:", error);
      alert("❌ حدث خطأ أثناء التقديم.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white mt-6">
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center mt-20">التربصات المتوفرة</h1>

        {/* الفلاتر */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select
            className="p-2 bg-gray-800 border border-gray-700 rounded text-white"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">السنة الدراسية</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>

          <select
            className="p-2 bg-gray-800 border border-gray-700 rounded text-white"
            value={selectedStudyType}
            onChange={(e) => {
              setSelectedStudyType(e.target.value);
              setSelectedSpecialization("");
            }}
          >
            <option value="">اختار التخصص</option>
            {studyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {selectedStudyType && (
            <select
              className="p-2 bg-gray-800 border border-gray-700 rounded text-white"
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
            >
              <option value="">اختار الشعبة</option>
              {specializations[selectedStudyType].map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* عرض التربصات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInternships.length === 0 ? (
            <p className="text-center col-span-3">لا توجد عروض تطابق الفلاتر المحددة.</p>
          ) : (
            filteredInternships.map((internship) => (
              <div
                key={internship.id}
                className="p-6 bg-gray-800 rounded-lg shadow-md border border-gray-700"
              >
                <h3 className="text-xl font-bold text-indigo-400 mb-2">
                  {internship.title}
                </h3>
                <p>{internship.description}</p>
                <p className="text-sm mt-2 text-gray-400">🏢 {internship.company}</p>
                <p className="text-sm text-gray-400">📍 {internship.location}</p>
                <p className="text-sm text-gray-400">⏳ {internship.duration} أشهر</p>
                <p className="text-sm text-gray-400">📅 {internship.year}</p>
                <button
                  onClick={() => setSelectedInternship(internship)}
                  className="mt-4 bg-indigo-600 px-4 py-2 rounded w-full"
                >
                  تقديم طلب
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* مودال التقديم */}
      {selectedInternship && (
        <RequestModal
          internship={selectedInternship}
          onClose={() => setSelectedInternship(null)}
          onSubmit={handleSubmitRequest}
        />
      )}
    </div>
  );
}
