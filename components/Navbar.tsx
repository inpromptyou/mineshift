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
    <nav className="bg-[#0A0A0C]/80 backdrop-blur-sm border-b border-white/[0.06] sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-amber-500 flex items-center justify-center">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 1L2 6v8h4v-4h4v4h4V6L8 1z" fill="#000" strokeWidth="0"/></svg>
              </div>
              <span className="text-[14px] font-semibold tracking-tight">ShiftSync</span>
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                    pathname?.startsWith(link.href)
                      ? 'bg-white/[0.06] text-white'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/shifts/new"
              className="bg-amber-500 hover:bg-amber-400 text-black font-medium text-[13px] px-4 py-1.5 rounded-md transition-colors"
            >
              New Shift
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-white/[0.06] px-6 py-2">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block px-3 py-3 rounded-md text-[13px] font-medium ${
                pathname?.startsWith(link.href)
                  ? 'bg-white/[0.06] text-white'
                  : 'text-gray-500 hover:text-white'
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
