import React from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Music, BarChart2, Wallet, LogOut, User } from 'lucide-react';

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const navItems = [
    { name: 'Releases', icon: Music, path: '/dashboard' },
    { name: 'Profile', icon: User, path: '/dashboard/profile' },
    { name: 'Analytics', icon: BarChart2, path: '/dashboard/analytics' },
    { name: 'Wallet', icon: Wallet, path: '/dashboard/wallet' },
  ];

  return (
    <div className="h-screen bg-obsidian text-pure font-sans flex overflow-hidden selection:bg-neon selection:text-obsidian">
      {/* Sidebar */}
      <aside className="w-64 border-r border-chrome/10 bg-obsidian/50 flex flex-col justify-between">
        <div className="p-6">
          <Link to="/dashboard" className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-neon flex items-center justify-center font-black text-obsidian">B</div>
            <span className="font-bold tracking-tighter text-xl italic hover:text-neon transition">BBK DISTRO</span>
          </Link>
          
          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link 
                  key={item.name}
                  to={item.path}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-widest uppercase transition-colors ${
                    active 
                    ? 'bg-neon text-obsidian' 
                    : 'text-chrome hover:text-pure hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-chrome/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-widest uppercase text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Eject
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto grid-lines">
        <Outlet />
      </main>
    </div>
  );
}
