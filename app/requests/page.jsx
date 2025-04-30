"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/app/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { Loader2, FileText, AlertTriangle } from "lucide-react";

export default function UserRequests() {
  const [userRequests, setUserRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setError("يرجى تسجيل الدخول.");
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (!userDoc.exists()) {
          setError("لا يوجد مستخدم مسجل.");
          setLoading(false);
          return;
        }

        const userType = userDoc.data().userType;

        const requestsRef = collection(db, "users", currentUser.uid, "requests");
        const requestsSnap = await getDocs(requestsRef);

        const fetchedRequests = requestsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUserRequests(fetchedRequests);
      } catch (err) {
        console.error(err);
        setError("حدث خطأ أثناء تحميل الطلبات.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading)
    return (
      <div className="text-gray-600 flex gap-2 items-center">
        <Loader2 className="animate-spin" />
        جارٍ التحميل...
      </div>
    );

  if (error)
    return (
      <div className="text-red-600 flex gap-2 items-center">
        <AlertTriangle />
        {error}
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FileText />
        الطلبات
      </h2>

      {userRequests.length === 0 ? (
        <p className="text-gray-600">لا توجد طلبات لعرضها.</p>
      ) : (
        <div className="space-y-4">
          {userRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white p-4 rounded-2xl shadow-md space-y-2 border"
            >
              <h3 className="font-semibold">{request.internshipTitle}</h3>
              <p className="text-sm text-gray-500">الشركة: {request.company}</p>
              <p className="text-sm text-gray-500">الجامعة: {request.university}</p>
              <p className="text-sm text-gray-500">
                الحالة:{" "}
                <span className="font-medium text-blue-600">{request.status}</span>
              </p>
              <p className="text-sm text-gray-500">
                التاريخ:{" "}
                {request.createdAt?.toDate
                  ? request.createdAt.toDate().toLocaleString("ar-EG")
                  : "غير متوفر"}
              </p>
              <p className="text-sm text-gray-500">الـCV: {request.cvFileName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
