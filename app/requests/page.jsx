"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/app/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { Loader2, FileText, AlertTriangle } from "lucide-react";

export default function UserRequests() {
  const [userRequests, setUserRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userType, setUserType] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          setError("Please log in first.");
          setLoading(false);
          return;
        }

        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          setError("User not found.");
          setLoading(false);
          return;
        }

        const userData = userDocSnap.data();
        const userType = userData.userType;
        setUserType(userType);

        let fetchedRequests = [];

        if (userType === "etudiant") {
          const studentRequestsRef = collection(
            db,
            "users",
            currentUser.uid,
            "requests"
          );
          const snapshot = await getDocs(studentRequestsRef);
          fetchedRequests = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        } else if (userType === "entreprise") {
          const companyRequestsQuery = query(
            collection(db, "requests"),
            where("companyId", "==", currentUser.uid)
          );
          const snapshot = await getDocs(companyRequestsQuery);
          fetchedRequests = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        }

        setUserRequests(fetchedRequests);
      } catch (err) {
        console.error(err);
        setError("An error occurred while loading requests.");
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged(() => {
      fetchRequests();
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const requestRef = doc(db, "requests", requestId);
      await updateDoc(requestRef, { status: newStatus });
      setUserRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  if (loading)
    return (
      <div className="text-gray-600 flex gap-2 items-center">
        <Loader2 className="animate-spin" />
        Loading...
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
        Requests
      </h2>

      {userRequests.length === 0 ? (
        <p className="text-gray-600">No requests to show.</p>
      ) : (
        <div className="space-y-4">
          {userRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white p-4 rounded-2xl shadow-md space-y-2 border"
            >
              <h3 className="font-semibold">{request.internshipTitle}</h3>
              <p className="text-sm text-gray-500">Company: {request.company}</p>
              <p className="text-sm text-gray-500">
                University: {request.university}
              </p>
              <p className="text-sm text-gray-500">
                Status:{" "}
                <span className="font-medium text-blue-600">
                  {request.status}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Date:{" "}
                {request.createdAt?.toDate
                  ? request.createdAt.toDate().toLocaleString("en-US")
                  : "Not available"}
              </p>

              {request.cvUrl && (
                <a
                  href={request.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline text-sm font-medium"
                >
                  📄 Download CV
                </a>
              )}

              {userType === "entreprise" && request.cvUrl && (
                <div className="pt-2">
                  <h4 className="font-medium mb-2">CV Preview:</h4>
                  <iframe
                    src={request.cvUrl}
                    className="w-full h-96 border rounded"
                    title="CV Preview"
                  ></iframe>
                </div>
              )}

              {userType === "entreprise" && (
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => handleStatusChange(request.id, "accepted")}
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatusChange(request.id, "rejected")}
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
