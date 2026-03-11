'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function MemberLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const menus = [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { name: 'WhatsApp Saya', href: '/whatsapp', icon: '📱' },
    { name: 'Mulai Blast', href: '/blast', icon: '🚀' },
    { name: 'Penarikan Dana', href: '/withdrawal', icon: '💰' },
    { name: 'Profil & Bank', href: '/profile', icon: '👤' },
  ];

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Member (Warna Gelap agar Berbeda) */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-8 border-b border-slate-800">
          <h1 className="text-2xl font-black text-blue-400">WA BLAST</h1>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">User Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menus.map((menu) => {
            const isActive = pathname === menu.href;
            return (
              <Link
                key={menu.href}
                href={menu.href}
                className={`flex items-center space-x-3 p-4 rounded-xl transition-all ${
                  isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className="text-xl">{menu.icon}</span>
                <span className="text-sm font-bold">{menu.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-6 border-t border-slate-800">
          <div className="mb-4 bg-slate-800 p-3 rounded-lg text-center">
            <p className="text-[10px] text-slate-500 uppercase font-bold">Saldo Dompet</p>
            <p className="text-lg font-bold text-emerald-400">Rp 0</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 p-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
          >
            <span className="font-bold">🚪 KELUAR</span>
          </button>
        </div>
      </aside>

      {/* Main Content Member */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 shadow-sm">
          <div className="flex-1">
             <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Selamat Datang di Area Member</span>
          </div>
          <div className="flex items-center space-x-4">
             <div className="text-right">
                <p className="text-xs font-bold text-gray-800">Member Aktif</p>
                <p className="text-[10px] text-green-500 font-bold uppercase">Connected</p>
             </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-2">
          {children}
        </main>
      </div>
    </div>
  );
}
