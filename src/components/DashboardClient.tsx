"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { type Operation } from '@/types/operation';
import OperationsTable from './OperationsTable';
import ExportButton from './ExportButton';
import { Maximize, Minimize } from 'lucide-react';

export default function DashboardClient() {
  const [supabase] = useState(() => createClient());
  
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // --- LÓGICA DE TEMPO REAL ---
  const [realtimeTrigger, setRealtimeTrigger] = useState(0);

  // --- LÓGICA DE TELA CHEIA ---
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dashboardContainerRef = useRef<HTMLDivElement>(null);


  // --- FUNÇÃO DE BUSCA DE DADOS ---
  const fetchOperations = useCallback(async () => {
    setLoading(true);

    let query = supabase.from('operacoes').select(`*`);

    if (search) {
      const searchTerm = `%${search}%`;
      query = query.or(`transportadora.ilike.${searchTerm},cliente.ilike.${searchTerm},numero_nf.ilike.${searchTerm}`);
    }
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (startDate) {
      query = query.gte('created_at', `${startDate}T00:00:00.000Z`);
    }
    if (endDate) {
      query = query.lte('created_at', `${endDate}T23:59:59.999Z`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erro ao buscar operações:", error);
      setOperations([]);
    } else {
      const sortedData = (data || []).sort((a, b) => {
        const statusOrder = { 'Pendente': 1, 'Em Andamento': 2, 'Finalizado': 3 };
        const orderA = statusOrder[a.status as keyof typeof statusOrder] ?? 99;
        const orderB = statusOrder[b.status as keyof typeof statusOrder] ?? 99;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      setOperations(sortedData);
    }
    
    setLoading(false);
  }, [search, status, startDate, endDate, supabase]);

  // useEffect para acionar a busca de dados
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchOperations();
    }, 300);

    return () => clearTimeout(handler);
  }, [fetchOperations, realtimeTrigger]);

  // useEffect para o ouvinte de tempo real
  useEffect(() => {
    const channel = supabase.channel('operacoes-realtime-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'operacoes' }, (payload) => {
        console.log('Mudança recebida em tempo real!', payload);
        setRealtimeTrigger(prev => prev + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // useEffect para o estado de tela cheia
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Função para alternar a tela cheia
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      dashboardContainerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };


  return (
    <>
      {/* Esconde os filtros se estiver em tela cheia */}
      {!isFullscreen && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-grow">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <input type="text" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="p-2 border rounded-md text-black" />
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="p-2 border rounded-md text-black">
                  <option value="all">Todos os Status</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Em Andamento">Em Andamento</option>
                  <option value="Finalizado">Finalizado</option>
                </select>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 border rounded-md text-black" />
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 border rounded-md text-black" />
              </div>
            </div>
          </div>
          <div>
            <ExportButton operations={operations} />
          </div>
        </div>
      )}

      {/* Container da Tabela com a ref e o botão de tela cheia */}
      <div 
        ref={dashboardContainerRef}
        className={`mt-6 bg-white p-6 rounded-lg shadow-md overflow-x-auto relative`}
      >
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Sair da Tela Inteira' : 'Ver em Tela Inteira'}
          className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 p-2 rounded-full z-10"
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>

        {loading ? <p>Carregando...</p> : 
          <OperationsTable 
            operations={operations} 
            onStatusChange={fetchOperations} 
          />
        }
      </div>
    </>
  );
}