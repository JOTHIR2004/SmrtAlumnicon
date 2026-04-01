import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AlumniHome() {
  const navigate = useNavigate();
  const [alumni, setAlumni] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [events, setEvents] = useState([]);

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
    if (!storedUser) navigate("/login");
    else setAlumni(storedUser);

    fetchEvents();
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("https://smrtalumnicon.onrender.com/api/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  };

  if (!alumni) return null;

  const firstLetter = alumni.firstName?.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 p-5 font-sans">
      {/* ===== TOP BAR ===== */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#808080]/40 rounded-xl shadow-md p-4 md:p-6 gap-4">
        <h2 className="text-4xl text-[#00DF81] font-BigShInTxt sm:text-5xl">CSBS</h2>
        <h2 className="text-2xl text-[#00DF81] font-PNBG sm:text-5xl">Alumni View</h2>
        {/* Profile */}
        <div className="relative">
          <div
            onClick={() => setShowProfile(!showProfile)}
            className="w-11 h-11 rounded-xl bg-[#00DF81] flex items-center justify-center cursor-pointer text-2xl font-bold"
          >
            {firstLetter}
          </div>

          {showProfile && (
            <div
              className="absolute right-0 top-12 w-40
                         bg-slate-950 border border-slate-800
                         rounded-lg p-3 shadow-2xl z-10"
            >
              <p className="text-sm font-semibold mb-2">
                {alumni.firstName}
              </p>

              <button
                onClick={() => navigate("/alumni-profile")}
                className="w-full bg-slate-800 hover:bg-slate-700
                           text-sm py-1.5 rounded-md mb-2 transition"
              >
                View Profile
              </button>

              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700
                           text-sm py-1.5 rounded-md transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ===== MAIN LAYOUT ===== */}
      <div className="md:flex gap-6 mt-8">
        {/* ===== FEED ===== */}
        <div className="bg-[#DAFFDA]/50 rounded-xl md:w-2/3 p-6 h-[80vh]">
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

        {/* ===== SIDEBAR ===== */}
        <div className="w-full md:w-1/3 gap-2 flex mt-2 md:mt-0 flex-col justify-end  rounded-2xl ">
        <div className="h-3/4 rounded-2xl p-2 bg-green-200 flex flex-col">
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
          <div
            className="bg-slate-950 border h-1/4 border-slate-800
                       rounded-2xl p-5"
          >
            <button
              onClick={() => navigate("/post-event")}
              className="w-full border-2 border-green-500
                         text-green-500 font-bold py-3
                         rounded-xl mb-3
                         hover:bg-green-500 hover:text-black
                         transition"
            >
              ➕ Add Events
            </button>

            <button
              onClick={() => navigate("/alumni-profile")}
              className="w-full border-2 border-green-500
                         text-green-500 font-bold py-3
                         rounded-xl
                         hover:bg-green-500 hover:text-black
                         transition"
            >
              ➕ Add Interview Experience
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlumniHome;
      
