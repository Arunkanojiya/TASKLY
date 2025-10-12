// src/components/Layout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import UserSidebar from "../components/Sidebar";
import TaskModal from "./TaskModal"; // Make sure this path is correct

const Layout = ({ user, onLogout, tasks, refreshTasks }) => {
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Called when editing a task or adding a new one
  const handleEditTask = (task) => {
    setEditTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditTask(null);
    setShowModal(false);
  };

  const handleSave = async (taskData) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      if (taskData._id) {
        await fetch(`http://localhost:2000/api/tasks/${taskData._id}/gp`, {
          method: "PUT",
          headers,
          body: JSON.stringify(taskData),
        });
      } else {
        await fetch(`http://localhost:2000/api/tasks/gp`, {
          method: "POST",
          headers,
          body: JSON.stringify(taskData),
        });
      }

      handleCloseModal();
      refreshTasks();
    } catch (err) {
      console.error("Failed to save task", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity md:hidden ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <UserSidebar
        user={user}
        tasks={tasks}
        className={`fixed z-50 top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col md:pl-64">
        <Navbar user={user} onLogout={onLogout} />

        <main className="p-6 flex-1 overflow-y-auto relative">
          <Outlet
            context={{
              tasks,
              refreshTasks,
              handleEditTask,
              setShowModal,
              sidebarOpen,
              setSidebarOpen,
            }}
          />
        </main>
      </div>

      {/* Global Modal for Add/Edit Task */}
      {showModal && (
        <TaskModal
          isOpen={showModal}
          onClose={handleCloseModal}
          taskToEdit={editTask}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Layout;
