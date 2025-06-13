"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { type Operation } from '@/types/operation';
import OperationsTable from './OperationsTable';
import ExportButton from './ExportButton';

export default function DashboardClient() {
  const supabase = createClient();
  
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [realtimeTrigger, setRealtimeTrigger] = useState(0);

  const fetchOperations = useCallback(async () => {
    setLoading(true);

    let query = supabase.from('operacoes').select(`
      id, created_at, transportadora, placa_veiculo, cliente, numero_nf, tipo, status
    `);

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

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Erro ao buscar operações:", error);
      setOperations([]);
    } else {
      setOperations(data || []);
    }
    
    setLoading(false);
  }, [search, status, startDate, endDate, supabase]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchOperations();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [fetchOperations, realtimeTrigger]);

  useEffect(() => {
    const channel = supabase.channel('operacoes-realtime-channel-insert')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'operacoes' },
        (payload) => {
          console.log('Novo cadastro recebido em tempo real!', payload);
          setRealtimeTrigger(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-grow">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input type="text" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="p-2 border rounded-md" />
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="p-2 border rounded-md">
                <option value="all">Todos os Status</option>
                <option value="Pendente">Pendente</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Finalizado">Finalizado</option>
              </select>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 border rounded-md" />
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 border rounded-md" />
            </div>
          </div>
        </div>
        <div>
          <ExportButton operations={operations} />
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow-md overflow-x-auto">
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