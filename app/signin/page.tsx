'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // MVP: accept any credentials, store in localStorage
    try {
      localStorage.setItem('mineshift_user', JSON.stringify({
        email,
        name: email.split('@')[0],
        role: 'supervisor',
        siteId: 'demo-site',
        signedInAt: new Date().toISOString(),
      }));
      router.push('/dashboard');
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none"><path d="M8 1L2 6v8h4v-4h4v4h4V6L8 1z" fill="#000" strokeWidth="0"/></svg>
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">MineShift</span>
        </div>

        {/* Sign in card */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8">
          <h1 className="text-xl font-semibold text-white mb-1">Sign in</h1>
          <p className="text-[14px] text-gray-500 mb-8">Enter your credentials to access your site.</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-6">
              <p className="text-[13px] text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-[13px] font-medium text-gray-400 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@site.com"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-[15px] text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/25 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[13px] font-medium text-gray-400 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-[15px] text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/25 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-3.5 rounded-lg transition-colors text-[15px]"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/[0.06] text-center">
            <p className="text-[13px] text-gray-600">
              Need access?{' '}
              <a href="mailto:hello@mineshift.com" className="text-amber-500 hover:text-amber-400 transition-colors">
                Contact your site admin
              </a>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-[13px] text-gray-600 hover:text-gray-400 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
