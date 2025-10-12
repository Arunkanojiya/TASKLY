import React, { useState, useEffect } from 'react';

const AdminUserModal = ({ isOpen, onClose, userToEdit, onSave }) => {
  const [form, setForm] = useState({ name: '', email: '', role: 'user' });

  useEffect(() => {
    if (userToEdit) setForm(userToEdit);
    else setForm({ name: '', email: '', role: 'user' });
  }, [userToEdit]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-lg font-bold text-gray-800 mb-4">{userToEdit ? 'Edit User' : 'Add User'}</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full border px-3 py-2 rounded-md"
          />
          <select
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
            className="w-full border px-3 py-2 rounded-md"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="superadmin">SuperAdmin</option>
          </select>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUserModal;
