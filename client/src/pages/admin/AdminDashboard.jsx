// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState, useMemo } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Users, FileText, CheckCircle, AlertTriangle, CalendarDays } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = ({ admin }) => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = admin?.token || localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://taskly-7s40.onrender.com/api/admin/users', { headers });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Fetch Users Error:', err.response?.data || err.message);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:2000/api/admin/tasks', { headers });
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error('Fetch Tasks Error:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchTasks()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const stats = useMemo(() => {
    const today = new Date();
    return {
      totalUsers: users.length,
      blockedUsers: users.filter(u => u.blocked).length,
      activeTasks: tasks.filter(t => !t.completed).length,
      completedTasks: tasks.filter(t => t.completed).length,
      highPriorityTasks: tasks.filter(t => t.priority?.toLowerCase() === 'high').length,
      tasksDueToday: tasks.filter(t => {
        if (!t.dueDate) return false;
        const due = new Date(t.dueDate);
        return due.toDateString() === today.toDateString();
      }).length,
    };
  }, [users, tasks]);

  if (loading) {
    return <p className="text-center text-gray-500 mt-20">Loading Dashboard...</p>;
  }

  // Reusable light card
  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-lg bg-${color}-100 text-${color}-500`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-semibold text-gray-700">{value}</p>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar admin={admin} />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Users className="w-7 h-7 text-purple-500" /> Admin Dashboard
        </h1>

        {/* Grid of cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard icon={Users} title="Total Users" value={stats.totalUsers} color="purple" />
          <StatCard icon={Users} title="Blocked Users" value={stats.blockedUsers} color="rose" />
          <StatCard icon={FileText} title="Active Tasks" value={stats.activeTasks} color="blue" />
          <StatCard icon={CheckCircle} title="Completed Tasks" value={stats.completedTasks} color="green" />
          <StatCard icon={AlertTriangle} title="High Priority Tasks" value={stats.highPriorityTasks} color="orange" />
          <StatCard icon={CalendarDays} title="Tasks Due Today" value={stats.tasksDueToday} color="indigo" />
        </div>

        {/* Optional: Quick summary */}
        <div className="mt-10 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Quick Summary</h2>
          <p className="text-gray-600 leading-relaxed">
            You have <span className="font-semibold">{stats.activeTasks}</span> active tasks,
            with <span className="font-semibold">{stats.highPriorityTasks}</span> marked as high priority.
            {stats.tasksDueToday > 0 ? (
              <>
                {' '}<span className="font-semibold">{stats.tasksDueToday}</span> tasks are due today — stay on track!
              </>
            ) : (
              ' No tasks are due today 🎉'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
