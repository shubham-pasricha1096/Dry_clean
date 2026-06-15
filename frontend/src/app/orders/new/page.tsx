"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Service {
  id: string;
  name: string;
}

interface NewOrder {
  customer_name: string;
  customer_phone: string;
  item_description: string;
  selected_services: string[];
  expected_delivery_date: string;
  notes: string;
}

export default function NewOrderPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState<NewOrder>({
    customer_name: '',
    customer_phone: '',
    item_description: '',
    selected_services: [],
    expected_delivery_date: '',
    notes: '',
  });
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchServices = async () => {
      try {
        const response = await api.get('/services', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices(response.data);
      } catch (error) {
        console.error('Failed to fetch services', error);
      }
    };

    fetchServices();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData((prev) => {
      const selected = prev.selected_services;
      if (selected.includes(serviceId)) {
        return { ...prev, selected_services: selected.filter((id) => id !== serviceId) };
      } else {
        return { ...prev, selected_services: [...selected, serviceId] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await api.post('/orders', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQrCodeUrl(response.data.qr_code_image_url);
    } catch (err) {
      console.error('Failed to create order', err);
      setError('Failed to create order. Please check the details and try again.');
    }
  };

  if (qrCodeUrl) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Order Created Successfully!</h2>
            <img src={`http://localhost:8000${qrCodeUrl}`} alt="QR Code" className="mx-auto" />
            <p className="mt-4">Print this QR code and attach it to the order.</p>
            <button
                onClick={() => router.push('/orders')}
                className="mt-6 px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
                Back to Orders
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Order</h1>
        </div>
      </header>
      <main className="py-10">
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Name</label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Phone</label>
              <input
                type="text"
                name="customer_phone"
                value={formData.customer_phone}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Item Description</label>
              <textarea
                name="item_description"
                value={formData.item_description}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., 2 shirts, 1 blazer"
              />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Services</label>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {services.map(service => (
                        <div key={service.id} className="flex items-center">
                            <input
                                id={service.id}
                                type="checkbox"
                                checked={formData.selected_services.includes(service.id)}
                                onChange={() => handleServiceToggle(service.id)}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor={service.id} className="ml-2 block text-sm text-gray-900">
                                {service.name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Expected Delivery Date</label>
              <input
                type="date"
                name="expected_delivery_date"
                value={formData.expected_delivery_date}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={2}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="text-right">
                <button type="submit" className="w-full text-lg px-6 py-3 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                    Create Order and Generate QR Code
                </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
