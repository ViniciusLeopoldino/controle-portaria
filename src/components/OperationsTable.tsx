// src/components/OperationsTable.tsx

"use client";

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTransition } from 'react';
import { updateOperationStatus } from '@/app/actions'; // Importando a Server Action

type Operation = {
  id: string;
  created_at: string;
  transportadora: string;
  placa_veiculo: string | null;
  cliente: string;
  numero_nf: string;
  tipo: 'Retirada' | 'Entrega';
  status: 'Pendente' | 'Em Andamento' | 'Finalizado';
};

interface OperationsTableProps {
  operations: Operation[];
}

export default function OperationsTable({ operations }: OperationsTableProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (id: string, newStatus: Operation['status']) => {
    startTransition(() => {
      updateOperationStatus(id, newStatus);
    });
  };

  const getStatusComponent = (op: Operation) => {
    const baseClasses = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full disabled:opacity-50";
    
    switch (op.status) {
      case 'Pendente':
        return (
          <button
            onClick={() => handleStatusChange(op.id, 'Em Andamento')}
            disabled={isPending}
            className={`${baseClasses} bg-yellow-100 text-yellow-800 hover:bg-yellow-200`}
          >
            Pendente ➔
          </button>
        );
      case 'Em Andamento':
        return (
          <button
            onClick={() => handleStatusChange(op.id, 'Finalizado')}
            disabled={isPending}
            className={`${baseClasses} bg-blue-100 text-blue-800 hover:bg-blue-200`}
          >
            Em Andamento ➔
          </button>
        );
      case 'Finalizado':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800 cursor-not-allowed`}>
            Finalizado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {/* O cabeçalho da tabela continua o mesmo */}
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transportadora</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NF</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {operations.length === 0 ? (
            <tr><td colSpan={7} className="px-6 py-4 text-center text-gray-500">Nenhuma operação encontrada.</td></tr>
          ) : (
            operations.map((op) => (
              <tr key={op.id} className={isPending ? 'opacity-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{format(new Date(op.created_at), 'dd/MM/yy HH:mm', { locale: ptBR })}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{op.tipo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{op.transportadora}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{op.placa_veiculo || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{op.cliente}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{op.numero_nf}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusComponent(op)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
  );
}