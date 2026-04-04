import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function AlumniProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [resumeStatus, setResumeStatus] = useState("not_uploaded");
  const [events, setEvents] = useState([]);
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
  const fetchUserEvents = async (userId) => {
    try {
      const res = await axios.get("https://smrtalumnicon.onrender.com/api/events");

      // Filter events for current user
      const filteredEvents = res.data.filter(
        (event) =>
          event.postedBy?._id?.toString() === userId.toString()
      );

      setEvents(filteredEvents);
    } catch (err) {
      console.error("Error fetching events", err);
    }
  };

  // 🗑 Delete event
  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await axios.delete(`https://smrtalumnicon.onrender.com/api/events/${id}`);
      alert("Event deleted successfully");

      // refresh list
      setEvents((prev) => prev.filter((event) => event._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete event");
    }
  };

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

        <div className="bg-[#DAFFDA]/50 rounded-xl mt-4 p-6 h-[80vh]">
          <h3 className="text-xl text-center font-k2d mb-4 text-green-950">
            Events Posted by You
          </h3>

          <div className="overflow-y-auto h-[70vh] pr-2">
            {events.length === 0 ? (
              <p className="text-gray-700">No events available</p>
            ) : (
              <div className="flex flex-col gap-6">
                {events.map((event, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row bg-white text-gray-900 rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className="flex-1 p-6 md:w-1/2 ">

                      <p className="mt-4 mb-4 text-sm text-black p-3 border-2 bg-blue-200 border-blue-300 rounded-2xl">
                        Posted by:{" "}
                        <span className="font-medium text-black  ">
                          {event.postedBy?.firstName} {event.postedBy?.lastName}
                        </span>
                      </p>

                      <h4 className="text-4xl font-bold mb-1 text-red-400">
                        {event.title}
                      </h4>

                      <p className="text-sm mt-4 text-gray-500 mb-2">
                        📅 {event.date}
                      </p>
                      <p className="mt-4 text-neutral-950 h-auto rounded-2xl bg-blue-200 border-2 p-3 border-blue-400">
                        Description:{" "}
                        <span className="font-medium text-black p-3 ">
                          {event.description}
                        </span>
                        
                      </p>

                      <button
                  onClick={() => deleteEvent(event._id)}
                  className="w-full py-2 rounded-lg bg-red-500 text-white font-semibold
                             hover:bg-red-600 transition-colors duration-300 mt-4"
                >
                  🗑 Delete Event
                </button>
                    </div>
                    <div className="flex md:w-1/2 justify-center items-center overflow-hidden">
                    {event.imageUrl && (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className=" w-auto h-auto object-cover "
                      />
                    )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlumniProfile;
