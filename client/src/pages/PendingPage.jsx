import React from "react";
import { useOutletContext } from "react-router-dom";
import TaskItem from "../components/TaskItem";

const PendingPage = ({ onLogout }) => {
  const {
    tasks = [],
    refreshTasks = () => {},
    handleEditTask,     // from Layout.jsx
    setShowModal,       // from Layout.jsx
  } = useOutletContext();

  const pendingTasks = tasks.filter((t) => {
    if (typeof t.completed === "boolean") return !t.completed;
    if (typeof t.completed === "string")
      return !["completed", "true", "yes"].includes(t.completed.toLowerCase());
    if (typeof t.completed === "number") return t.completed !== 1;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">Pending Tasks</h1>
        <button
          onClick={() => {
            handleEditTask(null); // Clear current task and show modal
            setShowModal(true);
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all"
        >
          + Add Task
        </button>
      </div>

      {pendingTasks.length === 0 ? (
        <div className="text-gray-500 text-center py-10">
          No pending tasks! 🎉
        </div>
      ) : (
        pendingTasks.map((task) => (
          <TaskItem
            key={task._id || task.id}
            task={task}
            onRefresh={refreshTasks}
            onLogout={onLogout}
            onEdit={handleEditTask} // ✅ opens modal via Layout context
          />
        ))
      )}
    </div>
  );
};

export default PendingPage;
