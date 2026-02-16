import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import OfflineStatus from '@/components/OfflineStatus';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'ShiftSync - Structured Shift Handover',
  description: 'Structured shift handover for every industry with offline-first capability, audit-grade tracking, and AI-powered summaries.',
  keywords: 'shift handover, operations, safety, production, equipment, audit, offline, mining, hospitality, healthcare, manufacturing',
  authors: [{ name: 'ShiftSync' }],
  creator: 'ShiftSync',
  publisher: 'ShiftSync',
  
  // PWA Metadata
  applicationName: 'ShiftSync',
  manifest: '/manifest.webmanifest',
  
  // Mobile optimizations
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  
  // Theme colors for status bar
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F59E0B' },
    { media: '(prefers-color-scheme: dark)', color: '#111114' },
  ],
  
  // Apple PWA support
  appleWebApp: {
    capable: true,
    title: 'ShiftSync',
    statusBarStyle: 'black-translucent',
    startupImage: '/icons/apple-splash-2048-2732.jpg',
  },
  
  // Open Graph
  openGraph: {
    type: 'website',
    siteName: 'ShiftSync',
    title: 'ShiftSync - Structured Shift Handover',
    description: 'Structured shift handover platform for every industry.',
    url: 'https://shiftsync.app',
    images: [
      {
        url: '/icons/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ShiftSync - Structured Shift Handover',
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'ShiftSync - Structured Shift Handover',
    description: 'Structured shift handover platform for every industry.',
    images: ['/icons/og-image.png'],
  },
  
  // Security
  robots: {
    index: false, // Internal tool, don't index
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* PWA Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="msapplication-TileColor" content="#111114" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Preconnect to improve performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#F59E0B" />
        
        {/* Startup images for iOS */}
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-2048-2732.jpg" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-2732-2048.jpg" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" />
        
        {/* Disable iOS form styling */}
        <style dangerouslySetInnerHTML={{
          __html: `
            input[type="search"]::-webkit-search-decoration,
            input[type="search"]::-webkit-search-cancel-button,
            input[type="search"]::-webkit-search-results-button,
            input[type="search"]::-webkit-search-results-decoration {
              display: none;
            }
            
            /* Disable iOS zoom on form focus */
            @media screen and (-webkit-min-device-pixel-ratio: 0) {
              select:focus,
              textarea:focus,
              input:focus {
                font-size: 16px;
              }
            }
          `
        }} />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-gray-900 text-gray-100 min-h-screen`}>
        {/* Main app content */}
        <div className="relative min-h-screen">
          {children}
        </div>
        
        {/* Offline status indicator - always visible */}
        <OfflineStatus />
        
        {/* Service Worker Registration */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('SW registered: ', registration);
                  })
                  .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
              });
            }
          `
        }} />
        
        {/* PWA Install Prompt */}
        <script dangerouslySetInnerHTML={{
          __html: `
            let deferredPrompt;
            let pwaInstallBanner;
            
            window.addEventListener('beforeinstallprompt', (e) => {
              e.preventDefault();
              deferredPrompt = e;
              
              // Show install banner
              pwaInstallBanner = document.createElement('div');
              pwaInstallBanner.className = 'pwa-install-prompt';
              pwaInstallBanner.innerHTML = \`
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-semibold">Install ShiftSync</h4>
                    <p class="text-sm opacity-90">Install the app for offline access and better performance</p>
                  </div>
                  <div class="flex gap-2">
                    <button id="pwa-dismiss" class="px-4 py-2 text-sm border border-orange-400 rounded">Later</button>
                    <button id="pwa-install" class="px-4 py-2 text-sm bg-white text-orange-600 rounded font-semibold">Install</button>
                  </div>
                </div>
              \`;
              
              document.body.appendChild(pwaInstallBanner);
              
              document.getElementById('pwa-install').onclick = () => {
                pwaInstallBanner.remove();
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                  if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                  }
                  deferredPrompt = null;
                });
              };
              
              document.getElementById('pwa-dismiss').onclick = () => {
                pwaInstallBanner.remove();
                localStorage.setItem('pwa-install-dismissed', Date.now());
              };
              
              // Auto-hide after 10 seconds
              setTimeout(() => {
                if (pwaInstallBanner && pwaInstallBanner.parentNode) {
                  pwaInstallBanner.remove();
                }
              }, 10000);
            });
            
            // Hide install prompt if dismissed recently
            const dismissed = localStorage.getItem('pwa-install-dismissed');
            if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) {
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
              });
            }
          `
        }} />
      </body>
    </html>
  );
}