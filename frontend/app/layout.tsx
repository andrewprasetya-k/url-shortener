'use client';
import './globals.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import { usePathname } from 'next/navigation';
import { sidebar } from './config';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const hideSidebar = pathname === '/login' || pathname === '/register';
  const hideTopbar = pathname === '/login' || pathname === '/register';

  const pageTitle =
    pathname
      .split('/')
      .filter(Boolean)
      .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' / ') || 'Home';

  return (
    <html lang="en">
      <body className="antialiased flex min-h-screen">
        {!hideSidebar && <Sidebar />}
        <div className={`flex-1 flex flex-col ${!hideSidebar ? sidebar.marginLeft : ''}`}>
          {!hideTopbar && <Topbar title={pageTitle} />}
          <main className={`${!hideTopbar ? 'mt-16' : ''}`}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
