// app/(auth)/login/page.tsx

'use client';

import Image from 'next/image';
import { Eye, EyeOff, Loader2, Lock, Mail, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-gray-50 overflow-hidden">
      {/* ── Top Half Background Image with Gradient Blur Fade ── */}
      <div 
        className="absolute inset-x-0 top-0 h-[50vh] sm:h-[55vh] z-0 overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg-login-page.avif')" }}
      >
        {/* Dark subtle tint overlay */}
        <div className="absolute inset-0 bg-slate-950/20" />
        {/* Smooth Gradient + Blur Transition to bottom background */}
        <div className="absolute inset-x-0 bottom-0 h-40 sm:h-52 bg-linear-to-b from-transparent via-gray-50/80 to-gray-50 backdrop-blur-[3px]" />
      </div>

      {/* ── Main Login Card ── */}
      <div className="relative z-10 w-full max-w-md my-8">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-900/10 border border-white/80 p-7 sm:p-8">
          <div className="flex flex-col items-center mb-7">
            <div className="mb-3.5">
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
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">CV Akurat Sukses Sejati</h1>
            <p className="text-sm text-gray-500 mt-1">{showForgot ? 'Reset Password' : 'Masuk ke dashboard sistem persediaan'}</p>
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
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-gray-400"
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
                    className="w-full pl-9 pr-10 py-2.5 text-sm bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
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
                    className="w-4 h-4 rounded border-gray-300 accent-purple-600 cursor-pointer"
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

              {/* Tombol Utama: Masuk */}
              <button
                type="submit"
                disabled={isPending || isDemoLoading}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors text-sm shadow-sm shadow-purple-200 mt-2 cursor-pointer"
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

              {/* Divider Pemisah */}
              <div className="relative flex items-center justify-center pt-2">
                <div className="w-full border-t border-gray-200" />
                <span className="absolute bg-white px-3 text-xs text-gray-400 font-medium">atau</span>
              </div>

              {/* Tombol Sekunder: Coba Demo (Warna berbeda & Tanpa Icon) */}
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isDemoLoading || isPending}
                className="w-full flex items-center justify-center gap-2 bg-purple-50 hover:bg-purple-100 active:bg-purple-200/80 border border-purple-200 text-purple-700 disabled:opacity-60 disabled:cursor-not-allowed font-medium py-2.5 rounded-lg transition-all text-sm cursor-pointer shadow-xs"
              >
                {isDemoLoading ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    Memuat Demo...
                  </>
                ) : (
                  'Coba Demo'
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
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-colors text-sm cursor-pointer"
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
                className="w-full text-sm text-gray-500 hover:text-gray-700 text-center mt-1 cursor-pointer"
              >
                ← Kembali ke halaman login
              </button>
            </form>
          )}
        </div>
        <p className="text-center text-xs text-gray-500 mt-5 drop-shadow-xs">© {new Date().getFullYear()} CV Akurat Sukses Sejati</p>
      </div>
    </div>
  );
}
