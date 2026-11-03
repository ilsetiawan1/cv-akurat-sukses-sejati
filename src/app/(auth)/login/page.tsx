// src/app/(auth)/login/page.tsx
'use client';

import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLogin } from '@/features/auth/hooks/useLogin';

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
    <div className="min-h-screen w-full bg-[#dce7f6] flex items-center justify-center p-3 sm:p-6 lg:p-8 selection:bg-blue-100 selection:text-blue-900">
      
      {/* ── Main Container Card (Floating Rounded SaaS Card) ── */}
      <div className="w-full max-w-5xl bg-white rounded-3xl sm:rounded-4xl shadow-2xl shadow-blue-900/10 border border-white/80 p-3 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 my-auto">
        
        {/* ── SISI KIRI: Formulir Login (Clean & Left-Aligned) ── */}
        <div className="p-5 sm:p-8 md:p-6 lg:p-10 flex flex-col justify-between">
          
          <div className="w-full max-w-sm mx-auto my-auto py-2">
            
            {/* Header: Judul & Subteks */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {showForgot ? 'Pemulihan Akun' : 'Masuk ke Akun'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                {showForgot
                  ? 'Masukkan email terdaftar untuk menerima tautan pemulihan kata sandi.'
                  : 'Kelola stok suku cadang, mutasi persediaan, dan kalkulasi HPP.'}
              </p>
            </div>

            {/* Notifikasi Error */}
            {error && (
              <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-3.5 py-2.5 mb-5 text-xs animate-in fade-in duration-150">
                <AlertCircle size={15} className="mt-0.5 shrink-0 text-rose-600" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Notifikasi Sukses */}
            {successMsg && (
              <div className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-3.5 py-2.5 mb-5 text-xs animate-in fade-in duration-150">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-600" />
                <span className="leading-snug">{successMsg}</span>
              </div>
            )}

            {!showForgot ? (
              /* Formulir Login Utama */
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Email atau ID Pengguna
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="nama@perusahaan.com"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all placeholder:text-slate-400 text-slate-800"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="w-full px-3.5 pr-10 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all placeholder:text-slate-400 text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
                      tabIndex={-1}
                      title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Utility Row: Ingat Saya & Lupa Password */}
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      name="remember"
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 accent-[#1E3A8A] cursor-pointer"
                    />
                    <span className="text-xs text-slate-600">Ingat saya</span>
                  </label>
                  <button
                    type="button"
                    onClick={showForgotPasswordForm}
                    className="text-xs font-medium text-[#1E3A8A] hover:text-blue-800 hover:underline transition-colors cursor-pointer"
                  >
                    Lupa password?
                  </button>
                </div>

                {/* Tombol Primer: Masuk */}
                <button
                  type="submit"
                  disabled={isPending || isDemoLoading}
                  className="w-full min-h-11 flex items-center justify-center gap-2 bg-[#1E3A8A] hover:bg-blue-800 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-xl transition-all text-xs sm:text-sm shadow-2xs mt-2 cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <span>Masuk ke Sistem</span>
                  )}
                </button>

                {/* Divider Pemisah */}
                <div className="relative flex items-center justify-center my-3">
                  <div className="w-full border-t border-slate-200" />
                  <span className="absolute bg-white px-3 text-xs text-slate-400 font-normal">
                    atau
                  </span>
                </div>

                {/* Tombol Sekunder: Akses Demo (Clean tanpa Icon) */}
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={isDemoLoading || isPending}
                  className="w-full min-h-11 flex items-center justify-center bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200 text-slate-700 disabled:opacity-60 disabled:cursor-not-allowed font-medium py-2.5 px-4 rounded-xl transition-colors text-xs sm:text-sm cursor-pointer shadow-2xs"
                >
                  {isDemoLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={15} className="animate-spin text-slate-500" />
                      <span>Menyiapkan Demo...</span>
                    </span>
                  ) : (
                    <span>Coba Akun Demo</span>
                  )}
                </button>
              </form>
            ) : (
              /* Formulir Lupa Password */
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="fp-email"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Email Terdaftar
                  </label>
                  <input
                    id="fp-email"
                    name="fp-email"
                    type="email"
                    required
                    placeholder="nama@perusahaan.com"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all placeholder:text-slate-400 text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full min-h-11 flex items-center justify-center gap-2 bg-[#1E3A8A] hover:bg-blue-800 disabled:opacity-60 text-white font-medium py-2.5 px-4 rounded-xl transition-all text-xs sm:text-sm shadow-2xs cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Mengirim Tautan...</span>
                    </>
                  ) : (
                    <span>Kirim Link Pemulihan</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={showLoginForm}
                  className="w-full text-xs font-medium text-slate-500 hover:text-slate-800 text-center py-2 transition-colors cursor-pointer block"
                >
                  ← Kembali ke halaman login
                </button>
              </form>
            )}
          </div>

          {/* Footer Form */}
          <div className="pt-4 text-center sm:text-left text-xs text-slate-400">
            © {new Date().getFullYear()} CV Akurat Sukses Sejati
          </div>
        </div>

        {/* ── SISI KANAN: Hero Visual Showcase (Nested Card - Aktif pada Tablet md & Desktop lg) ── */}
        <div className="hidden md:flex rounded-2xl sm:rounded-3xl overflow-hidden relative min-h-115 md:min-h-120 lg:min-h-125 flex-col justify-between p-6 sm:p-8 lg:p-10 bg-slate-950">
          
          {/* Background Visual Otomotif Presisi */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
            style={{ backgroundImage: "url('/bg-login-page.avif')" }}
          />

          {/* Clean Deep Navy Gradient Overlay */}
          <div className="absolute inset-0 z-1 bg-linear-to-t from-slate-950 via-slate-950/70 to-slate-900/40" />

          {/* Top: Brand Heading Bersih */}
          <div className="relative z-10">
            <span className="font-bold tracking-wider text-sm text-white/90 uppercase block">
              CV. AKURAT SUKSES SEJATI
            </span>
          </div>

          {/* Bottom: Statement Card (Simple 1 Kalimat Pendek) */}
          <div className="relative z-10 bg-slate-900/60 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 shadow-xl space-y-1.5">
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              Sistem manajemen persediaan suku cadang otomotif dan kalkulasi HPP Moving Average terpadu.
            </p>
            <p className="text-2xs sm:text-xs text-slate-400 font-medium">
              CV Akurat Sukses Sejati
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
