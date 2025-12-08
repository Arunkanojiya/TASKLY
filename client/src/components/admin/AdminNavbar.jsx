import React from 'react';
import { LogOut } from 'lucide-react';

const AdminNavbar = ({ admin, onLogout }) => {
  return (
    <div className="w-full bg-white shadow-md px-6 py-3 flex justify-between items-center border-b border-gray-100">
      <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>

      <div className="flex items-center gap-4">
        <span className="text-gray-700 font-medium">{admin.name}</span>
        <button
          onClick={onLogout}
          className="flex items-center gap-1 text-red-500 hover:text-red-600 font-medium"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;
