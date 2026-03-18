import React, { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    // 🔹 Validation
    if (!email || !newPassword || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://smrtalumnicon.onrender.com/api/auth/forgot-password",
        {
          email: email.trim(),
          newPassword: newPassword.trim(),
        }
      );

      alert(res.data.message);

      // 🔹 Clear fields after success
      setEmail("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err) {
      console.log("FULL ERROR:", err.response || err);

      alert(
        err.response?.data?.message ||
        err.message ||
        "Error resetting password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-[350px]">
        <h2 className="text-2xl font-bold text-center mb-5">
          Forgot Password
        </h2>

        {/* Email */}
        <label className="text-xs font-bold">EMAIL</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mt-1 mb-3 px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-sky-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* New Password */}
        <label className="text-xs font-bold">NEW PASSWORD</label>
        <input
          type="password"
          placeholder="Enter new password"
          className="w-full mt-1 mb-3 px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-sky-400"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        {/* Confirm Password */}
        <label className="text-xs font-bold">CONFIRM PASSWORD</label>
        <input
          type="password"
          placeholder="Confirm new password"
          className="w-full mt-1 mb-4 px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-sky-400"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full bg-sky-400 hover:bg-sky-500 py-2 rounded font-bold text-white disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;