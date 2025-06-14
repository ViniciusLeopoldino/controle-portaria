// src/app/login/page.tsx

"use client"; // 👈 Marque este componente como um Componente de Cliente

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

export default function LoginPage() {
  // Estados para os campos do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const router = useRouter();
  // Cria uma instância do cliente Supabase específica para o navegador
  const supabase = createClient();

  // Função para lidar com o envio do formulário de login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Previne o recarregamento da página
    setError(''); // Limpa erros anteriores

    try {
      // Tenta fazer o login com email e senha usando o Supabase Auth
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Se o Supabase retornar um erro, exibe-o para o usuário
        setError(error.message);
        return;
      }

      // Se o login for bem-sucedido, o Supabase armazena a sessão em um cookie.
      // Redirecionamos o usuário para a página principal.
      // router.refresh() é importante para recarregar o layout do servidor.
      router.push('/');
      router.refresh();

    } catch (error) {
            // Verificamos se 'error' é uma instância de Error para acessar 'message' com segurança.
            if (error instanceof Error) {
              return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
            }
            // Caso contrário, retornamos uma mensagem de erro genérica.
            return new NextResponse(JSON.stringify({ error: 'Ocorreu um erro desconhecido.' }), { status: 500 });
          }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Controle de Portaria
        </h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-3 py-2 mt-1 placeholder-black border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-2 mt-1 placeholder-black border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
            />
          </div>
          {error && (
            <p className="text-sm text-center text-red-600">{error}</p>
          )}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-[oklch(60%_0.118_184.704)] border border-transparent rounded-md shadow-sm hover:bg-[oklch(80%_0.118_184.704)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}