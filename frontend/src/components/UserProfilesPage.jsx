import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import axios from "axios";

function UserProfilesPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Protect route and fetch users
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      alert("Unauthorized access");
      navigate("/login");
      return;
    }
    fetchUsers();
  }, [navigate]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://smrtalumnicon.onrender.com/api/admin/users");
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`https://smrtalumnicon.onrender.com/api/admin/users/${userId}`);
      alert("User deleted successfully!");
      fetchUsers(); // refresh list
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user");
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-700">Loading users...</p>;

  return (
    <div className="min-h-screen bg-black p-6">
      {/* <h1 className="text-3xl text-center font-semibold text-green-400 mb-8">
        All User Profiles
      </h1> */}

      <div className="w-full h-full p-4 text-center flex justify-evenly items-center text-white font-semibold ">
        <button className="text-green-400 border-2 border-green-400 rounded-xl text-3xl" onClick={() => navigate("/admin/dashboard")}><GoHomeFill /></button>
        <span className="text-green-300 text-2xl">All User Profile</span>
      </div>

      {users.length === 0 ? (
        <p className="text-center text-gray-600">No users found.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition-transform transform hover:-translate-y-1"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {user.firstName} {user.lastName} ({user.role})
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Phone:</span> {user.phone || "-"}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Skills:</span> {user.skills || "-"}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Area of Interest:</span> {user.areaOfInterest || "-"}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Batch:</span> {user.batch || "-"}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Interview Exp Status:</span> {user.resumeStatus || "-"}
              </p>

              {user.resumeUrl && (
                <p className="mb-2">
                  <a
                    href={`https://smrtalumnicon.onrender.com${user.resumeUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    View Interview Exp
                  </a>
                </p>
              )}

              <button
                onClick={() => deleteUser(user._id)}
                className="mt-3 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Delete User
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserProfilesPage;
