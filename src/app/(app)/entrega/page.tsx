// src/app/(app)/entrega/page.tsx

import OperationForm from '@/components/OperationForm';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function EntregaPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Cadastrar Nova Entrega</h1>
      <OperationForm type="Entrega" userId={user.id} />
    </div>
  );
}