"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import UserModal from '@/components/UserModal';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'staff';
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await api.get('/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users', error);
        if (error.response?.status === 403) {
            alert("You don't have permission to view this page.");
            router.push('/dashboard');
        }
      }
    };

    fetchUsers();
  }, [router]);
  
  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }
    const token = localStorage.getItem('token');
    try {
        await api.delete(`/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
        console.error('Failed to delete user', error);
        alert('Failed to delete user.');
    }
  };

  const openModal = (user: User | null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSave = async (userData: Omit<User, 'id'>, password?: string) => {
    const token = localStorage.getItem('token');
    const payload = { ...userData, ...(password && { password }) };
    
    if (selectedUser) { // Update
      try {
        const response = await api.patch(`/users/${selectedUser.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(users.map(u => u.id === selectedUser.id ? response.data : u));
      } catch (error) {
        console.error('Failed to update user', error);
        alert('Failed to update user.');
      }
    } else { // Create
      try {
        const response = await api.post('/users', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers([...users, response.data]);
      } catch (error) {
        console.error('Failed to create user', error);
        alert('Failed to create user.');
      }
    }
    closeModal();
  };


  return (
    <div className="min-h-screen bg-gray-100">
        <UserModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} user={selectedUser} />
        <header className="bg-white shadow">
            <div className="flex justify-between items-center px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
            <button onClick={() => openModal(null)} className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                Add New User
            </button>
            </div>
        </header>
        <main className="py-10">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Role</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                            <td className="px-6 py-4 text-right whitespace-nowrap space-x-4">
                            <button onClick={() => openModal(user)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                            <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900">Delete</button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                <div className="mt-4">
                    <Link href="/settings" className="text-sm text-indigo-600 hover:text-indigo-800">
                        &larr; Back to Settings
                    </Link>
                </div>
            </div>
        </main>
    </div>
  );
}
