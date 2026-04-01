import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
function PendingResumes() {
  const navigate = useNavigate();
  const [pendingStudents, setPendingStudents] = useState([]);

  // Logged-in admin
  const admin = JSON.parse(localStorage.getItem("user"));

  // Fetch pending resumes
  const fetchPendingResumes = async () => {
    try {
      const res = await fetch(
        "https://smrtalumnicon.onrender.com/api/auth/pending-resumes"
      );
      const data = await res.json();

      if (res.ok) {
        setPendingStudents(data.students || []);
      } else {
        alert(data.message || "Failed to load pending resumes");
      }
    } catch (err) {
      console.error("Fetch pending resumes error:", err);
      alert("Server error while fetching resumes");
    }
  };

  useEffect(() => {
    fetchPendingResumes();
  }, []);

  // Approve resume
  const approveResume = async (studentId) => {
    if (!admin || admin.role !== "admin") {
      alert("Unauthorized access");
      return;
    }

    try {
      const res = await fetch(
        `https://smrtalumnicon.onrender.com/api/auth/admin/approve-resume/${studentId}`,
        { method: "PUT" }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Interview experience approved successfully");
        fetchPendingResumes();
      } else {
        alert(data.message || "Approval failed");
      }
    } catch (err) {
      console.error("Approve resume error:", err);
      alert("Server error during approval");
    }
  };

  // Reject resume
  const rejectResume = async (studentId) => {
    if (!admin || admin.role !== "admin") {
      alert("Unauthorized access");
      return;
    }

    if (!window.confirm("Are you sure you want to reject this resume?")) return;

    try {
      const res = await fetch(
        `https://smrtalumnicon.onrender.com/api/auth/admin/reject-resume/${studentId}`,
        { method: "PUT" }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Resume rejected");
        fetchPendingResumes();
      } else {
        alert(data.message || "Rejection failed");
      }
    } catch (err) {
      console.error("Reject resume error:", err);
      alert("Server error during rejection");
    }
  };

  return (
    <div className="h-screen  bg-black p-6 shadow-lg font-sans">
      {/* <h2 className="text-2xl flex justify-center font-semibold text-green-400 border-b pb-3 mb-6">
        Pending Interview Experiences
      </h2> */}
      <div className="text-2xl flex justify-evenly font-semibold text-green-400 border-b pb-3 mb-6 ">
        <button className="text-green-400 border-2 border-green-400 rounded-xl text-3xl" onClick={() => navigate("/admin/dashboard")}><GoHomeFill /></button>
        <span className="text-green-300 text-2xl">Pending Interview Experiences</span>
      </div>

      {pendingStudents.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No pending interview experiences.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 border-b">
                  Student Name
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 border-b">
                  Email
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 border-b">
                  Int-Exp
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 border-b">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 border-b">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {pendingStudents.map((student, index) => (
                <tr
                  key={student._id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-indigo-50 transition`}
                >
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {student.firstName} {student.lastName}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-800">
                    {student.email}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    {student.resumeUrl ? (
                      <a
                        //href={student.resumeUrl}
                        href={`https://smrtalumnicon.onrender.com${student.resumeUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-medium hover:underline"
                      >
                        View Int-Exp
                      </a>
                    ) : (
                      "No resume"
                    )}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    {student.resumeStatus === "approved" && (
                      <span className="text-green-600 font-semibold">
                        Approved
                      </span>
                    )}
                    {student.resumeStatus === "rejected" && (
                      <span className="text-red-600 font-semibold">
                        Rejected
                      </span>
                    )}
                    {student.resumeStatus === "pending" && (
                      <span className="text-gray-600">Pending</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    {student.resumeStatus === "pending" && (
                      <>
                        <button
                          onClick={() => approveResume(student._id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs font-medium mr-2 transition"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => rejectResume(student._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs font-medium transition"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {student.resumeStatus === "approved" && (
                      <span className="text-green-600 font-semibold">
                         Approved
                      </span>
                    )}

                    {student.resumeStatus === "rejected" && (
                      <span className="text-red-600 font-semibold">
                         Rejected
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PendingResumes;
