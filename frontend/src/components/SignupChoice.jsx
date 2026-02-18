import React from "react";
import { useNavigate } from "react-router-dom";

function SignupChoice() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-gray-400 to-gray-300 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg flex flex-col items-center justify-center p-8">
        <h1 className="text-white text-4xl mb-8 font-bold">Sign up</h1>

        <div className="bg-gray-200 rounded-lg w-64 p-6 flex flex-col items-center">
          <button
            className="w-full bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 rounded-full transition"
            onClick={() => navigate("/signup/student")}
          >
            Are you Student?
          </button>

          {/* OR Divider */}
          <div className="flex items-center w-full my-4 text-sm text-gray-600">
            <span className="flex-1 h-px bg-gray-400"></span>
            <p className="mx-2">or</p>
            <span className="flex-1 h-px bg-gray-400"></span>
          </div>

          <button
            className="w-full bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 rounded-full transition"
            onClick={() => navigate("/signup/alumni")}
          >
            Are you Alumni?
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupChoice;
