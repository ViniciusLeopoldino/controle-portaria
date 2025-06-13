export type Operation = {
  id: string;
  created_at: string;
  transportadora: string;
  placa_veiculo: string | null;
  cliente: string;
  numero_nf: string;
  tipo: 'Retirada' | 'Entrega';
  status: 'Pendente' | 'Em Andamento' | 'Finalizado';
};
