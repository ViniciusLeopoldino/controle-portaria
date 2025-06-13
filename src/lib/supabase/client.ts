// src/lib/supabase/client.ts

// CORREÇÃO: A importação agora vem de '@supabase/ssr'
import { createBrowserClient } from '@supabase/ssr';

// O resto do código permanece exatamente o mesmo.
// Ele é compatível com a nova importação.

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );