// src/app/cadastro/page.tsx

"use client";

import { useState } from 'react';
// import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

export default function SignupPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError('As senhas não correspondem.');
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Passando dados adicionais, como o nome do usuário
          data: {
            full_name: nome,
          },
          // URL para onde o usuário será redirecionado após confirmar o email
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccessMessage(
        'Conta criada com sucesso!'
      );
      
      // Limpa o formulário
      setNome('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

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
          Criar Nova Conta
        </h1>
        {successMessage ? (
          <div className="p-4 text-center text-green-800 bg-green-100 border border-green-300 rounded-md">
            <p>{successMessage}</p>
            <Link href="/login" className="mt-4 inline-block text-indigo-600 hover:underline">
              Ir para a página de Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-gray-700"
              >
                Nome Completo
              </label>
              <input
                id="nome"
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border rounded-md text-black"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border rounded-md text-black"
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
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border rounded-md text-black"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmar Senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border rounded-md text-black"
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
                Cadastrar
              </button>
            </div>
            <div className="text-sm text-center text-gray-600">
              <Link href="/login" className="font-medium text-[oklch(60%_0.118_184.704)] hover:text-[oklch(80%_0.118_184.704)]">
                Já tem uma conta? Faça o login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}