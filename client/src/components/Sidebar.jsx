import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Clock, CheckCircle2, LayoutDashboard } from "lucide-react";

const Sidebar = ({ user, tasks, className }) => {
  const location = useLocation();

  const menu = [
    { label: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
    { label: "Pending", path: "/pending", icon: <Clock size={18} /> },
    { label: "Completed", path: "/complete", icon: <CheckCircle2 size={18} /> },
  ];

  return (
    <aside
      className={`${className} flex flex-col p-6 bg-gradient-to-b from-white to-purple-50 shadow-lg rounded-xl border border-purple-100`}
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl mx-auto bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-2xl shadow-md">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="mt-3 font-semibold text-gray-800 text-lg">
          Hello, {user?.name?.split(" ")[0] || "User"} 👋
        </div>
        <div className="text-sm text-gray-500">Ready to manage your tasks?</div>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2">
        {menu.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                active
                  ? "bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-md scale-[1.02]"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-fuchsia-100 hover:text-purple-700"
              }`}
            >
              <span
                className={`${
                  active ? "text-white" : "text-purple-500 group-hover:text-purple-600"
                } transition-colors`}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-purple-100 text-center text-sm text-gray-600">
        <p className="mb-1 font-medium">Total Tasks</p>
        <p className="text-xl font-bold text-purple-700">{tasks?.length || 0}</p>
      </div>
    </aside>
  );
};

export default Sidebar;
