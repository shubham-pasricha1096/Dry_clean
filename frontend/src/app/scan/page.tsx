"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '@/lib/api';

const ScanPage = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const scanner = new Html5QrcodeScanner(
      'reader',
      {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      },
      false
    );

    const onScanSuccess = (decodedText: string, decodedResult: any) => {
      scanner.clear();
      const orderNumber = decodedText;
      if (orderNumber) {
        setScanResult(orderNumber);
        
        const fetchOrder = async () => {
            try {
                const response = await api.get(`/orders/by-qr/${orderNumber}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                router.push(`/orders/${response.data.id}`);
            } catch (error) {
                console.error("Failed to fetch order by QR", error);
                alert("Order not found!");
            }
        };

        fetchOrder();

      }
    };

    const onScanFailure = (error: any) => {
      // handle scan failure, usually better to ignore and keep scanning.
    };

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear().catch(error => {
        console.error("Failed to clear html5-qrcode-scanner.", error);
      });
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Scan QR Code</h1>
        </div>
      </header>
      <main className="py-10">
        <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
          <div id="reader"></div>
          {scanResult && <p>Scanned Order Number: {scanResult}</p>}
        </div>
      </main>
    </div>
  );
};

export default ScanPage;
