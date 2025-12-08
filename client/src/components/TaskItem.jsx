import React, { useState, useEffect } from "react";
import { Calendar, CheckCircle2, Clock, MoreVertical } from "lucide-react";
import { format, isToday } from "date-fns";
import axios from "axios";

const API_BASE = "https://taskly-7s40.onrender.com/api/tasks";

const getPriorityBadgeColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case "low": return "bg-green-100 text-green-700";
    case "medium": return "bg-yellow-100 text-yellow-700";
    case "high": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

const TaskItem = ({ task, onRefresh, onEdit }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isCompleted, setIsCompleted] = useState(task.completed || false);

  useEffect(() => {
    setIsCompleted(task.completed || false);
  }, [task.completed]);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`
  });

  const handleToggleComplete = async () => {
    const newStatus = !isCompleted;
    setIsCompleted(newStatus);
    try {
      await axios.put(`${API_BASE}/${task._id}/gp`, {
        completed: newStatus
      }, { headers: getAuthHeaders() });
      onRefresh?.();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md flex justify-between items-start gap-4 hover:shadow-lg transition">
      <div className="flex gap-3 flex-1 items-start">
        <button
          onClick={handleToggleComplete}
          className={`p-1 ${isCompleted ? "text-green-500" : "text-gray-300"}`}
        >
          <CheckCircle2 size={20} className={`${isCompleted ? "fill-green-500" : ""}`} />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h3 className={`font-semibold text-lg ${isCompleted ? "text-gray-400 line-through" : "text-gray-800"}`}>
              {task.title}
            </h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>

          {task.description && <p className="text-gray-500 mt-1 text-sm">{task.description}</p>}

          {/* Status Badge */}
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isCompleted ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
              {isCompleted ? "Completed" : "In Progress"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 items-end">
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="p-1 rounded hover:bg-purple-50 transition">
            <MoreVertical size={18} />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-purple-100 z-50 overflow-hidden">
              <button
                onClick={() => { onEdit?.(task); setShowMenu(false); }}
                className="w-full text-left px-3 py-2 hover:bg-purple-50 text-sm"
              >
                Edit
              </button>
              <button
                onClick={async () => {
                  try {
                    await axios.delete(`${API_BASE}/${task._id}/gp`, { headers: getAuthHeaders() });
                    onRefresh?.();
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="w-full text-left px-3 py-2 hover:bg-red-50 text-sm text-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="text-gray-500 text-xs flex flex-col gap-1 items-end">
          <div className="flex items-center gap-1">
            <Calendar size={12} />{" "}
            {task.dueDate
              ? isToday(new Date(task.dueDate))
                ? "Today"
                : format(new Date(task.dueDate), "MMM dd")
              : "-"}
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} />{" "}
            {task.createdAt ? format(new Date(task.createdAt), "MMM dd") : "-"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
