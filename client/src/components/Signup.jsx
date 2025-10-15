import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const API_URL = 'https://taskly-7s40.onrender.com';

const Signup = ({ onSubmit, onSwitchMode }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success && data.token) {
        onSubmit({ user: data.user, token: data.token });
        toast.success('Signup successful!');
      } else {
        toast.error(data.message || 'Signup failed!');
      }
    } catch {
      toast.error('Server error. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white px-4 py-12">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">Create Account</h2>

        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-sm font-medium"
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
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
