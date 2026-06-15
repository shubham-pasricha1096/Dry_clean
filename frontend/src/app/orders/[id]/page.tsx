"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import api, { axios } from '@/lib/api';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  item_description: string;
  selected_services: { name: string }[];
  status: string;
  notes: string;
  expected_delivery_date: string;
  qr_code_image_url: string;
  created_at: string;
}

interface StatusHistory {
    id: string;
    old_status: string;
    new_status: string;
    changed_by: string;
    changed_at: string;
}


const ALL_STATUSES = [
  'Received',
  'Picked Up',
  'At Cleaning Plant',
  'Ready For Pickup',
  'Out For Delivery',
  'Delivered',
];

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [order, setOrder] = useState<Order | null>(null);
  const [history, setHistory] = useState<StatusHistory[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !id) {
      router.push('/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        const [orderRes, historyRes] = await Promise.all([
            api.get(`/orders/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
            api.get(`/orders/${id}/history`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
        ]);
        setOrder(orderRes.data);
        setHistory(historyRes.data);
      } catch (err) {
        console.error('Failed to fetch order details', err);
        if (axios.isAxiosError(err)) {
            setError('Failed to fetch order details.');
        } else {
            setError('An unexpected error occurred.');
        }
      }
    };

    fetchOrder();
  }, [id, router]);

  const handleStatusUpdate = async (newStatus: string) => {
    const token = localStorage.getItem('token');
    if (!token || !id) return;
    try {
      const response = await api.patch(`/orders/${id}/status`, { status: newStatus }, {
          headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(response.data.order);
      setHistory(response.data.history);
    } catch (err) {
      console.error('Failed to update status', err);
      if (axios.isAxiosError(err)) {
          alert('Failed to update status.');
      } else {
          alert('An unexpected error occurred.');
      }
    }
  };
  
  if (!order) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const currentStatusIndex = ALL_STATUSES.indexOf(order.status);


  return (
    <div className="min-h-screen bg-gray-100">
       <header className="bg-white shadow">
        <div className="flex justify-between items-center px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Order #{order.order_number}</h1>
            <Link href="/orders" className="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300">
                Back to Orders
            </Link>
        </div>
      </header>

      <main className="py-10">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Order Details */}
            <div className="md:col-span-2 bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">Order Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Customer</p>
                        <p className="text-lg">{order.customer_name}</p>
                    </div>
                     <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="text-lg">{order.customer_phone}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Expected Delivery</p>
                        <p className="text-lg">{new Date(order.expected_delivery_date).toLocaleDateString()}</p>
                    </div>
                     <div>
                        <p className="text-sm font-medium text-gray-500">Created On</p>
                        <p className="text-lg">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                </div>
                 <div className="mt-6">
                    <p className="text-sm font-medium text-gray-500">Item Description</p>
                    <p className="text-lg">{order.item_description || 'N/A'}</p>
                </div>
                <div className="mt-6">
                    <p className="text-sm font-medium text-gray-500">Notes</p>
                    <p className="text-lg">{order.notes || 'N/A'}</p>
                </div>

                <div className="mt-6">
                    <p className="text-sm font-medium text-gray-500">Services</p>
                    <ul className="flex flex-wrap gap-2 mt-2">
                        {order.selected_services.map(s => (
                            <li key={s.name} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">{s.name}</li>
                        ))}
                    </ul>
                </div>
                
                 <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Status History</h3>
                    <ul className="space-y-2">
                        {history.map(h => (
                            <li key={h.id} className="text-sm">
                                <span className="font-semibold">{h.new_status}</span> by {h.changed_by} on {new Date(h.changed_at).toLocaleString()}
                            </li>
                        ))}
                    </ul>
                </div>

            </div>

            {/* Right Column: Status & QR */}
            <div className="space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h3 className="text-xl font-bold">Current Status</h3>
                    <p className="my-4 text-2xl font-semibold text-white bg-green-600 py-2 px-4 rounded-md">{order.status}</p>
                    
                    <h4 className="text-lg font-bold mt-6">Update Status</h4>
                    <div className="mt-4 space-y-2">
                       {ALL_STATUSES.map((status, index) => (
                           <button
                             key={status}
                             onClick={() => handleStatusUpdate(status)}
                             disabled={index <= currentStatusIndex}
                             className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors
                               ${index === currentStatusIndex ? 'bg-indigo-500 text-white' : ''}
                               ${index > currentStatusIndex ? 'bg-gray-200 hover:bg-indigo-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                             `}
                           >
                            {status}
                           </button>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                     <h3 className="text-xl font-bold mb-4">QR Code</h3>
                     {order.qr_code_image_url && (
                        <img src={`http://localhost:8000${order.qr_code_image_url}`} alt="QR Code" className="mx-auto" />
                     )}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
