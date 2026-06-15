"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

interface Service {
  id: string;
  name: string;
  is_active: boolean;
}

export default function ManageServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [newServiceName, setNewServiceName] = useState('');
  const router = useRouter();

  const fetchServices = async (token: string) => {
    try {
      const response = await api.get('/services/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(response.data);
    } catch (error) {
      console.error('Failed to fetch services', error);
      if (error.response?.status === 403) {
        alert("You don't have permission to view this page.");
        router.push('/dashboard');
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchServices(token);
  }, [router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    const token = localStorage.getItem('token');
    try {
      const response = await api.post('/services', { name: newServiceName }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices([...services, response.data]);
      setNewServiceName('');
    } catch (error) {
      console.error('Failed to create service', error);
      alert('Failed to create service.');
    }
  };
  
  const handleToggleActive = async (service: Service) => {
    const token = localStorage.getItem('token');
    try {
        const response = await api.patch(`/services/${service.id}`, { is_active: !service.is_active }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setServices(services.map(s => s.id === service.id ? response.data : s));
    } catch (error) {
        console.error('Failed to update service', error);
        if (axios.isAxiosError(error)) {
            alert('Failed to update service.');
        } else {
            alert('An unexpected error occurred.');
        }
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return;
    }
    const token = localStorage.getItem('token');
    try {
      await api.delete(`/services/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(services.filter(s => s.id !== serviceId));
    } catch (error) {
      console.error('Failed to delete service', error);
      alert('Failed to delete service.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Services</h1>
        </div>
      </header>
      <main className="py-10">
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleCreate} className="bg-white p-6 rounded-lg shadow-md mb-8 flex gap-4">
            <input
              type="text"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              placeholder="Enter new service name"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
            />
            <button type="submit" className="px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
              Add Service
            </button>
          </form>

          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <ul className="divide-y divide-gray-200">
              {services.map((service) => (
                <li key={service.id} className="p-4 flex justify-between items-center">
                    <div>
                        <p className={`font-medium ${service.is_active ? 'text-gray-900' : 'text-gray-400 line-through'}`}>
                            {service.name}
                        </p>
                         <p className="text-sm text-gray-500">
                            {service.is_active ? 'Active' : 'Inactive'}
                        </p>
                    </div>
                  <div className="space-x-4">
                    <button onClick={() => handleToggleActive(service)} className={`text-sm ${service.is_active ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}>
                      {service.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => handleDelete(service.id)} className="text-sm text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
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
