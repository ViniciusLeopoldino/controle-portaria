"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Home, Warehouse, LayoutDashboard, LogOut, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Portaria', href: '/portaria', icon: Warehouse },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
];

// A interface de props que o erro acusa estar incorreta. Esta é a versão correta.
interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <>
      {/* Overlay que aparece atrás do menu no mobile */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-white border-r z-20 flex flex-col transition-transform transform md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-2xl font-bold text-[oklch(60%_0.118_184.704)]">Portaria Maglog</h2>
          {/* Botão de fechar que só aparece no mobile */}
          <button onClick={() => setIsOpen(false)} className="md:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex flex-col justify-between flex-1 mt-6 px-4 pb-4">
          <nav>
            <ul>
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)} // Fecha o menu ao clicar em um link
                      className={`flex items-center px-4 py-2 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md hover:bg-gray-200 ${
                        isActive ? 'bg-gray-200 font-semibold' : ''
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      <span className="mx-4">{link.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md hover:bg-red-100 hover:text-red-700"
            >
              <LogOut className="w-5 h-5" />
              <span className="mx-4 font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}