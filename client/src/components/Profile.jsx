// src/components/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { BACK_BUTTON, DANGER_BTN, FULL_BUTTON, INPUT_WRAPPER, personalFields, SECTION_WRAPPER, securityFields } from '../assets/dummay';
import { ChevronLeft, Lock, LogOut, Save, Shield, UserCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:2000';

const Profile = ({ setCurrentUser, onLogout }) => {
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem('token');
    if (!token) return setLoaded(true);

    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!cancelled) {
          if (data.success) {
            setProfile({ name: data.user.name, email: data.user.email });
          } else {
            // show only if there's a real message
            if (data.message) toast.error(data.message);
          }
        }
      } catch (err) {
        // only show error if it's an actual network/error case
        toast.error('Unable to load profile');
      } finally {
        if (!cancelled) setLoaded(true);
      }
    };
    fetchProfile();
    return () => { cancelled = true; };
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(
        `${API_URL}/api/users/profile`,
        { name: profile.name, email: profile.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        // update parent user safely
        setCurrentUser(prev => ({
          ...prev,
          name: profile.name,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random`,
        }));
        toast.success('Profile Updated');
      } else {
        toast.error(data.message || 'Failed to update');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Profile Update Failed');
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) return toast.error('Passwords do not match');
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(
        `${API_URL}/api/users/password`,
        { oldPassword: password.current, newPassword: password.new },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success('Password Changed');
        setPassword({ current: '', new: '', confirm: '' });
      } else {
        toast.error(data.message || 'Failed to change password');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password Change Failed');
    }
  };

  if (!loaded) return <div className="flex items-center justify-center min-h-screen">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="max-w-4xl mx-auto p-6">
        <button onClick={() => navigate(-1)} className={`${BACK_BUTTON} flex items-center gap-1`}>
          <ChevronLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {profile.name ? profile.name[0].toUpperCase() : 'U'}
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Account Settings</h1>
          <p className="text-gray-500 text-sm">Manage your profile and security settings</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 px-6 pb-12">
        <section className={`${SECTION_WRAPPER} bg-white rounded-2xl shadow-sm p-6`}>
          <div className="flex items-center gap-2 mb-6">
            <UserCircle className="text-purple-500 w-5 h-5" />
            <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
          </div>
          <form onSubmit={saveProfile} className="space-y-4">
            {personalFields.map(({ name, type, placeholder, icon: Icon }) => (
              <div key={name} className={INPUT_WRAPPER}>
                <Icon className="text-purple-500 w-5 h-5 mr-2" />
                <input
                  type={type}
                  placeholder={placeholder}
                  value={profile[name]}
                  onChange={(e) => setProfile({ ...profile, [name]: e.target.value })}
                  className="w-full focus:outline-none text-sm"
                  required
                />
              </div>
            ))}
            <button className={`${FULL_BUTTON} flex items-center gap-2`}>
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </form>
        </section>

        <section className={`${SECTION_WRAPPER} bg-white rounded-2xl shadow-sm p-6`}>
          <div className="flex items-center gap-2 mb-6">
            <Shield className="text-purple-500 w-5 h-5" />
            <h2 className="text-xl font-semibold text-gray-800">Security</h2>
          </div>
          <form onSubmit={changePassword} className="space-y-4">
            {securityFields.map(({ name, placeholder }) => (
              <div key={name} className={INPUT_WRAPPER}>
                <Lock className="text-purple-500 w-5 h-5 mr-2" />
                <input
                  type="password"
                  placeholder={placeholder}
                  value={password[name]}
                  onChange={(e) => setPassword({ ...password, [name]: e.target.value })}
                  className="w-full focus:outline-none text-sm"
                  required
                />
              </div>
            ))}
            <button className={`${FULL_BUTTON} flex items-center gap-2`}>
              <Shield className="w-4 h-4" />
              Change Password
            </button>

            <div className="mt-8 pt-6 border-t border-purple-100">
              <h3 className="flex items-center gap-2 text-red-600 font-semibold mb-3">
                <LogOut className="w-4 h-4" />
                Danger Zone
              </h3>
              <button className={DANGER_BTN} onClick={onLogout}>
                Logout
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Profile;
