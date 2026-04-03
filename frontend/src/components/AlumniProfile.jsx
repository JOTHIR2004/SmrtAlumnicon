import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AlumniProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [resumeStatus, setResumeStatus] = useState("not_uploaded");

  // Load alumni from localStorage
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

  // Upload / Re-upload Interview Experience
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
        setUser(data.student); // backend still returns student object
        setResumeStatus(data.student.resumeStatus);
        localStorage.setItem("user", JSON.stringify(data.student));
        alert("Interview Experience uploaded. Status: Pending Approval");
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg font-medium">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      {/* Profile Card */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-emerald-700 mb-6 text-center">
          Alumni Profile
        </h2>

        {/* Alumni Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <p><strong>First Name:</strong> {user.firstName || "-"}</p>
          <p><strong>Last Name:</strong> {user.lastName || "-"}</p>
          <p><strong>Email:</strong> {user.email || "-"}</p>
          <p><strong>Skills:</strong> {user.skills || "-"}</p>
          <p><strong>Area of Interest:</strong> {user.areaOfInterest || "-"}</p>
          <p><strong>Batch:</strong> {user.batch || "-"}</p>
        </div>

        {/* Interview Experience Section */}
        <div className="mt-8">
          <h3 className="font-semibold mb-3">
            Interview Experience
          </h3>

          {/* NOT UPLOADED */}
          {resumeStatus === "not_uploaded" && (
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="text-sm"
              />
              <span className="px-3 py-1 rounded-full text-xs bg-gray-200">
                Not Uploaded
              </span>
            </div>
          )}

          {/* PENDING */}
          {resumeStatus === "pending" && (
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs bg-yellow-200 text-yellow-800">
                Pending Approval
              </span>
              {user.resumeUrl && (
                <a
                  href={user.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 underline text-sm"
                >
                  View Uploaded Interview Experience
                </a>
              )}
            </div>
          )}

          {/* APPROVED */}
          {resumeStatus === "approved" && (
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs bg-green-200 text-green-800">
                Approved
              </span>
              {user.resumeUrl && (
                <a
                  href={user.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 underline text-sm"
                >
                  Download Interview Experience
                </a>
              )}
            </div>
          )}

          {/* REJECTED */}
          {resumeStatus === "rejected" && (
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs bg-red-200 text-red-800">
                Interview Experience Rejected
              </span>

              {user.resumeRejectedReason && (
                <p className="text-sm text-red-600">
                  <strong>Reason:</strong> {user.resumeRejectedReason}
                </p>
              )}

              <p className="text-sm">
                Please upload a corrected interview experience.
              </p>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="text-sm"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/alumni/home")}
            className="px-6 py-2 rounded-lg bg-emerald-600
                       text-white font-semibold
                       hover:bg-emerald-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlumniProfile;
