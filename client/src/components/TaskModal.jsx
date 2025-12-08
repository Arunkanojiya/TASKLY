import React, { useEffect, useState, useRef } from "react";
import { Save, PlusCircle, X } from "lucide-react";

const TaskModal = ({ isOpen, onClose, taskToEdit, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("In Progress");
  const [loading, setLoading] = useState(false);
  const titleRef = useRef(null);

  // Autofocus input when modal opens
  useEffect(() => {
    if (isOpen && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isOpen]);

  // Populate fields if editing
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || "");
      setDescription(taskToEdit.description || "");
      setPriority(taskToEdit.priority || "Low");
      setDueDate(taskToEdit.dueDate ? taskToEdit.dueDate.split("T")[0] : "");
      setStatus(taskToEdit.completed ? "Completed" : "In Progress");
    } else {
      setTitle("");
      setDescription("");
      setPriority("Low");
      setDueDate("");
      setStatus("In Progress");
    }
  }, [taskToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a task title!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        _id: taskToEdit?._id,
        title,
        description,
        priority,
        dueDate,
        completed: status === "Completed",
      };
      await onSave(payload);
      onClose();
    } catch (err) {
      console.error("Error saving task:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transform animate-fadeInScale">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {taskToEdit ? (
              <>
                <Save className="w-5 h-5 text-purple-500" />
                Edit Task
              </>
            ) : (
              <>
                <PlusCircle className="w-5 h-5 text-purple-500" />
                Add New Task
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-purple-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title
            </label>
            <input
              ref={titleRef}
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Add task details (optional)"
            />
          </div>

          {/* Priority & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2.5 px-4 rounded-lg transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading ? "Saving..." : taskToEdit ? "Update Task" : "Add Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
