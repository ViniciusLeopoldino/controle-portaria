// src/app/(app)/page.tsx

import { createSupabaseServerClient } from '@/lib/supabase/server';
import SummaryCard from '@/components/SummaryCard';
import { Package, Truck } from 'lucide-react';
import { startOfToday, endOfToday } from 'date-fns';

// Revalidar os dados a cada 60 segundos
export const revalidate = 60;

// Tipos para as contagens, para melhor organização
type StatusCounts = {
  pendente: number;
  emAndamento: number;
  finalizado: number;
};

type AllCounts = {
  retiradas: StatusCounts;
  entregas: StatusCounts;
};

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  
  // Define o período de hoje
  const startOfDay = startOfToday();
  const endOfDay = endOfToday();

  // Busca todas as operações do dia de hoje
  const { data: operacoesDoDia, error } = await supabase
    .from('operacoes')
    .select('tipo, status')
    .gte('created_at', startOfDay.toISOString())
    .lte('created_at', endOfDay.toISOString());

  if (error) {
    console.error("Erro ao buscar operações:", error);
    // Você pode renderizar uma mensagem de erro aqui
  }

  // Processa os dados para calcular as contagens
  const counts = (operacoesDoDia || []).reduce<AllCounts>(
    (acc, operacao) => {
      const { tipo, status } = operacao;
      const target = tipo === 'Retirada' ? acc.retiradas : acc.entregas;

      if (status === 'Pendente') target.pendente++;
      if (status === 'Em Andamento') target.emAndamento++;
      if (status === 'Finalizado') target.finalizado++;

      return acc;
    },
    {
      retiradas: { pendente: 0, emAndamento: 0, finalizado: 0 },
      entregas: { pendente: 0, emAndamento: 0, finalizado: 0 },
    }
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Resumo do Dia</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card de Retiradas */}
        <SummaryCard
          title="Retiradas"
          icon={Package}
          counts={counts.retiradas}
        />

        {/* Card de Entregas */}
        <SummaryCard
          title="Entregas"
          icon={Truck}
          counts={counts.entregas}
        />
      </div>
    </div>
  );
}