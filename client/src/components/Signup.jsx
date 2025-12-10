import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import OtpVerification from "./OtpVerification";

const API_URL = 'https://taskly-1i5r.onrender.com/api/users';


const Signup = ({ onSubmit, onSwitchMode }) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [otpRequired, setOtpRequired] = useState(false);
  const [userId, setUserId] = useState(null);

  // Handle input changes
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/send-otp-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "OTP sent successfully!");
        setUserId(data.userId);
        setOtpRequired(true);
      } else {
        toast.error(data.message || "Signup failed!");
      }
    } catch (err) {
      console.error("Signup Error:", err);
      toast.error("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Show OTP verification form if required
  if (otpRequired) {
    return (
      <OtpVerification
        userId={userId}
        email={formData.email}
        onVerified={() =>
          onSubmit({ user: { email: formData.email }, token: "dummy" })
        }
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white px-4 py-12">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Create Account
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
            autoComplete="name"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
            autoComplete="email"
          />

          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            className="text-purple-600 font-medium cursor-pointer hover:underline"
            onClick={onSwitchMode}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
