import React, { useState } from "react";
import axios from "axios";

function AlumniSignup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    batch: "",
    phone: "",
    skills: "",
    areaOfInterest: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= SEND OTP ================= */
  const sendOtp = async () => {
    try {
      const res = await axios.post(
        "https://smrtalumnicon.onrender.com/api/auth/send-otp",
        { email: formData.email }
      );
      alert(res.data.message);
      setOtpSent(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  /* ================= VERIFY OTP ================= */
  const verifyOtp = async () => {
    try {
      const res = await axios.post(
        "https://smrtalumnicon.onrender.com/api/auth/verify-otp",
        { email: formData.email, otp }
      );
      alert(res.data.message);
      setEmailVerified(true);
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  /* ================= REGISTER ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailVerified) {
      alert("Please verify your email first");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "https://smrtalumnicon.onrender.com/api/auth/register",
        {
          ...formData,
          role: "alumni",
        }
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-400 to-gray-200 px-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 max-w-2xl w-full">
        <h1 className="text-white text-3xl font-semibold text-center mb-4">
          Alumni Sign Up
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-100 rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 border-2 border-blue-300"
        >
          {/* Inputs */}
          <input
            name="firstName"
            placeholder="First Name"
            onChange={handleChange}
            required
            className="input"
          />
          <input
            name="lastName"
            placeholder="Last Name"
            onChange={handleChange}
            required
            className="input"
          />
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="input col-span-2"
          />

          {/* OTP Section */}
          {!emailVerified && (
            <>
              <button
                type="button"
                onClick={sendOtp}
                className="col-span-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full transition"
              >
                Validate Email
              </button>

              {otpSent && (
                <>
                  <input
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="input col-span-2"
                  />
                  <button
                    type="button"
                    onClick={verifyOtp}
                    className="col-span-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-full transition"
                  >
                    Verify OTP
                  </button>
                </>
              )}
            </>
          )}

          <input
            name="batch"
            placeholder="Batch (25-26)"
            onChange={handleChange}
            required
            className="input"
          />
          <input
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            required
            className="input"
          />
          <input
            name="skills"
            placeholder="Skills (comma separated)"
            onChange={handleChange}
            className="input"
          />
          <input
            name="areaOfInterest"
            placeholder="Area of Interest"
            onChange={handleChange}
            className="input"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="input"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
            className="input"
          />

          <button
            type="submit"
            className="col-span-2 bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-full text-lg transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default AlumniSignup;
