// src/pages/admin/AllTasks.jsx
import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import axios from "../../utils/axiosSetup";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

const AllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const getHeaders = () => ({ Authorization: `Bearer ${token}` });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://taskly-7s40.onrender.com/api/admin/tasks", { headers: getHeaders() });
      setTasks(res.data.tasks || res.data.data || res.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch Tasks Error:", err.response?.data || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) navigate("/login");
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`https://taskly-7s40.onrender.com/api/tasks/${id}`, { headers: getHeaders() });
      fetchTasks();
    } catch (err) {
      console.error("Delete Task Error:", err.response?.data || err.message);
    }
  };

  // ✅ Filter tasks by title, description, owner name or email
  const filteredTasks = tasks.filter((t) => {
    const searchLower = search.toLowerCase();
    return (
      t.title?.toLowerCase().includes(searchLower) ||
      t.description?.toLowerCase().includes(searchLower) ||
      t.owner?.name?.toLowerCase().includes(searchLower) ||
      t.owner?.email?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar admin={{ name: "Admin" }} />

      <div className="flex-1 p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">All Tasks</h1>
          <p className="text-gray-500 text-sm">View and manage all tasks</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by title, description, owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>

        {loading && <p className="text-gray-500 text-center mt-20">Loading tasks...</p>}

        {!loading && filteredTasks.length === 0 && (
          <p className="text-gray-500 text-center mt-10 bg-white p-4 rounded-lg shadow">
            No tasks found.
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="p-4 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{task.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Owner: <span className="font-medium">{task.owner?.name}</span> ({task.owner?.email})
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    task.priority === "High"
                      ? "bg-red-100 text-red-600"
                      : task.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {task.priority || "Low"} Priority
                </span>

                <button
                  onClick={() => handleDelete(task._id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>

              <div className="mt-2">
                {task.completed ? (
                  <span className="text-green-600 font-semibold text-sm">Completed</span>
                ) : (
                  <span className="text-gray-600 font-semibold text-sm">Active</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllTasks;
