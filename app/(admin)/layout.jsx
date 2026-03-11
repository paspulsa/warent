'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const menus = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { name: 'Users', href: '/admin/users', icon: '👥' },
    { name: 'WhatsApp', href: '/admin/whatsapp', icon: '📱' },
    { name: 'Iklan', href: '/admin/iklan', icon: '📝' },
    { name: 'Kontak', href: '/admin/kontak', icon: '📇' },
    { name: 'Transaksi', href: '/admin/transaksi', icon: '💸' },
    { name: 'Withdrawal', href: '/admin/withdrawal', icon: '🏦' },
    { name: 'Referral', href: '/admin/referral', icon: '🔗' },
    { name: 'Pengaturan', href: '/admin/pengaturan', icon: '⚙️' },
  ];

  const handleLogout = async () => {
    // Logika hapus cookie token
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Admin */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-100 text-center">
          <h1 className="text-xl font-bold text-blue-600 tracking-tight">ADMIN PANEL</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menus.map((menu) => {
            const isActive = pathname === menu.href;
            return (
              <Link
                key={menu.href}
                href={menu.href}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                  isActive 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{menu.icon}</span>
                <span className="text-sm font-semibold">{menu.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 text-red-500 hover:bg-red-50 rounded-lg transition"
          >
            <span>🚪</span>
            <span className="text-sm font-bold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 justify-between">
          <h2 className="text-gray-500 text-sm font-medium uppercase tracking-widest">
            {pathname.split('/').pop()}
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-xs font-bold text-green-500">SERVER: ONLINE</span>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">A</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
