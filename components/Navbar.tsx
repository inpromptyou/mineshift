'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/shifts', label: 'Shifts' },
  { href: '/actions', label: 'Actions' },
  { href: '/assets', label: 'Assets' },
  { href: '/search', label: 'Search' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOnline, setIsOnline] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  return (
    <nav className="bg-[#1a1a1f] border-b border-[#2a2a30] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">⛏️</span>
            <span className="text-lg font-bold text-white">Mine<span className="text-amber-500">Shift</span></span>
            <span className={`w-2 h-2 rounded-full ml-1 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname?.startsWith(link.href)
                    ? 'bg-amber-500/10 text-amber-500'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/shifts/new"
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
            >
              + New Shift
            </Link>
            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#2a2a30] px-4 py-2">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block px-3 py-3 rounded-md text-sm font-medium ${
                pathname?.startsWith(link.href)
                  ? 'bg-amber-500/10 text-amber-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
