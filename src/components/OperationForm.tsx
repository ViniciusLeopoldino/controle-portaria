"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
// import { useRouter } from 'next/navigation';

// A prop 'type' foi removida da interface
interface OperationFormProps {
  userId: string;
}

export default function OperationForm({ userId }: OperationFormProps) {
  // const router = useRouter();

  // --- MUDANÇA 1: Novo estado para controlar o tipo da operação ---
  const [operationType, setOperationType] = useState<'Retirada' | 'Entrega'>('Retirada');
  
  const [transportadora, setTransportadora] = useState('');
  const [placa, setPlaca] = useState('');
  const [cliente, setCliente] = useState('');
  const [nf, setNf] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const { error } = await supabase.from('operacoes').insert({
      transportadora,
      placa_veiculo: placa,
      cliente,
      numero_nf: nf,
      tipo: operationType, // <-- MUDANÇA 2: Usa o estado local em vez da prop
      user_id: userId,
    });

    setIsLoading(false);

    if (error) {
      setMessage({ type: 'error', text: `Erro ao cadastrar: ${error.message}` });
    } else {
      setMessage({ type: 'success', text: `Operação de ${operationType.toLowerCase()} cadastrada com sucesso!` });
      setTransportadora('');
      setPlaca('');
      setCliente('');
      setNf('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      {message && (
        <div className={`p-4 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* --- MUDANÇA 3: Novo campo para selecionar o tipo --- */}
      <div>
        <label htmlFor="operationType" className="block text-sm font-medium text-gray-700">Tipo da Operação</label>
        <select
          id="operationType"
          value={operationType}
          onChange={(e) => setOperationType(e.target.value as 'Retirada' | 'Entrega')}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 text-black"
        >
          <option value="Retirada">Retirada</option>
          <option value="Entrega">Entrega</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="transportadora" className="block text-sm font-medium text-gray-700">Transportadora</label>
          <input type="text" id="transportadora" value={transportadora} onChange={(e) => setTransportadora(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-black" />
        </div>
        <div>
          <label htmlFor="placa" className="block text-sm font-medium text-gray-700">Placa do Veículo</label>
          <input type="text" id="placa" value={placa} onChange={(e) => setPlaca(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-black" />
        </div>
        <div>
          <label htmlFor="cliente" className="block text-sm font-medium text-gray-700">Cliente</label>
          <input type="text" id="cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-black" />
        </div>
        <div>
          <label htmlFor="nf" className="block text-sm font-medium text-gray-700">Número da NF</label>
          <input type="text" id="nf" value={nf} onChange={(e) => setNf(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-black" />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[oklch(60%_0.118_184.704)] hover:bg-[oklch(80%_0.118_184.704)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
        >
          {/* --- MUDANÇA 4: Texto do botão genérico --- */}
          {isLoading ? 'Cadastrando...' : 'Cadastrar Operação'}
        </button>
      </div>
    </form>
  );
}