"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const pathname = usePathname();

    const navLinks = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/orders', label: 'Orders' },
        { href: '/scan', label: 'Scan QR' },
    ];

    if (pathname === '/login') {
        return null;
    }

    return (
        <nav className="bg-white shadow-md">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/dashboard" className="text-2xl font-bold text-indigo-600">
                            CleanTrack
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="flex items-baseline ml-10 space-x-4">
                            {navLinks.map(link => (
                                <Link key={link.href} href={link.href}
                                   className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === link.href ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                                        {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
