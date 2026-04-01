import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function StudentHome() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const [events, setEvents] = useState([]);
  const [alumniSuggestions, setAlumniSuggestions] = useState([]);
  const [selectedAlumni, setSelectedAlumni] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [banners, setBanners] = useState([]);

  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [banners]);


  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(
          "https://smrtalumnicon.onrender.com/api/admin-banners"
        );
        setBanners(res.data);
      } catch (err) {
        console.error("Failed to fetch banners", err);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser._id) {
      navigate("/login");
    } else {
      setUser(storedUser);
      fetchAlumniEvents();
      fetchAlumniSuggestions(storedUser._id);
    }
  }, [navigate]);

  const fetchAlumniEvents = async () => {
    try {
      const res = await fetch("https://smrtalumnicon.onrender.com/api/events");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  };

  const fetchAlumniSuggestions = async (studentId) => {
    try {
      const res = await fetch(
        `https://smrtalumnicon.onrender.com/api/alumni/suggestions/${studentId}`
      );
      const data = await res.json();
      const normalized = Array.isArray(data)
        ? data
        : data?.data || [];
      setAlumniSuggestions(normalized);
    } catch (err) {
      console.error("Failed to fetch alumni suggestions", err);
      setAlumniSuggestions([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  const firstLetter = user.firstName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-black text-white font-sans p-4">
      {/* ================= TOP BAR ================= */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#808080]/40 rounded-xl shadow-md p-4 md:p-6 gap-4">
        <h2 className="text-5xl text-[#00DF81] font-BigShInTxt">CSBS</h2>
        <button
          className="bg-[#D7FFFE] hover:bg-green-300 px-4 py-2 rounded-full text-[#258025] font-k2d"
          onClick={() => navigate("/digital-assistance")}
        >
          Digital Assistance
        </button>
        <div className="flex items-center gap-3">


          <div className="relative">
            <div
              className="w-11 h-11 rounded-xl bg-[#00DF81] flex items-center justify-center cursor-pointer text-2xl font-bold"
              onClick={() => setShowProfile(!showProfile)}
            >
              {firstLetter}
            </div>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg p-4 z-50">
                <p className="text-sm mb-1">
                  <strong>Name:</strong> {user.firstName}
                </p>
                <p className="text-sm mb-2">
                  <strong>Role:</strong> Student
                </p>
                <button
                  className="w-full mb-2 px-3 py-2 bg-green-500 rounded"
                  onClick={() => navigate("/student-profile")}
                >
                  View Profile
                </button>
                <button
                  className="w-full px-3 py-2 bg-red-600 rounded"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="md:flex gap-6 mt-8">
        {/* ===== LEFT: ALUMNI EVENTS ===== */}
        <div className="bg-[#DAFFDA]/50 rounded-xl w-full md:w-2/3 p-6 h-[80vh]">
          <h3 className="text-xl text-center font-k2d mb-4 text-green-950">
            Alumni Posted Events
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

                      
                      {/* <span className="text-sm text-gray-500">
                        {event.date
                          ? new Date(event.date).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                          : "No date"}
                      </span> */}

                      

                      <p className="mt-4 text-neutral-950 h-auto rounded-2xl bg-blue-200 border-2 p-3 border-blue-400">
                        Description:{" "}
                        <span className="font-medium text-black p-3 ">
                          {event.description}
                        </span>
                        
                      </p>
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

        {/* ===== RIGHT: ALUMNI SUGGESTIONS ===== */}
        <div className="w-full md:w-1/3 gap-2 flex mt-2 md:mt-0 flex-col justify-end  rounded-2xl ">

          <div className="h-2/3 rounded-2xl p-2 bg-green-200 flex flex-col">
  <h2 className="text-xl font-k2d text-center mb-4 text-green-950">
    College Banner
  </h2>

  {/* Banner Display */}
  <div className="flex-1 flex justify-center items-center overflow-hidden">
    {banners.length > 0 ? (
      <img
        src={banners[currentIndex].imageUrl}
        alt="College Banner"
        className="h-full w-full object-contain rounded-xl transition-all duration-500"
      />
    ) : (
      <p className="text-green-900">No banner available</p>
    )}
  </div>
</div>
          <div className="h-1/3 bg-[#DAFFDA] border-1 border-gray-950 p-2  rounded-xl shadow-md overflow-y-auto">
            <h2 className="text-xl font-k2d  text-center mb-4 text-green-950">
              Suggested Alumni's
            </h2>

            {alumniSuggestions.length === 0 ? (
              <p className="text-center text-gray-500">
                No suggestions available
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {alumniSuggestions.map((alumni) => (
                  <div
                    key={alumni._id}
                    className="bg-gray-100 rounded-xl shadow hover:shadow-lg transition p-3 text-center"
                  >
                    {alumni.imageUrl && (
                      <img
                        src={
                          alumni.imageUrl.startsWith("http")
                            ? alumni.imageUrl
                            : `https://smrtalumnicon.onrender.com${alumni.imageUrl}`
                        }
                        alt={alumni.firstName}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                    )}

                    <h3 className="text-md font-semibold text-green-600">
                      {alumni.firstName} {alumni.lastName}
                    </h3>

                    <p className="text-xs text-gray-600 mt-1">
                      <strong>Skills:</strong>{" "}
                      {alumni.skills || "N/A"}
                    </p>

                    <button
                      onClick={() => setSelectedAlumni(alumni)}
                      className="mt-2 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold"
                    >
                      View Profile
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {selectedAlumni && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedAlumni(null)}
        >
          <div
            className="bg-white w-[95%] max-w-xl rounded-xl p-5 relative overflow-y-auto max-h-[90vh] text-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedAlumni(null)}
              className="absolute top-3 right-4 text-2xl"
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

            <a
              href={`mailto:${selectedAlumni.email}`}
              className="inline-block my-3 px-4 py-2 bg-gray-800 text-white rounded-lg"
            >
              Connect
            </a>

            <div className="space-y-2 text-sm">
              <p><strong>Phone:</strong> {selectedAlumni.phone || "N/A"}</p>
              <p><strong>Skills:</strong> {selectedAlumni.skills || "N/A"}</p>
              <p>
                <strong>Area of Interest:</strong>{" "}
                {selectedAlumni.areaOfInterest || "N/A"}
              </p>
              <p><strong>Batch:</strong> {selectedAlumni.batch || "N/A"}</p>
              <p><strong>About:</strong> {selectedAlumni.about || "N/A"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentHome;
