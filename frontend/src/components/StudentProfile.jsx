import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [resumeStatus, setResumeStatus] = useState("not_uploaded");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser?._id) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    setUser(storedUser);
    setResumeStatus(storedUser.resumeStatus || "not_uploaded");
  }, [navigate]);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch(
        `https://smrtalumnicon.onrender.com/api/auth/upload-resume/${user._id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        setUser(data.student);
        setResumeStatus(data.student.resumeStatus);
        localStorage.setItem("user", JSON.stringify(data.student));

        alert("Resume uploaded successfully. Status: Pending Approval");
      } else {
        alert(data.message || "Resume upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong during resume upload");
    }
  };

  if (!user) return <p className="text-white">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md transition-transform hover:scale-105">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Student Profile</h2>

        <div className="space-y-2">
          <p className="flex justify-between"><span className="text-gray-500 font-medium">First Name:</span> <span className="text-gray-800">{user.firstName || "-"}</span></p>
          <p className="flex justify-between"><span className="text-gray-500 font-medium">Last Name:</span> <span className="text-gray-800">{user.lastName || "-"}</span></p>
          <p className="flex justify-between"><span className="text-gray-500 font-medium">Email:</span> <span className="text-gray-800">{user.email || "-"}</span></p>
          <p className="flex justify-between"><span className="text-gray-500 font-medium">Skills:</span> <span className="text-gray-800">{user.skills || "-"}</span></p>
          <p className="flex justify-between"><span className="text-gray-500 font-medium">Area of Interest:</span> <span className="text-gray-800">{user.areaOfInterest || "-"}</span></p>
          <p className="flex justify-between"><span className="text-gray-500 font-medium">Batch:</span> <span className="text-gray-800">{user.batch || "-"}</span></p>
        </div>

        {/* Resume Section */}
        <div className="mt-6 p-4 border-2 border-dashed rounded-lg hover:shadow-md hover:bg-gray-50 transition">
          <strong className="block mb-2 text-gray-700">Resume:</strong>

          {resumeStatus === "not_uploaded" && (
            <>
              <label className="block mb-2 cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                Upload Resume
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleResumeUpload}
                />
              </label>
              <span className="inline-block bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">Not Uploaded</span>
            </>
          )}

          {resumeStatus === "pending" && (
            <>
              <span className="inline-block bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm">Pending Approval</span>
              {user.resumeUrl && (
                <a
                  //href={`http://localhost:5000/${user.resumeUrl}`}
                    href={user.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 text-blue-600 hover:underline"
                >
                  View Uploaded Resume
                </a>
              )}
            </>
          )}

          {resumeStatus === "approved" && (
            <>
              <span className="inline-block bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm">Approved</span>
              {user.resumeUrl && (
                <a
                  //href={`http://localhost:5000/${user.resumeUrl}`}
                    href={user.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 text-blue-600 hover:underline"
                >
                  Download Resume
                </a>
              )}
            </>
          )}

          {resumeStatus === "rejected" && (
            <>
              <span className="inline-block bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm mb-2">Resume Rejected</span>
              {user.resumeRejectedReason && (
                <p className="text-red-700 text-sm mb-2">
                  <strong>Reason:</strong> {user.resumeRejectedReason}
                </p>
              )}
              <p className="text-gray-600 text-sm mb-2">Please upload a corrected resume.</p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="block mt-1 cursor-pointer text-sm"
              />
            </>
          )}
        </div>

        <button
          className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition"
          onClick={() => navigate("/student/home")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default StudentProfile;
