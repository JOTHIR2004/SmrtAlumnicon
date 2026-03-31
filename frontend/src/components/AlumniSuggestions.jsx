import React, { useState, useEffect } from "react";
import axios from "axios";

function AlumniSuggestions() {
  const [student, setStudent] = useState(null);
  const [alumniSuggestions, setAlumniSuggestions] = useState([]);
  const [selectedAlumni, setSelectedAlumni] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser._id) return;

    setStudent(storedUser);

    axios
      .get(`https://smrtalumnicon.onrender.com/api/alumni/suggestions/${storedUser._id}`)
      .then((res) => {
        console.log("API response:", res.data);

        // ✅ SAFELY normalize backend response
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];

        setAlumniSuggestions(data);
      })
      .catch((err) => {
        console.error("Error fetching suggestions:", err);
        setAlumniSuggestions([]);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Suggested Alumni for You
      </h2>

      {/* ✅ SAFE EMPTY CHECK */}
      {Array.isArray(alumniSuggestions) && alumniSuggestions.length === 0 ? (
        <p className="text-center text-gray-500">
          No suggestions available
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {alumniSuggestions.map((alumni) => (
            <div
              key={alumni._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-4 text-center"
            >
              {/* ✅ SAFE IMAGE HANDLING */}
              {alumni.imageUrl && (
                <img
                  src={
                    alumni.imageUrl.startsWith("http")
                      ? alumni.imageUrl
                      : `https://smrtalumnicon.onrender.com${alumni.imageUrl}`
                  }
                  alt={alumni.firstName}
                  className="w-full h-44 object-cover rounded-lg mb-3"
                />
              )}

              <h3 className="text-lg font-semibold">
                {alumni.firstName} {alumni.lastName}
              </h3>

              <p className="text-sm text-gray-600 mt-1">
                <span className="font-semibold">Skills:</span>{" "}
                {alumni.skills || "N/A"}
              </p>

              <button
                onClick={() => setSelectedAlumni(alumni)}
                className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL ================= */}
      {selectedAlumni && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedAlumni(null)}
        >
          <div
            className="bg-white w-[95%] max-w-xl rounded-xl p-5 relative overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedAlumni(null)}
              className="absolute top-3 right-4 text-2xl text-gray-600 hover:text-black"
            >
              &times;
            </button>

            {selectedAlumni.imageUrl && (
              <img
                src={
                  selectedAlumni.imageUrl.startsWith("http")
                    ? selectedAlumni.imageUrl
                    : `https://smrtalumnicon.onrender.com${selectedAlumni.imageUrl}`
                }
                alt={selectedAlumni.firstName}
                className="w-full h-56 object-cover rounded-lg mb-4"
              />
            )}

            <h2 className="text-xl font-semibold mb-2">
              {selectedAlumni.firstName} {selectedAlumni.lastName}
            </h2>

            <p className="text-sm mb-2">
              <strong>Email:</strong> {selectedAlumni.email}
            </p>

            {/* CONNECT BUTTON */}
            <a
              href={`mailto:${selectedAlumni.email}?subject=Connection from ${
                student?.firstName || "Student"
              }&body=Hi ${
                selectedAlumni.firstName
              }, I found your profile on the alumni portal and would like to connect with you.`}
              className="inline-block my-3 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-100 rounded-lg font-semibold transition"
            >
              Connect
            </a>

            <div className="space-y-2 text-sm">
              {/* <p>
                <strong>Phone:</strong>{" "}
                {selectedAlumni.phone || "N/A"}
              </p> */}
              <p>
                <strong>Skills:</strong>{" "}
                {selectedAlumni.skills || "N/A"}
              </p>
              <p>
                <strong>Area of Interest:</strong>{" "}
                {selectedAlumni.areaOfInterest || "N/A"}
              </p>
              {/* <p>
                <strong>Batch:</strong>{" "}
                {selectedAlumni.batch || "N/A"}
              </p>
              <p>
                <strong>About:</strong>{" "}
                {selectedAlumni.about || "N/A"}
              </p> */}
            </div>

            {selectedAlumni.interviewUrl && (
              <p className="mt-3 text-sm">
                <strong>Interview Experience:</strong>{" "}
                <a
                  href={
                    selectedAlumni.interviewUrl.startsWith("http")
                      ? selectedAlumni.interviewUrl
                      : `https://smrtalumnicon.onrender.com${selectedAlumni.interviewUrl}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View File
                </a>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AlumniSuggestions;
