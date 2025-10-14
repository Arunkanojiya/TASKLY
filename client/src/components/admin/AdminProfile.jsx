import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import axios from "../../utils/axiosSetup";
import { useNavigate } from "react-router-dom";
import { UserCircle, Lock, Save, Shield, LogOut, ChevronLeft } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const personalFields = [
  { name: "name", type: "text", placeholder: "Name", icon: UserCircle },
  { name: "email", type: "email", placeholder: "Email", icon: UserCircle },
];

const securityFields = [
  { name: "current", placeholder: "Current Password" },
  { name: "new", placeholder: "New Password" },
  { name: "confirm", placeholder: "Confirm Password" },
];

const AdminProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [profile, setProfile] = useState({ name: "", email: "" });
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });
  const [loading, setLoading] = useState(true);

  // Fetch admin
  const fetchAdmin = async () => {
    try {
      const res = await axios.get("https://taskly-7s40.onrender.com/api/admin/me", { headers });
      if (res.data.admin) setProfile({ name: res.data.admin.name, email: res.data.admin.email });
    } catch (err) {
      toast.error("Failed to load profile");
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) navigate("/login");
    fetchAdmin();
  }, []);

  // Save profile
  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("http://localhost:2000/api/admin/me", profile, { headers });
      if (res.data.success) toast.success("Profile updated successfully");
      else toast.error(res.data.message || "Failed to update");
    } catch (err) {
      toast.error(err.response?.data?.message || "Profile update failed");
    }
  };

  // Change password
  const changePassword = async (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) return toast.error("Passwords do not match");
    try {
      const res = await axios.put("http://localhost:2000/api/admin/password", { oldPassword: password.current, newPassword: password.new }, { headers });
      if (res.data.success) {
        toast.success("Password changed successfully");
        setPassword({ current: "", new: "", confirm: "" });
      } else toast.error(res.data.message || "Password change failed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <ToastContainer position="top-center" autoClose={3000} />
      <AdminSidebar admin={{ name: profile.name }} />

      <div className="flex-1 p-6">
        <button className="mb-6 flex items-center gap-1 text-purple-600 font-medium" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-5 h-5" /> Back
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Profile</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <section className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-purple-500" /> Personal Information
            </h2>
            <form className="space-y-4" onSubmit={saveProfile}>
              {personalFields.map(({ name, type, placeholder, icon: Icon }) => (
                <div key={name} className="flex items-center gap-2 border border-gray-300 rounded-md p-2">
                  <Icon className="text-purple-500 w-5 h-5" />
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={profile[name]}
                    onChange={(e) => setProfile({ ...profile, [name]: e.target.value })}
                    className="w-full focus:outline-none text-sm"
                    required
                  />
                </div>
              ))}
              <button type="submit" className="w-full bg-purple-100 text-purple-600 py-2 rounded-md hover:bg-purple-200 flex items-center justify-center">
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </button>
            </form>
          </section>

          {/* Security */}
          <section className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-500" /> Security
            </h2>
            <form className="space-y-4" onSubmit={changePassword}>
              {securityFields.map(({ name, placeholder }) => (
                <div key={name} className="flex items-center gap-2 border border-gray-300 rounded-md p-2">
                  <Lock className="w-5 h-5 text-purple-500" />
                  <input
                    type="password"
                    placeholder={placeholder}
                    value={password[name]}
                    onChange={(e) => setPassword({ ...password, [name]: e.target.value })}
                    className="w-full focus:outline-none text-sm"
                    required
                  />
                </div>
              ))}
              <button type="submit" className="w-full bg-purple-100 text-purple-600 py-2 rounded-md hover:bg-purple-200 flex items-center justify-center">
                <Shield className="w-4 h-4 mr-2" /> Change Password
              </button>

              <div className="mt-6 border-t pt-4">
                <button className="w-full bg-red-100 text-red-600 py-2 rounded-md hover:bg-red-200 flex items-center justify-center" onClick={() => { localStorage.clear(); navigate("/login"); }}>
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
