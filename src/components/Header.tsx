// src/components/Header.tsx

"use client";

import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    // O cabeçalho é escondido em telas médias e maiores (md:hidden)
    <header className="md:hidden bg-white p-4 shadow-md flex items-center">
      <button onClick={onMenuClick}>
        <Menu className="w-6 h-6" />
      </button>
      <h1 className="ml-4 text-xl font-bold text-[oklch(60%_0.118_184.704)]">Portaria Maglog</h1>
    </header>
  );
}