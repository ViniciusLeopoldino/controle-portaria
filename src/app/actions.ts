"use server";

import { createSupabaseServerClient } from '@/lib/supabase/server';

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
  
  // A linha revalidatePath foi removida daqui, pois a atualização agora é controlada no cliente.

  return { success: true, message: 'Status atualizado com sucesso!' };
}