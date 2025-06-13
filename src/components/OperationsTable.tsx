"use client";

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTransition } from 'react';
import { updateOperationStatus } from '@/app/actions';
import { type Operation } from '@/types/operation';

interface OperationsTableProps {
  operations: Operation[];
  onStatusChange: () => void; // <-- Recebendo a nova prop
}

export default function OperationsTable({ operations, onStatusChange }: OperationsTableProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = async (id: string, newStatus: Operation['status']) => {
    startTransition(async () => {
      const result = await updateOperationStatus(id, newStatus);
      if (result.success) {
        // Se a atualização deu certo, chama a função do componente pai
        onStatusChange(); 
      }
    });
  };

  const getStatusComponent = (op: Operation) => {
    const baseClasses = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full disabled:opacity-50 cursor-pointer";
    
    switch (op.status) {
      case 'Pendente':
        return (
          <button
            onClick={() => handleStatusChange(op.id, 'Em Andamento')}
            disabled={isPending}
            className={`${baseClasses} bg-yellow-200 text-yellow-900 hover:bg-yellow-300`}
          >
            Pendente ➔
          </button>
        );
      case 'Em Andamento':
        return (
          <button
            onClick={() => handleStatusChange(op.id, 'Finalizado')}
            disabled={isPending}
            className={`${baseClasses} bg-blue-200 text-blue-900 hover:bg-blue-300`}
          >
            Em Andamento ➔
          </button>
        );
      case 'Finalizado':
        return (
          <span className={`${baseClasses} bg-green-200 text-green-900 cursor-not-allowed`}>
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
          <tr>
            <td colSpan={7} className="px-6 py-4 text-center text-gray-500">Nenhuma operação encontrada.</td>
          </tr>
        ) : (
          operations.map((op) => (
            <tr
              key={op.id}
              className={`${isPending ? 'opacity-50' : ''} ${op.status === 'Pendente' ? 'bg-yellow-300 animate-pulse' : ''}`}
            >
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