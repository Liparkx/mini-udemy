'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isLogged, setIsLogged] = useState(false);
  const [dashboardUrl, setDashboardUrl] = useState('/dashboard/student');

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      setIsLogged(!!token);

      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.role === 'INSTRUCTOR') {
            setDashboardUrl('/dashboard/instructor');
          } else {
            setDashboardUrl('/dashboard/student');
          }
        } catch (e) { }
      }
    };

    checkToken();
    window.addEventListener('storage', checkToken);

    return () => {
      window.removeEventListener('storage', checkToken);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLogged(false);
    window.location.href = '/login';
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
              Mini-Udemy
            </Link>
          </div>
          <div className="hidden sm:flex sm:space-x-8">
            <Link href="/" className="text-foreground/80 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Catalog
            </Link>
            {isLogged ? (
              <>
                <Link href={dashboardUrl} className="text-foreground/80 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  My Dashboard
                </Link>
                <button onClick={handleLogout} className="text-foreground/80 hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-foreground/80 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Log In
                </Link>
                <Link href="/register" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
