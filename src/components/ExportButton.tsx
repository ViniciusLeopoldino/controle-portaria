"use client";

import * as XLSX from 'xlsx';
import { Download } from 'lucide-react';
import { format } from 'date-fns';
import { type Operation } from '@/types/operation';

interface ExportButtonProps {
  operations: Operation[];
}

export default function ExportButton({ operations }: ExportButtonProps) {
  const handleExport = () => {
    if (!operations || operations.length === 0) {
      alert('Nenhum dado para exportar.');
      return;
    }
    
    const formattedData = operations.map((item) => ({
      'Data/Hora': format(new Date(item.created_at), 'dd/MM/yyyy HH:mm:ss'),
      'Tipo': item.tipo,
      'Status': item.status,
      'Transportadora': item.transportadora,
      'Placa': item.placa_veiculo,
      'Cliente': item.cliente,
      'Nota Fiscal': item.numero_nf,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatorio');
    
    const today = format(new Date(), 'yyyy-MM-dd');
    XLSX.writeFile(workbook, `Relatorio_Portaria_${today}.xlsx`);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center px-4 py-2 bg-[oklch(60%_0.118_184.704)] text-white rounded-md hover:bg-[oklch(80%_0.118_184.704)]"
    >
      <Download className="w-4 h-4 mr-2" />
      Baixar Relatório
    </button>
  );
}