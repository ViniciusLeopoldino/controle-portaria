// src/app/actions.ts

"use server"; // Define que todas as funções neste arquivo são Server Actions

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

type Status = 'Pendente' | 'Em Andamento' | 'Finalizado';

export async function updateOperationStatus(operationId: string, newStatus: Status) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from('operacoes')
    .update({ status: newStatus })
    .eq('id', operationId);

  if (error) {
    console.error('Erro ao atualizar status:', error);
    return { success: false, message: error.message };
  }

  // Informa ao Next.js para revalidar os dados da página do dashboard
  revalidatePath('/dashboard');
  
  return { success: true, message: 'Status atualizado com sucesso!' };
}