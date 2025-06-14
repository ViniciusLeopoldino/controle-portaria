import { createSupabaseServerClient } from '@/lib/supabase/server';
import SummaryCard from '@/components/SummaryCard';
import { Package, Truck } from 'lucide-react';
import { startOfDay, endOfDay } from 'date-fns';
// --- IMPORTAÇÃO CORRIGIDA COM OS NOMES CERTOS ---
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
  
  const timeZone = 'America/Sao_Paulo';
  
  // --- LÓGICA CORRIGIDA COM AS FUNÇÕES CERTAS ---
  // 1. Pega a data/hora atual (em UTC) e converte para o horário de São Paulo
  const nowInSaoPaulo = toZonedTime(new Date(), timeZone);
  
  // 2. Calcula o início e o fim do dia com base na data já convertida
  const startOfDayInSaoPaulo = startOfDay(nowInSaoPaulo);
  const endOfDayInSaoPaulo = endOfDay(nowInSaoPaulo);
  
  // 3. Converte esses limites de volta para UTC para a consulta ao banco de dados
  const startOfDayUTC = fromZonedTime(startOfDayInSaoPaulo, timeZone);
  const endOfDayUTC = fromZonedTime(endOfDayInSaoPaulo, timeZone);

  // 4. A busca usa as datas em UTC, garantindo que a consulta seja sempre correta
  const { data: operacoesDoDia, error } = await supabase
    .from('operacoes')
    .select('tipo, status')
    .gte('created_at', startOfDayUTC.toISOString())
    .lte('created_at', endOfDayUTC.toISOString());

  if (error) {
    console.error("Erro ao buscar operações:", error);
  }

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
        <SummaryCard
          title="Retiradas"
          icon={Package}
          counts={counts.retiradas}
        />
        <SummaryCard
          title="Entregas"
          icon={Truck}
          counts={counts.entregas}
        />
      </div>
    </div>
  );
}