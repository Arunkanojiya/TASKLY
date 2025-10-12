import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Users, FileText, Home, Menu, X, LogOut, UserCircle } from "lucide-react";

const menuItems = [
  { text: "Dashboard", path: "/admin", icon: <Home className="w-5 h-5" /> },
  { text: "Manage Users", path: "/admin/users", icon: <Users className="w-5 h-5" /> },
  { text: "All Tasks", path: "/admin/tasks", icon: <FileText className="w-5 h-5" /> },
  { text: "Profile", path: "/admin/profile", icon: <UserCircle className="w-5 h-5" /> },
];

const AdminSidebar = ({ admin }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const username = admin?.name || "Admin";
  const initial = username.charAt(0).toUpperCase();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
  }, [mobileOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  const renderMenuItems = (isMobile = false) => (
    <ul className="space-y-2">
      {menuItems.map(({ text, path, icon }) => (
        <li key={text}>
          <NavLink
            to={path}
            className={({ isActive }) =>
              [
                "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                isActive || location.pathname === path
                  ? "bg-purple-100 text-purple-600"
                  : "text-gray-700 hover:bg-purple-50 hover:text-purple-600",
                isMobile ? "justify-start" : "",
              ].join(" ")
            }
            onClick={() => setMobileOpen(false)}
          >
            <span>{icon}</span>
            <span className="flex-1">{text}</span>
          </NavLink>
        </li>
      ))}
      <li>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </li>
    </ul>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col h-screen w-64 bg-white shadow-md border-r border-gray-100">
        <div className="p-5 border-b border-purple-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
            {initial}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Hey, {username}</h2>
            <p className="text-sm text-purple-500 font-medium">Admin Panel</p>
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col overflow-y-auto space-y-6">
          {renderMenuItems()}
        </div>
      </div>

      {/* Mobile Sidebar */}
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200 lg:hidden"
        >
          <Menu className="w-5 h-5 text-purple-600" />
        </button>
      )}

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex flex-col w-64 bg-white shadow-xl p-4 h-full border-r border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-purple-600">Menu</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-gray-700 hover:text-purple-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                {initial}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Hey, {username}</h2>
                <p className="text-sm text-purple-500 font-medium">Admin Panel</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">{renderMenuItems(true)}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
