// lib/hooks/useLogin.ts

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

// Kredensial akun demo — menggunakan akun superadmin yang aktif
const DEMO_EMAIL    = 'superadmin@gmail.com';
const DEMO_PASSWORD = 'password123';

export function useLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  
  const showForgotPasswordForm = () => {
    setShowForgot(true);
    setError('');
    setSuccessMsg('');
  };

  const showLoginForm = () => {
    setShowForgot(false);
    setError('');
    setSuccessMsg('');
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsPending(true);

    const fd = new FormData(e.currentTarget);
    const email = fd.get('email') as string;
    const password = fd.get('password') as string;

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message || 'Email atau password salah.');
        setIsPending(false);
        return;
      }

      // Hard redirect: browser akan membawa cookie session Supabase
      window.location.replace('/beranda');
    } catch {
      setError('Terjadi kesalahan saat masuk ke sistem.');
      setIsPending(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsPending(true);

    try {
      const email = (e.currentTarget.elements.namedItem('fp-email') as HTMLInputElement).value;
      const supabase = createClient();
      
      const { error: fpError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      setIsPending(false);
      
      if (fpError) {
        setError('Gagal mengirim email. Coba lagi.');
      } else {
        setSuccessMsg('Link reset password telah dikirim ke email Anda.');
      }
    } catch {
      setError('Terjadi kesalahan.');
      setIsPending(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setIsDemoLoading(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      });

      if (signInError) {
        setError(signInError.message || 'Gagal masuk dengan akun demo.');
        setIsDemoLoading(false);
        return;
      }

      window.location.replace('/beranda');
    } catch {
      setError('Terjadi kesalahan saat masuk ke akun demo.');
      setIsDemoLoading(false);
    }
  };

  return {
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
  };
}
