"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
// useRouter não é mais necessário aqui, podemos remover
// import { useRouter } from 'next/navigation'; 

interface OperationFormProps {
  type: 'Retirada' | 'Entrega';
  userId: string;
}

export default function OperationForm({ type, userId }: OperationFormProps) {
  // const router = useRouter(); // Não precisamos mais do router
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
      tipo: type,
      user_id: userId,
    });

    setIsLoading(false);

    if (error) {
      setMessage({ type: 'error', text: `Erro ao cadastrar: ${error.message}` });
    } else {
      setMessage({ type: 'success', text: `${type} cadastrada com sucesso!` });
      
      // Limpa o formulário para um novo lançamento
      setTransportadora('');
      setPlaca('');
      setCliente('');
      setNf('');

      // A lógica de redirecionamento foi removida daqui.
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      {message && (
        <div
          className={`p-4 rounded-md text-sm ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="transportadora" className="block text-sm font-medium text-gray-700">Transportadora</label>
          <input type="text" id="transportadora" value={transportadora} onChange={(e) => setTransportadora(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-gray-700" />
        </div>
        <div>
          <label htmlFor="placa" className="block text-sm font-medium text-gray-700">Placa do Veículo</label>
          <input type="text" id="placa" value={placa} onChange={(e) => setPlaca(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-gray-700" />
        </div>
        <div>
          <label htmlFor="cliente" className="block text-sm font-medium text-gray-700">Cliente</label>
          <input type="text" id="cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-gray-700" />
        </div>
        <div>
          <label htmlFor="nf" className="block text-sm font-medium text-gray-700">Número da NF</label>
          <input type="text" id="nf" value={nf} onChange={(e) => setNf(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-gray-700" />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
        >
          {isLoading ? 'Cadastrando...' : `Cadastrar ${type}`}
        </button>
      </div>
    </form>
  );
}