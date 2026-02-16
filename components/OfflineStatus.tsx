'use client';

import { useState, useEffect } from 'react';

export default function OfflineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingOps, setPendingOps] = useState(0);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && pendingOps === 0) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow-lg ${
      !isOnline ? 'bg-red-900/90 text-red-100 border border-red-700' :
      syncing ? 'bg-amber-900/90 text-amber-100 border border-amber-700' :
      'bg-amber-900/90 text-amber-100 border border-amber-700'
    }`}>
      <span className={`w-2 h-2 rounded-full ${
        !isOnline ? 'bg-red-400' : syncing ? 'bg-amber-400 animate-pulse' : 'bg-amber-400'
      }`} />
      {!isOnline ? 'Offline' : syncing ? 'Syncing...' : `${pendingOps} pending`}
    </div>
  );
}
