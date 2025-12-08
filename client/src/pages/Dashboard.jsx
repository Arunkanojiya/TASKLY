import React, { useMemo, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import TaskItem from "../components/TaskItem";
import TaskModal from "../components/TaskModal";
import { PlusCircle } from "lucide-react";

const Dashboard = () => {
  const { tasks = [], refreshTasks = () => { } } = useOutletContext();
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const stats = useMemo(() => ({
    total: tasks.length,
    low: tasks.filter(t => t.priority?.toLowerCase() === "low").length,
    medium: tasks.filter(t => t.priority?.toLowerCase() === "medium").length,
    high: tasks.filter(t => t.priority?.toLowerCase() === "high").length,
    completed: tasks.filter(t => t.completed).length,
  }), [tasks]);

  const filteredTasks = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 7);
    return tasks.filter(task => {
      const dueDate = task.dueDate ? new Date(task.dueDate) : null;
      switch (filter) {
        case "today": return dueDate && dueDate.toDateString() === today.toDateString();
        case "week": return dueDate && dueDate >= today && dueDate <= nextWeek;
        case "high": case "medium": case "low": return task.priority?.toLowerCase() === filter;
        default: return true;
      }
    });
  }, [tasks, filter]);

  const handleSave = useCallback(async (taskData) => {
    try {
      if (taskData._id) {
        await fetch(`https://taskly-7s40.onrender.com/api/tasks/${taskData._id}/gp`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify(taskData),
        });
      } else {
        await fetch(`https://taskly-7s40.onrender.com/api/tasks/gp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify(taskData),
        });
      }

      setShowModal(false);
      setSelectedTask(null);
      refreshTasks();
    } catch (err) {
      console.error(err);
    }
  }, [refreshTasks]);

  const handleEdit = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            Task Overview
            <span className="text-purple-500">
              {/* Optional small icon next to title */}
            </span>
          </h1>
          <p className="text-gray-500 mt-1">Manage your tasks efficiently</p>
        </div>
        <button
          onClick={() => { setSelectedTask(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white px-5 py-2 rounded-lg shadow hover:shadow-lg transition-transform transform hover:-translate-y-1"
        >
          <PlusCircle size={20} />
          Add Task
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {[{ label: "Total", value: stats.total, color: "text-gray-800", bg: "bg-white" },
        { label: "Low", value: stats.low, color: "text-green-700", bg: "bg-green-50" },
        { label: "Medium", value: stats.medium, color: "text-yellow-700", bg: "bg-yellow-50" },
        { label: "High", value: stats.high, color: "text-red-700", bg: "bg-red-50" },
        { label: "Completed", value: stats.completed, color: "text-indigo-700", bg: "bg-indigo-50" }].map(stat => (
          <div key={stat.label} className={`${stat.bg} rounded-2xl shadow p-4 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-200`}>
            <div className={`text-sm font-medium uppercase ${stat.color}`}>{stat.label}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {["all", "today", "week", "high", "medium", "low"].map(f => (
          <button
            key={f}
            className={`px-4 py-2 rounded-full font-medium text-sm transition ${filter === f ? "bg-purple-600 text-white shadow" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            onClick={() => setFilter(f)}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-gray-500 py-10 text-center text-lg">No tasks found</div>
        ) : (
          filteredTasks.map(task => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              onRefresh={refreshTasks}
              onEdit={handleEdit}
            />
          ))
        )}
      </div>

      {/* Task Modal */}
      {showModal && (
        <TaskModal
          isOpen={showModal}
          onClose={() => { setShowModal(false); setSelectedTask(null); }}
          onSave={handleSave}
          taskToEdit={selectedTask}
        />
      )}
    </div>
  );
};

export default Dashboard;
