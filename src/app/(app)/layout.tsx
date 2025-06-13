// src/app/(app)/layout.tsx

"use client";

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Estado para controlar a visibilidade da sidebar no mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* A sidebar agora recebe o estado e a função para modificá-lo */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex flex-col flex-1">
        {/* O Header recebe a função para abrir a sidebar */}
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}