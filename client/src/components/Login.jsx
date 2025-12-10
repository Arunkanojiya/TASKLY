import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import OtpVerification from './OtpVerification';

const API_URL = 'https://taskly-1i5r.onrender.com/api/users';

const Login = ({ onSubmit, onSwitchMode }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [otpRequired, setOtpRequired] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      // If user not verified → OTP flow
      if (res.status === 403 && data.message === "Please verify your email first") {
        toast.info("Please verify your email. OTP sent!");
        if (data.userId) setUserId(data.userId); // <-- Important: save userId

        const otpRes = await fetch(`${API_URL}/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email }),
        });
        await otpRes.json();
        setOtpRequired(true);
        return;
      }

      if (!res.ok) {
        toast.error(data.message || 'Login failed!');
        return;
      }

      if (data.success && data.token) {
        toast.success('Login successful!');
        onSubmit({ user: data.user, token: data.token });
      } else {
        toast.error(data.message || 'Login failed!');
      }
    } catch (error) {
      toast.error('Server error. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (otpRequired) {
    return (
      <OtpVerification
        userId={userId}
        email={formData.email}
        onVerified={async () => {
          // Auto-login after OTP verification
          try {
            const res = await fetch(`${API_URL}/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok && data.success && data.token) {
              toast.success("Login successful!");
              onSubmit({ user: data.user, token: data.token });
            } else {
              toast.error(data.message || "Login failed after OTP");
            }
          } catch {
            toast.error("Server error after OTP");
          }
        }}
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
          Login to Your Account
        </h2>

        <div className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Your Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-sm font-medium"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <span
            className="text-purple-600 font-medium cursor-pointer hover:underline"
            onClick={onSwitchMode}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
