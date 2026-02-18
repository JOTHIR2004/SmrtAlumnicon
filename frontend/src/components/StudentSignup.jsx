import React, { useState } from "react";
import axios from "axios";

function StudentSignup() {
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

  const sendOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/send-otp", {
        email: formData.email,
      });
      alert(res.data.message);
      setOtpSent(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email: formData.email,
        otp,
      });
      alert(res.data.message);
      setEmailVerified(true);
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

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
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        ...formData,
        role: "student",
      });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-400 to-gray-200 flex justify-center items-center p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl p-8">
        <h1 className="text-3xl text-white font-semibold mb-6 text-center">
          Student Sign Up
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-100 p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Name Fields */}
          <input
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="p-3 rounded-md border border-gray-300"
            required
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="p-3 rounded-md border border-gray-300"
            required
          />

          {/* Email & OTP */}
          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="p-3 rounded-md border border-gray-300"
            required
          />

          {!emailVerified && (
            <>
              <button
                type="button"
                onClick={sendOtp}
                className="bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors w-full md:col-span-2"
              >
                Validate Email
              </button>

              {otpSent && (
                <>
                  <input
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="p-3 rounded-md border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={verifyOtp}
                    className="bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition-colors w-full md:col-span-2"
                  >
                    Verify OTP
                  </button>
                </>
              )}
            </>
          )}

          {/* Batch, Phone, Skills, Interests */}
          <input
            name="batch"
            placeholder="Batch (25-26)"
            value={formData.batch}
            onChange={handleChange}
            className="p-3 rounded-md border border-gray-300"
            required
          />
          <input
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="p-3 rounded-md border border-gray-300"
            required
          />
          <input
            name="skills"
            placeholder="Skills (comma separated)"
            value={formData.skills}
            onChange={handleChange}
            className="p-3 rounded-md border border-gray-300"
          />
          <input
            name="areaOfInterest"
            placeholder="Area of Interest"
            value={formData.areaOfInterest}
            onChange={handleChange}
            className="p-3 rounded-md border border-gray-300"
          />

          {/* Password Fields */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="p-3 rounded-md border border-gray-300"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="p-3 rounded-md border border-gray-300"
            required
          />

          {/* Submit */}
          <button
            type="submit"
            className="bg-purple-500 text-white py-3 px-4 rounded-md hover:bg-purple-600 transition-colors w-full md:col-span-2 mt-2"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default StudentSignup;
