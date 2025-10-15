import React, { useEffect, useState, useRef } from "react";
import "./index.css";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import PendingPage from "./pages/PendingPage";
import CompletePage from "./pages/CompletePage";
import Profile from "./components/Profile";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import AllTasks from "./pages/admin/AllTasks";
import AdminProfile from "./components/admin/AdminProfile";

const API_URL = "https://taskly-7s40.onrender.com";
const API_TASKS = `${API_URL}/api/tasks`;

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const restoredOnceRef = useRef(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_TASKS}/gp`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success || Array.isArray(data)) {
        setTasks(data.tasks || data || []);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/users/me`, { headers: getAuthHeaders() });
        const data = await res.json();

        if (data.success && data.user && !cancelled) {
          const user = {
            id: data.user.id ?? data.user._id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            token,
            avatar: data.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.name || "User")}&background=random`,
          };
          setCurrentUser(user);
          localStorage.setItem("userId", user.id || "");
          localStorage.setItem("role", user.role || "user");

          if (!restoredOnceRef.current) {
            toast.success("Session restored!");
            restoredOnceRef.current = true;
          }

          // Fetch tasks after login restored
          fetchTasks();

          // Redirect if on login/signup
          if (location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/") {
            if (user.role === "admin") navigate("/admin", { replace: true });
            else navigate("/", { replace: true });
          }
        } else {
          localStorage.clear();
        }
      } catch (err) {
        console.error(err);
        localStorage.clear();
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    restoreSession();
    return () => { cancelled = true; };
    // eslint-disable-next-line
  }, []);

  const handleAuthSubmit = (data) => {
    if (!data || !data.user || !data.token) return;

    const user = {
      id: data.user.id ?? data.user._id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role || "user",
      token: data.token,
      avatar: data.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.name || "User")}&background=random`,
    };

    setCurrentUser(user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", user.id || "");
    localStorage.setItem("role", user.role || "user");

    fetchTasks(); // load tasks after login

    if (user.role === "admin" || user.role === "superadmin") navigate("/admin", { replace: true });
    else navigate("/", { replace: true });
  };

  const handleLogout = () => {
    localStorage.clear();
    setCurrentUser(null);
    setTasks([]);
    navigate("/login", { replace: true });
  };

  const UserRoute = ({ children }) =>
    !currentUser || (currentUser.role && currentUser.role !== "user") ? <Navigate to="/login" replace /> : children;

  const AdminRoute = ({ children }) =>
    !currentUser || (currentUser.role !== "admin" && currentUser.role !== "superadmin") ? <Navigate to="/login" replace /> : children;

  if (loading) return <div className="flex items-center justify-center min-h-screen">Restoring session...</div>;

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <Routes>
        {/* Public */}
        <Route path="/login" element={!currentUser ? <Login onSubmit={handleAuthSubmit} onSwitchMode={() => navigate("/signup")} /> : <Navigate to={currentUser.role === "admin" ? "/admin" : "/"} replace />} />
        <Route path="/signup" element={!currentUser ? <Signup onSubmit={handleAuthSubmit} onSwitchMode={() => navigate("/login")} /> : <Navigate to={currentUser.role === "admin" ? "/admin" : "/"} replace />} />

        {/* User routes with Layout */}
        <Route element={<UserRoute><Layout user={currentUser} onLogout={handleLogout} tasks={tasks} refreshTasks={fetchTasks} /></UserRoute>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pending" element={<PendingPage />} />
          <Route path="/complete" element={<CompletePage />} />
          <Route path="/profile" element={<Profile setCurrentUser={setCurrentUser} onLogout={handleLogout} />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard admin={currentUser} onLogout={handleLogout} /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><ManageUsers admin={currentUser} onLogout={handleLogout} /></AdminRoute>} />
        <Route path="/admin/tasks" element={<AdminRoute><AllTasks admin={currentUser} onLogout={handleLogout} /></AdminRoute>} />
        <Route path="/admin/profile" element={<AdminRoute><AdminProfile admin={currentUser} onLogout={handleLogout} /></AdminRoute>} />


        {/* fallback */}
        <Route path="*" element={<Navigate to={currentUser ? (currentUser.role === "admin" ? "/admin" : "/") : "/login"} replace />} />
      </Routes>
    </>
  );
};

export default App;
