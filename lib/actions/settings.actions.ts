'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server-admin';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function updateProfileAction(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Sesi telah berakhir. Silakan login kembali.');

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const avatar = formData.get('avatar') as File;

    let avatar_url = formData.get('current_avatar') as string;

    // 1. Upload Avatar if exists
    if (avatar && avatar.size > 0) {
      const fileExt = avatar.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatar, { upsert: true });

      if (uploadError) throw new Error(`Gagal upload avatar: ${uploadError.message}`);

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
        
      avatar_url = publicUrl;
    }

    // 2. Update Auth (Password & Email)
    const authUpdatePayload: { email?: string; password?: string } = {};
    if (email && email !== user.email) authUpdatePayload.email = email;
    if (password && password.trim() !== '') authUpdatePayload.password = password;

    if (Object.keys(authUpdatePayload).length > 0) {
      const { error: authError } = await supabase.auth.updateUser(authUpdatePayload);
      if (authError) throw new Error(`Gagal update kredensial: ${authError.message}`);
    }

    // 3. Update public.users table (Name & Avatar)
    const adminSupabase = createAdminClient();
    const { error: dbError } = await adminSupabase
      .from('users')
      .update({ name, avatar_url })
      .eq('id', user.id);

    if (dbError) throw new Error(`Gagal update profil DB: ${dbError.message}`);

    // 4. Update Company Info via Cookies for Reports
    const companyName = formData.get('company_name') as string;
    const companyAddress = formData.get('company_address') as string;
    const cookieStore = await cookies();
    
    // Cookie valid for 1 year
    cookieStore.set('company_name', companyName || 'CV. AKURAT SUKSES SEJATI', { maxAge: 60 * 60 * 24 * 365 });
    cookieStore.set('company_address', companyAddress || '', { maxAge: 60 * 60 * 24 * 365 });

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal update profil';
    return { success: false, error: message };
  }
}

interface ManageItemPayload {
  id?: string;
  name?: string;
  description?: string;
}

export async function manageCategoryAction(action: 'add' | 'edit' | 'delete', payload: ManageItemPayload) {
  try {
    const supabase = createAdminClient();
    
    if (action === 'add') {
      const { error } = await supabase.from('categories').insert([{ name: payload.name ?? '', description: payload.description ?? '' }]);
      if (error) throw error;
    } else if (action === 'edit' && payload.id) {
      const { error } = await supabase.from('categories').update({ name: payload.name, description: payload.description }).eq('id', payload.id);
      if (error) throw error;
    } else if (action === 'delete' && payload.id) {
      // Data Integrity: Validasi Relasi Data Barang
      const { count, error: countError } = await supabase
        .from('items')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', payload.id);
        
      if (countError) throw countError;
      if (count && count > 0) {
        throw new Error('Kategori tidak bisa dihapus karena masih digunakan oleh data barang!');
      }

      const { error } = await supabase.from('categories').delete().eq('id', payload.id);
      if (error) throw error;
    }

    revalidatePath('/pengaturan');
    revalidatePath('/data-master/barang');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal mengelola kategori';
    return { success: false, error: message };
  }
}

export async function manageUnitAction(action: 'add' | 'edit' | 'delete', payload: ManageItemPayload) {
  try {
    const supabase = createAdminClient();
    
    if (action === 'add') {
      const { error } = await supabase.from('units').insert([{ name: payload.name ?? '', description: payload.description ?? '' }]);
      if (error) throw error;
    } else if (action === 'edit' && payload.id) {
      const { error } = await supabase.from('units').update({ name: payload.name, description: payload.description }).eq('id', payload.id);
      if (error) throw error;
    } else if (action === 'delete' && payload.id) {
      // Data Integrity: Validasi Relasi Data Barang
      const { count, error: countError } = await supabase
        .from('items')
        .select('*', { count: 'exact', head: true })
        .eq('unit_id', payload.id);
        
      if (countError) throw countError;
      if (count && count > 0) {
        throw new Error('Satuan tidak bisa dihapus karena masih digunakan oleh data barang!');
      }

      const { error } = await supabase.from('units').delete().eq('id', payload.id);
      if (error) throw error;
    }

    revalidatePath('/pengaturan');
    revalidatePath('/data-master/barang');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal mengelola satuan';
    return { success: false, error: message };
  }
}
