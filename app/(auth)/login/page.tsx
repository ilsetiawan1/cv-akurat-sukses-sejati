// app/(auth)/login/page.tsx

'use client';

import Image from 'next/image';
import { Eye, EyeOff, Loader2, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';
import { useLogin } from '@/lib/hooks/useLogin';

export default function LoginPage() {
  const {
    showPassword,
    showForgot,
    error,
    successMsg,
    isPending,
    isDemoLoading,
    togglePasswordVisibility,
    showForgotPasswordForm,
    showLoginForm,
    handleLoginSubmit,
    handleForgotPasswordSubmit,
    handleDemoLogin,
  } = useLogin();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="mb-4">
              <div className="relative w-12 h-12 overflow-hidden rounded-xl border border-purple-100 shadow-sm bg-purple-50">
                <Image
                  src="/logo-cv-akurat-sukses-sejati-bg-purple.png"
                  alt="Logo CV Akurat Sukses Sejati"
                  fill
                  sizes="48px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">CV Akurat Sukses Sejati</h1>
            <p className="text-sm text-gray-500 mt-1">{showForgot ? 'Reset Password' : 'Masuk ke dashboard Anda'}</p>
          </div>

          {/* ── Demo Login ── */}
          {!showForgot && (
            <div className="mb-5">
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isDemoLoading || isPending}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-all text-sm shadow-sm shadow-purple-200"
              >
                {isDemoLoading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Memuat...
                  </>
                ) : (
                  <>
                    <Sparkles size={15} />
                    Coba Demo
                  </>
                )}
              </button>
            </div>
          )}

          {/* ── Divider ── */}
          {!showForgot && (
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">atau</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
          )}

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
              onSubmit={handleLoginSubmit}
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
                    onClick={togglePasswordVisibility}
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
                  onClick={showForgotPasswordForm}
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
              onSubmit={handleForgotPasswordSubmit}
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
                onClick={showLoginForm}
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
