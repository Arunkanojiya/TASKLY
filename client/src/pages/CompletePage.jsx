import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskItem from "../components/TaskItem";
import TaskModal from "../components/TaskModal";

const API_BASE = "https://taskly-7s40.onrender.com/api/tasks";

const CompletePage = ({ onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [error, setError] = useState(null);

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/gp`, { headers: getHeaders() });
      setTasks(res.data?.tasks || res.data || []);
    } catch (err) {
      console.error("Fetch tasks error:", err);
      if (err.response?.status === 401) onLogout?.();
      else setError("Failed to load completed tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleEditTask = (task) => {
    setEditTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditTask(null);
    setShowModal(false);
    fetchTasks();
  };

  // ✅ Save or update task logic
  const handleSave = async (taskData) => {
    try {
      if (taskData._id) {
        await axios.put(`${API_BASE}/${taskData._id}/gp`, taskData, {
          headers: getHeaders(),
        });
      } else {
        await axios.post(`${API_BASE}/gp`, taskData, {
          headers: getHeaders(),
        });
      }
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  const completedTasks = tasks.filter((t) => {
    if (typeof t.completed === "boolean") return t.completed;
    if (typeof t.completed === "string")
      return ["completed", "true", "yes"].includes(t.completed.toLowerCase());
    if (typeof t.completed === "number") return t.completed === 1;
    return false;
  });

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">Completed Tasks</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all"
        >
          + Add Task
        </button>
      </div>

      {completedTasks.length === 0 ? (
        <div className="text-gray-500 text-center py-10">
          No completed tasks yet.
        </div>
      ) : (
        completedTasks.map((task) => (
          <TaskItem
            key={task._id || task.id}
            task={task}
            onRefresh={fetchTasks}
            onLogout={onLogout}
            onEdit={handleEditTask}
            showCompleteChecbox={false}
          />
        ))
      )}

      {showModal && (
        <TaskModal
          isOpen={showModal}
          onClose={handleCloseModal}
          taskToEdit={editTask}
          onSave={handleSave}
          onLogout={onLogout}
        />
      )}
    </div>
  );
};

export default CompletePage;
