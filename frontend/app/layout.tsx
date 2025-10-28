'use client';
import './globals.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import { usePathname } from 'next/navigation';
import { sidebar } from './config';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const hideSidebar = pathname === '/login';

  const pageTitle = pathname
  .split('/')
  .filter(Boolean)
  .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
  .join(' / ') || 'Home';

  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 flex min-h-screen">
        {!hideSidebar && <Sidebar />}
        <div className={`flex-1 flex flex-col ${!hideSidebar ? sidebar.marginLeft : ''}`}>
          {!hideSidebar && <Topbar title={pageTitle}/>}
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
