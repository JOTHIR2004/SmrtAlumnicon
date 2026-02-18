import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleAdminLogin = async () => {
    if (!username || !password) {
      alert("Enter admin username and password");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { username, password }
      );

      alert(res.data.message);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        alert("Not authorized as admin");
      }
    } catch (err) {
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Server error");
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center
                    bg-gradient-to-r from-gray-400 to-gray-200 relative">

      {/* Card */}
      <div className="w-3/4 max-w-4xl h-[420px] bg-gray-700 rounded-xl
                      flex shadow-2xl
                      md:flex-row flex-col">

        {/* Left Side */}
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold tracking-widest text-center">
            ADMIN <br /> LOGIN
          </h1>
        </div>

        {/* Right Side */}
        <div
          className="w-full md:w-[300px] bg-gray-200 rounded-xl
                     m-6 p-6 flex flex-col"
        >
          <label className="text-xs font-bold mt-2">
            ADMIN USERNAME
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-8 mt-1 px-4 rounded-full outline-none"
          />

          <label className="text-xs font-bold mt-4">
            PASSWORD
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-8 mt-1 px-4 rounded-full outline-none"
          />

          <button
            onClick={handleAdminLogin}
            className="mt-6 bg-sky-400 hover:bg-sky-500
                       rounded-full py-2 font-bold transition"
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
