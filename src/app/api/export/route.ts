// src/app/api/export/route.ts

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { startOfToday, parseISO, endOfDay } from 'date-fns';

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { searchParams } = new URL(request.url);
    
    // Lógica de busca IDÊNTICA à da página do dashboard
    let query = supabase.from('operacoes').select('*');

    if (searchParams.get('search')) {
      const searchTerm = `%${searchParams.get('search')}%`;
      query = query.or(`transportadora.ilike.${searchTerm},cliente.ilike.${searchTerm},numero_nf.ilike.${searchTerm}`);
    }
    if (searchParams.get('status')) {
      query = query.eq('status', searchParams.get('status')!);
    }
    const startDate = searchParams.get('startDate') ? parseISO(searchParams.get('startDate')!) : startOfToday();
    const endDate = searchParams.get('endDate') ? endOfDay(parseISO(searchParams.get('endDate')!)) : endOfDay(startOfToday());
    
    query = query.gte('created_at', startDate.toISOString());
    query = query.lte('created_at', endDate.toISOString());
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    
    if (error) throw error;

    return NextResponse.json(data);

  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}