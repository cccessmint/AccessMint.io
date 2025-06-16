'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/campaigns', label: 'Campaigns' },
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/settings', label: 'Settings' },
  { href: '/my-mints', label: 'My NFTs' },
  { href: '/admin/campaigns', label: 'Campaigns' },
];

  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed left-0 top-0 p-4">
      <h1 className="text-2xl font-bold mb-8">AccessMint Admin</h1>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`block p-2 rounded ${
                pathname === link.href ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

