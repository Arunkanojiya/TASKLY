import React from 'react';
import { Edit, Trash2, CheckCircle } from 'lucide-react';

const TaskTable = ({ tasks, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white border border-purple-100 rounded-xl shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-purple-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Title</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Priority</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Due Date</th>
            <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Completed</th>
            <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                No tasks found.
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task._id || task.id}>
                <td className="px-4 py-2">{task.title}</td>
                <td className="px-4 py-2 capitalize">{task.priority}</td>
                <td className="px-4 py-2">{new Date(task.dueDate).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-center">
                  {task.completed ? <CheckCircle className="w-5 h-5 text-green-500 inline" /> : '-'}
                </td>
                <td className="px-4 py-2 text-center flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(task)}
                    className="text-blue-500 hover:text-blue-600"
                    title="Edit Task"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(task._id)}
                    className="text-red-500 hover:text-red-600"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
