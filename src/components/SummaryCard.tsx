// src/components/SummaryCard.tsx

import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  icon: LucideIcon;
  counts: {
    pendente: number;
    emAndamento: number;
    finalizado: number;
  };
}

export default function SummaryCard({ title, icon: Icon, counts }: SummaryCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
      <div className="flex items-center mb-4">
        <Icon className="w-8 h-8 text-indigo-500" />
        <h3 className="ml-4 text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Aguardando</span>
          <span className="font-bold text-lg text-yellow-500">{counts.pendente}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Em Andamento</span>
          <span className="font-bold text-lg text-blue-500">{counts.emAndamento}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Finalizado</span>
          <span className="font-bold text-lg text-green-500">{counts.finalizado}</span>
        </div>
      </div>
    </div>
  );
}