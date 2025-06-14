// src/app/(app)/portaria/page.tsx

import OperationForm from '@/components/OperationForm';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function PortariaPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Lançamento de Portaria</h1>
      {/* Renderiza o formulário passando apenas o ID do usuário */}
      <OperationForm userId={user.id} />
    </div>
  );
}