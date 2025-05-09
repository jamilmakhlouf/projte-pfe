"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import Navbar from "@/components/Navbar";
import InternshipModal from "@/components/InternshipModal";
import InternshipCard from "@/components/InternshipCard";

export default function CompanyDashboard() {
  const [user, setUser] = useState(null);
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInternship, setEditingInternship] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedStudyType, setSelectedStudyType] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);

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
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists() || userSnap.data().userType !== "company") {
          router.push("/dashboard");
        } else {
          setUser(currentUser);
          fetchInternshipsForCompany();
        }
      } else {
        router.push("/signin");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchInternshipsForCompany = async () => {
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

  const handleAddInternship = async (newInternship) => {
    const docRef = await addDoc(collection(db, "internships"), newInternship);
    const saved = { id: docRef.id, ...newInternship };
    setInternships((prev) => [...prev, saved]);
    setIsModalOpen(false);
    setEditingInternship(null);
  };

  const handleEditInternship = (internship) => {
    setEditingInternship(internship);
    setIsModalOpen(true);
  };

  const handleDeleteInternship = async (id) => {
    await deleteDoc(doc(db, "internships", id));
    setInternships((prev) => prev.filter((i) => i.id !== id));
    alert("تم الحذف بنجاح");
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/signin");
  };

  const renderInternships = () => {
    if (filteredInternships.length === 0) {
      return <p className="text-center text-gray-400 mt-6">لا توجد عروض تربص حالياً.</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInternships.map((internship) => (
          <InternshipCard
            key={internship.id}
            internship={internship}
            onEdit={handleEditInternship}
            onDelete={handleDeleteInternship}
            onDetails={(intern) => console.log("عرض التفاصيل:", intern)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white mt-10">
      <Navbar />

      <div className="max-w-6xl mx-auto mt-10 p-6 flex justify-between items-center">
  <button
    onClick={() => setIsFormOpen(true)}
    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition duration-300"
  >
    ➕ إضافة تربص جديد
  </button>

  <InternshipModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
</div>

      {/* فلاتر الشركات */}
      <div className="max-w-6xl mx-auto mt-4 p-4">
        <select
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white mb-4"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">اختار العام الدراسي</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>

        <select
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white mb-4"
          value={selectedStudyType}
          onChange={(e) => setSelectedStudyType(e.target.value)}
        >
          <option value="">اختار نوع الدراسة</option>
          {studyTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {selectedStudyType && (
          <select
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white mb-4"
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
          >
            <option value="">اختار الشعبة</option>
            {specializations[selectedStudyType]?.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* عرض التربصات بعد تطبيق الفلاتر */}
      {renderInternships()}

      {isModalOpen && (
        <InternshipModal
          onClose={() => {
            setIsModalOpen(false);
            setEditingInternship(null);
          }}
          onAdd={handleAddInternship}
          internship={editingInternship}
        />
      )}
    </div>
  );
}
