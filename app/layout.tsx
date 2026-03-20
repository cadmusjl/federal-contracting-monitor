'use client';

import type { Metadata } from 'next';
import { useEffect, useState } from 'react';
import './globals.css';

// Note: Metadata export not available in Client Components
// This will be handled by root layout configuration

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize theme on mount
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Federal Contracting Monitor</title>
        <meta name="description" content="Real-time federal contracting opportunity and spend analysis platform" />
      </head>
      <body className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
        {mounted && (
          <>
            <nav className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 sticky top-0 z-40">
              <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="text-xl font-bold">Federal Contracting Monitor</div>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
                  aria-label="Toggle theme"
                >
                  🌙
                </button>
              </div>
            </nav>
            <main className="max-w-7xl mx-auto px-4 py-8">
              {children}
            </main>
          </>
        )}
      </body>
    </html>
  );
}
