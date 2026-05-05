// app/(auth)/login/page.tsx

'use client';

import { useState } from 'react';
import { Eye, EyeOff, Loader2, Lock, Mail, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isPending, setIsPending] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setIsPending(true);

    const fd = new FormData(e.currentTarget);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: fd.get('email'),
        password: fd.get('password'),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Email atau password salah.');
      setIsPending(false);
      return;
    }

    // Cookie sudah di-set oleh API route.
    // Hard redirect agar browser kirim request baru dengan cookie tersebut.
    window.location.href = '/beranda';
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="mb-4">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 4L4 20H10V40H22V28H26V40H38V20H44L24 4Z"
                  fill="#D97706"
                  fillOpacity="0.15"
                  stroke="#D97706"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M18 40V30H30V40"
                  stroke="#D97706"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 22L24 8L40 22"
                  stroke="#D97706"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">CV Akurat Sukses Sejati</h1>
            <p className="text-sm text-gray-500 mt-1">{showForgot ? 'Reset Password' : 'Masuk ke dashboard Anda'}</p>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-5 text-sm">
              <AlertCircle
                size={16}
                className="mt-0.5 shrink-0"
              />
              <span>{error}</span>
            </div>
          )}
          {successMsg && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-5 text-sm">{successMsg}</div>}

          {!showForgot ? (
            <form
              onSubmit={handleLogin}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="admin@example.com"
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    name="remember"
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 accent-purple-600"
                  />
                  <span className="text-sm text-gray-600">Ingat selama 30 hari</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(true);
                    setError('');
                  }}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Lupa password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors text-sm mt-2"
              >
                {isPending ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    Memproses...
                  </>
                ) : (
                  'Masuk'
                )}
              </button>
            </form>
          ) : (
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setError('');
                setSuccessMsg('');
                setIsPending(true);
                const email = (e.currentTarget.elements.namedItem('fp-email') as HTMLInputElement).value;
                const { createClient } = await import('@/lib/supabase/client');
                const supabase = createClient();
                const { error: fpError } = await supabase.auth.resetPasswordForEmail(email, {
                  redirectTo: `${window.location.origin}/reset-password`,
                });
                setIsPending(false);
                if (fpError) setError('Gagal mengirim email. Coba lagi.');
                else setSuccessMsg('Link reset password telah dikirim ke email Anda.');
              }}
            >
              <div>
                <label
                  htmlFor="fp-email"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Email Terdaftar
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="fp-email"
                    name="fp-email"
                    type="email"
                    required
                    placeholder="admin@example.com"
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
              >
                {isPending ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    Mengirim...
                  </>
                ) : (
                  'Kirim Link Reset'
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForgot(false);
                  setError('');
                  setSuccessMsg('');
                }}
                className="w-full text-sm text-gray-500 hover:text-gray-700 text-center mt-1"
              >
                ← Kembali ke halaman login
              </button>
            </form>
          )}
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">© {new Date().getFullYear()} CV Akurat Sukses Sejati</p>
      </div>
    </div>
  );
}
