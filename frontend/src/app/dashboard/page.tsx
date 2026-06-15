"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import DashboardCard from '@/components/DashboardCard';

interface Order {
  id: string;
  status: string;
  created_at: string;
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
        // Handle token expiration, e.g., redirect to login
        if (error.response?.status === 401) {
            router.push('/login');
        }
      }
    };

    fetchOrders();
  }, [router]);

  const today = new Date().toISOString().split('T')[0];

  const totalOrdersToday = orders.filter(
    (order) => order.created_at.startsWith(today)
  ).length;

  const pendingOrders = orders.filter(
    (order) => !['Ready For Pickup', 'Delivered'].includes(order.status)
  ).length;

  const readyForPickup = orders.filter(
    (order) => order.status === 'Ready For Pickup'
  ).length;

  const deliveredToday = orders.filter(
      (order) => order.status === 'Delivered' && order.created_at.startsWith(today)
  ).length;


  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </header>
      <main className="py-10">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardCard title="Total Orders Today" value={totalOrdersToday} color="bg-blue-500" />
            <DashboardCard title="Pending Orders" value={pendingOrders} color="bg-yellow-500" />
            <DashboardCard title="Ready For Pickup" value={readyForPickup} color="bg-green-500" />
            <DashboardCard title="Delivered Today" value={deliveredToday} color="bg-indigo-500" />
          </div>
        </div>
      </main>
    </div>
  );
}
