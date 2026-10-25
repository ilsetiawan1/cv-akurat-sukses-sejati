// app/(dashboard)/beranda/page.tsx
import { redirect } from 'next/navigation';

export default function BerandaRedirectPage() {
  redirect('/dashboard');
}