// lib\hooks\useLogin.ts

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function useLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isPending, setIsPending] = useState(false);

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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'same-origin', // pastikan browser menyimpan Set-Cookie dari response
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Email atau password salah.');
        setIsPending(false);
        return;
      }

      // Hard redirect: browser akan membawa cookie session yang baru di-set
      window.location.replace('/beranda');
    } catch (err) {
      setError('Terjadi kesalahan jaringan.');
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
      const { createClient } = await import('@/lib/supabase/client');
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
    } catch (err) {
      setError('Terjadi kesalahan.');
      setIsPending(false);
    }
  };

  return {
    showPassword,
    showForgot,
    error,
    successMsg,
    isPending,
    togglePasswordVisibility,
    showForgotPasswordForm,
    showLoginForm,
    handleLoginSubmit,
    handleForgotPasswordSubmit
  };
}
