import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import axios from "../../utils/axiosSetup";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, UserCheck, Ban, PlusCircle } from "lucide-react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const getHeaders = () => ({ Authorization: `Bearer ${token}` });

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://taskly-7s40.onrender.com/api/admin/users", { headers: getHeaders() });
      const allUsers = res.data.users || res.data;
      const normalUsers = allUsers.filter(
        (u) =>
          u.role?.toLowerCase() !== "admin" &&
          u.role?.toLowerCase() !== "superadmin"
      );
      setUsers(normalUsers);
    } catch (err) {
      console.error("Fetch Users Error:", err);
    }
  };

  useEffect(() => {
    if (!token) navigate("/login");
    fetchUsers();
  }, []);

  const toggleBlock = async (userId, currentStatus) => {
    try {
      const url = currentStatus
        ? `http://localhost:2000/api/admin/user/unblock/${userId}`
        : `http://localhost:2000/api/admin/user/block/${userId}`;
      await axios.put(url, {}, { headers: getHeaders() });
      fetchUsers();
    } catch (err) {
      console.error("Block/Unblock Error:", err);
    }
  };

  const handleChange = (e) => setNewUser({ ...newUser, [e.target.name]: e.target.value });

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:2000/api/admin/users", newUser, { headers: getHeaders() });
      setNewUser({ name: "", email: "", password: "" });
      setShowAddForm(false);
      fetchUsers();
    } catch (err) {
      console.error("Add User Error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar admin={{ name: "Admin" }} />

      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-purple-500" /> Manage Users
          </h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-600 rounded-md hover:bg-purple-200 transition"
          >
            <PlusCircle size={16} /> Add User
          </button>
        </div>

        {/* Add User Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200 shadow-sm max-w-2xl">
            <form onSubmit={handleAddUser} className="grid gap-3 md:grid-cols-3">
              <input
                type="text"
                name="name"
                value={newUser.name}
                onChange={handleChange}
                placeholder="Name"
                className="p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-200"
                required
              />
              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleChange}
                placeholder="Email"
                className="p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-200"
                required
              />
              <input
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleChange}
                placeholder="Password"
                className="p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-200"
                required
              />
              <div className="md:col-span-3 flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded-md bg-purple-100 text-purple-600 hover:bg-purple-200 transition"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users Table */}
<div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
  <table className="min-w-full text-sm text-gray-700">
    <thead className="bg-purple-50 text-purple-600">
      <tr>
        <th className="py-3 px-4 text-left rounded-tl-lg">Name</th>
        <th className="py-3 px-4 text-left">Email</th>
        <th className="py-3 px-4 text-left">Status</th>
        <th className="py-3 px-4 text-left rounded-tr-lg">Action</th>
      </tr>
    </thead>
    <tbody>
      {users.map((user, idx) => (
        <tr
          key={user._id}
          className={`transition hover:bg-purple-50 ${
            idx % 2 === 0 ? "bg-white" : "bg-gray-50"
          }`}
        >
          <td className="py-3 px-4 font-medium">{user.name}</td>
          <td className="py-3 px-4">{user.email}</td>
          <td className="py-3 px-4">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.isBlocked || user.blocked
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {user.isBlocked || user.blocked ? "Blocked" : "Active"}
            </span>
          </td>
          <td className="py-3 px-4">
            <button
              onClick={() =>
                toggleBlock(user._id, user.isBlocked || user.blocked)
              }
              className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                user.isBlocked || user.blocked
                  ? "bg-green-100 text-green-600 hover:bg-green-200"
                  : "bg-red-100 text-red-600 hover:bg-red-200"
              }`}
            >
              {user.isBlocked || user.blocked ? "Unblock" : "Block"}
            </button>
          </td>
        </tr>
      ))}
      {users.length === 0 && (
        <tr>
          <td colSpan="4" className="py-4 text-center text-gray-400 italic">
            No regular users found
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>
      </div>
    </div>
  );
};

export default ManageUsers;
