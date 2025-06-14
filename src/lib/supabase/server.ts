// src/lib/supabase/server.ts

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// O async/await que você adicionou está correto
export const createSupabaseServerClient = async () => { 
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => {
          return cookieStore.get(name)?.value
        },
        // Correção final aplicada aqui
        set: (name: string, value: string, options: CookieOptions) => {
          try {
            cookieStore.set({ name, value, ...options })
          } catch { // A variável de erro foi completamente removida
            // Ignorar erros em contextos onde a modificação de cookies não é permitida
            // (e.g., durante o rendering de Server Components)
          }
        },
        // Correção final aplicada aqui
        remove: (name: string, options: CookieOptions) => {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch { // A variável de erro foi completamente removida
            // Ignorar erros
          }
        },
      },
    }
  )
}
