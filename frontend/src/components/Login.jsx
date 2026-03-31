import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "https://smrtalumnicon.onrender.com/api/auth/login",
        { username, password }
      );

      alert(res.data.message);

      const user = res.data.user;
      localStorage.setItem("user", JSON.stringify(user));

      //  Role-based redirect
      if(user.role == "admin"){
        navigate("/admin/dashboard");
      }
      else if (user.role === "student") {
        navigate("/student/home");
      } else if (user.role === "alumni") {
        navigate("/alumni/home");
      } else {
        alert("Invalid role");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-gray-400 to-gray-200 flex items-center justify-center relative">
      
      {/* MAIN CARD */}
      <div className="w-[75%] p-5 max-w-5xl h-[420px] bg-[#3f4447] rounded-xl shadow-2xl flex md:flex-row flex-col overflow-hidden">

        {/* LEFT */}
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl tracking-widest font-semibold">
            LOGIN
          </h1>
        </div>

        {/* RIGHT */}
        <div className="bg-gray-200 rounded-xl md:m-10 m-6 p-6 w-[300px] max-w-full flex flex-col mx-auto">
          <label className="text-xs font-bold mt-2">USERNAME</label>
          <input
            type="text"
            className="h-8 mt-1 px-4 rounded-full outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label className="text-xs font-bold mt-3">PASSWORD</label>
          <input
            type="password"
            className="h-8 mt-1 px-4 rounded-full outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

           <span
              onClick={() => navigate("/forgot-password")}
              className="text-[11px] mt-2 cursor-pointer text-blue-600 hover:underline">
              Forgot password?
            </span>


          <button
            onClick={handleLogin}
            className="mt-3 bg-sky-400 hover:bg-sky-500 transition text-black font-bold rounded-full py-2"
          >
            LOGIN
          </button>

          <div className="text-center text-xs my-3">OR</div>

          <button
            onClick={() => navigate("/signup")}
            className="bg-[#3f4447] hover:bg-black transition text-white rounded-full py-2 text-sm"
          >
            Sign up for an account
          </button>
        </div>
      </div>

      /* {/* ADMIN BUTTON */}
      <button
        onClick={() => navigate("/admin")}
        className="absolute bottom-5 right-5 bg-sky-400 hover:bg-sky-500 transition px-5 py-2 rounded-full text-sm font-semibold"
      >
        ADMIN
      </button> */
    </div>
  );
}

export default Login;
