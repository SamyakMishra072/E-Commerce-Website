import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Edit3, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Profile: React.FC = () => {
  const { token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: '',
    createdAt: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data);
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  const handleSave = async () => {
    try {
      const res = await axios.put('http://localhost:5000/api/profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData(res.data);
      toast.success('Profile updated');
      setIsEditing(false);
    } catch {
      toast.error('Update failed');
    }
  };

  const handleCancel = async () => {
    setIsEditing(false);
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData(res.data);
    } catch {
      toast.error('Reload failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mt-1 p-2 border rounded"
                />
              ) : (
                <p className="mt-1 text-gray-700">{formData.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full mt-1 p-2 border rounded"
                />
              ) : (
                <p className="mt-1 text-gray-700">{formData.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full mt-1 p-2 border rounded"
                />
              ) : (
                <p className="mt-1 text-gray-700">{formData.phone || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Address</label>
              {isEditing ? (
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full mt-1 p-2 border rounded"
                />
              ) : (
                <p className="mt-1 text-gray-700">{formData.address || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Account Type</label>
              <p className="mt-1 text-gray-700 capitalize">{formData.role}</p>
            </div>
            <div>
              <label className="block text-sm font-medium">Member Since</label>
              <p className="mt-1 text-gray-700">
                {new Date(formData.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
