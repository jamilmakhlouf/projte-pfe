'use client';

import { useState, useEffect } from "react";
import { auth, db } from "../app/firebaseConfig";
import { getDoc, doc, collection, getDocs, deleteDoc, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { FaUserAlt, FaIndustry, FaUniversity, FaCalendarAlt, FaTrash } from "react-icons/fa";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [years, setYears] = useState([]);
  const [newInstitute, setNewInstitute] = useState("");
  const [selectedInstituteStudents, setSelectedInstituteStudents] = useState([]);
  const [newYear, setNewYear] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedActiveSection = localStorage.getItem('activeSection');
    if (storedActiveSection) {
      setActiveSection(storedActiveSection);
    }
  
    const checkAdminAccess = async () => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (!user) {
          router.push("/admin");
          return;
        }
  
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
  
        if (userSnap.exists() && userSnap.data().userType === "admin") {
          setLoading(false);
        } else {
          router.push("/unauthorized");
        }
      });
  
      return () => unsubscribe(); // تنظيف الاشتراك عند إزالة المكون
    };
  
    checkAdminAccess();

    const currentYear = new Date().getFullYear();
    const month = new Date().getMonth();
    const yearText =
      month >= 7
        ? `${currentYear}/${currentYear + 1}`
        : `${currentYear - 1}/${currentYear}`;
    setNewYear(yearText);
  }, [router]);

  useEffect(() => {
    localStorage.setItem('activeSection', activeSection);
  }, [activeSection]);

  const fetchData = async () => {
    if (activeSection === "students") {
      const querySnapshot = await getDocs(collection(db, "users"));
      const data = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user) => user.userType === "student");
      setStudents(data);
    } else if (activeSection === "companies") {
      const querySnapshot = await getDocs(collection(db, "users"));
      const data = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user) => user.userType === "company");
      setCompanies(data);
    } else if (activeSection === "institutes") {
      const querySnapshot = await getDocs(collection(db, "institutes"));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setInstitutes(data);
    } else if (activeSection === "years") {
      const querySnapshot = await getDocs(collection(db, "years"));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setYears(data);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeSection]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      fetchData();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleAddInstitute = async (e) => {
    e.preventDefault();
    if (!newInstitute.trim()) return;

    try {
      await addDoc(collection(db, "institutes"), { name: newInstitute });
      setNewInstitute("");
      fetchData();
    } catch (error) {
      console.error("Error adding institute:", error);
    }
  };

  const handleDeleteInstitute = async (id) => {
    try {
      await deleteDoc(doc(db, "institutes", id));
      fetchData();
    } catch (error) {
      console.error("Error deleting institute:", error);
    }
  };

  const handleShowInstituteStudents = async (instituteId) => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const studentsInInstitute = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (user) => user.userType === "student" && user.instituteId === instituteId
        );
      setSelectedInstituteStudents(studentsInInstitute);
    } catch (error) {
      console.error("Error fetching students for institute:", error);
    }
  };

  const handleAddYear = async (e) => {
    e.preventDefault();
    try {
      const yearRef = collection(db, "years");
      const snapshot = await getDocs(yearRef);
      const alreadyExists = snapshot.docs.some(
        (doc) => doc.data().year === newYear
      );
      if (alreadyExists) return alert("Year already exists!");

      await addDoc(yearRef, { year: newYear });
      fetchData();
    } catch (err) {
      console.error("Failed to add year:", err);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-xl">🔒 Verifying...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white p-6 space-y-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <ul className="space-y-4">
          <li><button onClick={() => setActiveSection("students")} className="w-full text-left flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-blue-700"><FaUserAlt /><span>Students</span></button></li>
          <li><button onClick={() => setActiveSection("companies")} className="w-full text-left flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-blue-700"><FaIndustry /><span>Companies</span></button></li>
          <li><button onClick={() => setActiveSection("institutes")} className="w-full text-left flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-blue-700"><FaUniversity /><span>Institutes</span></button></li>
          <li><button onClick={() => setActiveSection("years")} className="w-full text-left flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-blue-700"><FaCalendarAlt /><span>Years</span></button></li>
          <button
    onClick={async () => {
      await auth.signOut();
      router.push("/signin");
    }}
    className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
  >
    Logout
  </button>
        </ul>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {activeSection === "students" && (
          <div>
            <h2 className="text-2xl font-medium text-black mb-4">Students List</h2>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead className="bg-blue-100">
                <tr>
                  <th className="py-3 px-6 text-left text-black">Name</th>
                  <th className="py-3 px-6 text-left text-black">Email</th>
                  <th className="py-3 px-6 text-left text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-t">
                    <td className="py-2 px-6 text-black">{s.name || "Unknown"}</td>
                    <td className="py-2 px-6 text-black">{s.email}</td>
                    <td className="py-2 px-6">
                      <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-800">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === "companies" && (
          <div>
            <h2 className="text-2xl font-medium text-black mb-4">Companies List</h2>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead className="bg-blue-100">
                <tr>
                  <th className="py-3 px-6 text-left text-black">Name</th>
                  <th className="py-3 px-6 text-left text-black">Email</th>
                  <th className="py-3 px-6 text-left text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="py-2 px-6 text-black">{c.name || "Unknown"}</td>
                    <td className="py-2 px-6 text-black">{c.email}</td>
                    <td className="py-2 px-6">
                      <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-800">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === "institutes" && (
          <div>
            <h2 className="text-2xl font-medium text-black mb-4">Institutes</h2>

            <form onSubmit={handleAddInstitute} className="flex items-center gap-4 mb-6">
              <input
                type="text"
                placeholder="New institute name"
                value={newInstitute}
                onChange={(e) => setNewInstitute(e.target.value)}
                className="border p-2 rounded w-1/2 text-black"
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Add
              </button>
            </form>

            <ul className="space-y-4">
              {institutes.map((i) => (
                <li
                  key={i.id}
                  className="bg-white p-4 rounded shadow flex justify-between items-center"
                >
                  <span className="font-semibold text-black">{i.name}</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleShowInstituteStudents(i.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Show Students
                    </button>
                    <button
                      onClick={() => handleDeleteInstitute(i.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {selectedInstituteStudents.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-medium mb-3">Students in this Institute</h3>
                <ul className="list-disc pl-6">
                  {selectedInstituteStudents.map((s) => (
                    <li key={s.id}>{s.name} ({s.email})</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeSection === "years" && (
          <div>
            <h2 className="text-2xl font-medium text-black mb-4">Academic Years</h2>

            <form onSubmit={handleAddYear} className="flex gap-4 mb-4">
              <input
                type="text"
                value={newYear}
                readOnly
                className="border p-2 rounded w-1/3 bg-gray-100 text-gray-800 font-semibold"
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Add Year
              </button>
            </form>

            <ul className="list-disc px-6 text-black">
              {years.map((y) => (
                <li key={y.id}>{y.year}</li>
              ))}
            </ul>
   

          </div>
        )}

      </div>
   
    </div>
    
  );
}
