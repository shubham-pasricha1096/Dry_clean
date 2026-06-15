"use client";

import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>
      </header>
      <main className="py-10">
        <div className="mx-auto max-w-lg">
          <ul className="space-y-4">
            <li>
              <Link href="/settings/users" className="block bg-white p-6 rounded-lg shadow-md hover:bg-gray-50">
                  <h2 className="text-xl font-bold text-gray-800">Manage Users</h2>
                  <p className="text-gray-600 mt-1">Add, edit, or remove staff and admin accounts.</p>
              </Link>
            </li>
            <li>
              <Link href="/settings/services" className="block bg-white p-6 rounded-lg shadow-md hover:bg-gray-50">
                  <h2 className="text-xl font-bold text-gray-800">Manage Services</h2>
                  <p className="text-gray-600 mt-1">Update the list of available cleaning services.</p>
              </Link>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
