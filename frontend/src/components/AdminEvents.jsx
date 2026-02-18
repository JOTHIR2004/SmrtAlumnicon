import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Protect admin route
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      alert("Unauthorized access");
      navigate("/login");
      return;
    }

    fetchEvents();
  }, [navigate]);

  // 📥 Fetch all events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://smrtalumnicon.onrender.com/api/events");
      setEvents(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load events:", err);
      alert("Failed to load events");
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg font-medium text-gray-700">
          Loading events...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-6 py-8">
      {/* Title */}
      <h1 className="text-3xl font-bold text-green-400 text-center">
        All Alumni Events
      </h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-600">
          No events found
        </p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden
                         transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              {/* Image */}
              {event.imageUrl && (
                <img
                  src={`https://smrtalumnicon.onrender.com${event.imageUrl}`}
                  alt={event.title}
                  className="w-full h-44 object-cover"
                />
              )}
  
              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {event.title}
                </h3>

                <p className="text-sm text-gray-500 mb-2">
                  📅 {event.date}
                </p>

                <p className="text-sm mb-3 text-black">
                  {event.description}
                </p>

                <p className="text-sm text-gray-700 mb-4">
                  👤 Posted by:{" "}
                  <span className="font-medium">
                    {event.postedBy?.firstName} {event.postedBy?.lastName}
                  </span>
                </p>

                <button
                  onClick={() => deleteEvent(event._id)}
                  className="w-full py-2 rounded-lg bg-red-500 text-white font-semibold
                             hover:bg-red-600 transition-colors duration-300"
                >
                  🗑 Delete Event
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminEvents;
