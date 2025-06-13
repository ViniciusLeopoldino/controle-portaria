import DashboardClient from '@/components/DashboardClient';

// A página agora é um componente simples que renderiza o nosso novo componente de cliente.
export default function DashboardPage() {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard de Operações</h1>
      <DashboardClient />
    </div>
  );
}