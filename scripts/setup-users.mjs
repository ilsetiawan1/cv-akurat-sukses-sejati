// scripts/setup-users.mjs
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Error: Supabase URL and Service Key required.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Akun-akun terpisah & profesional untuk CV Akurat Sukses Sejati
const targetUsers = [
  {
    code: 'P01',
    name: 'Super Admin (Owner)',
    email: 'superadmin@gmail.com',
    password: 'password123',
    role: 'super_admin',
    permissions: [
      { feature: 'dashboard', can_create: true, can_read: true, can_update: true, can_delete: true },
      { feature: 'hak_akses', can_create: true, can_read: true, can_update: true, can_delete: true },
      { feature: 'data_master', can_create: true, can_read: true, can_update: true, can_delete: true },
      { feature: 'transaksi', can_create: true, can_read: true, can_update: true, can_delete: true },
      { feature: 'laporan', can_create: true, can_read: true, can_update: true, can_delete: true },
      { feature: 'pengaturan', can_create: true, can_read: true, can_update: true, can_delete: true },
    ],
  },
  {
    code: 'P02',
    name: 'Budi Santoso (Kepala Gudang)',
    email: 'gudang@cvakurat.com',
    password: 'password123',
    role: 'admin',
    permissions: [
      { feature: 'dashboard', can_create: false, can_read: true, can_update: false, can_delete: false },
      { feature: 'hak_akses', can_create: false, can_read: false, can_update: false, can_delete: false },
      { feature: 'data_master', can_create: true, can_read: true, can_update: true, can_delete: true },
      { feature: 'transaksi', can_create: true, can_read: true, can_update: true, can_delete: true },
      { feature: 'laporan', can_create: false, can_read: true, can_update: false, can_delete: false },
      { feature: 'pengaturan', can_create: false, can_read: false, can_update: false, can_delete: false },
    ],
  },
  {
    code: 'P03',
    name: 'Siti Rahma (Kasir)',
    email: 'kasir@cvakurat.com',
    password: 'password123',
    role: 'admin',
    permissions: [
      { feature: 'dashboard', can_create: false, can_read: true, can_update: false, can_delete: false },
      { feature: 'hak_akses', can_create: false, can_read: false, can_update: false, can_delete: false },
      { feature: 'data_master', can_create: false, can_read: true, can_update: false, can_delete: false },
      { feature: 'transaksi', can_create: true, can_read: true, can_update: false, can_delete: false },
      { feature: 'laporan', can_create: false, can_read: true, can_update: false, can_delete: false },
      { feature: 'pengaturan', can_create: false, can_read: false, can_update: false, can_delete: false },
    ],
  },
  {
    code: 'P04',
    name: 'Rian Hidayat (Teknisi & Servis)',
    email: 'servis@cvakurat.com',
    password: 'password123',
    role: 'admin',
    permissions: [
      { feature: 'dashboard', can_create: false, can_read: true, can_update: false, can_delete: false },
      { feature: 'hak_akses', can_create: false, can_read: false, can_update: false, can_delete: false },
      { feature: 'data_master', can_create: false, can_read: true, can_update: false, can_delete: false },
      { feature: 'transaksi', can_create: true, can_read: true, can_update: false, can_delete: false },
      { feature: 'laporan', can_create: false, can_read: false, can_update: false, can_delete: false },
      { feature: 'pengaturan', can_create: false, can_read: false, can_update: false, can_delete: false },
    ],
  },
  {
    code: 'P05',
    name: 'Agnez Mo (Keuangan)',
    email: 'keuangan@cvakurat.com',
    password: 'password123',
    role: 'admin',
    permissions: [
      { feature: 'dashboard', can_create: false, can_read: true, can_update: false, can_delete: false },
      { feature: 'hak_akses', can_create: false, can_read: false, can_update: false, can_delete: false },
      { feature: 'data_master', can_create: false, can_read: true, can_update: false, can_delete: false },
      { feature: 'transaksi', can_create: false, can_read: true, can_update: false, can_delete: false },
      { feature: 'laporan', can_create: true, can_read: true, can_update: true, can_delete: false },
      { feature: 'pengaturan', can_create: false, can_read: false, can_update: false, can_delete: false },
    ],
  },
];

async function cleanupAndSetupUsers() {
  console.log('🔄 Memperbarui & Memisahkan Akun Pengguna...\n');

  const { data: authUsersData } = await supabase.auth.admin.listUsers();
  const currentAuthUsers = authUsersData?.users || [];
  const targetEmails = targetUsers.map((u) => u.email);

  for (const au of currentAuthUsers) {
    if (!targetEmails.includes(au.email)) {
      console.log(`🗑️  Menghapus akun: ${au.email}`);
      await supabase.from('users').delete().eq('id', au.id);
      await supabase.auth.admin.deleteUser(au.id);
    }
  }

  for (const target of targetUsers) {
    let authUser = currentAuthUsers.find((u) => u.email === target.email);

    if (!authUser) {
      console.log(`➕ Membuat akun Auth: ${target.email} (${target.name})`);
      const { data: created, error } = await supabase.auth.admin.createUser({
        email: target.email,
        password: target.password,
        email_confirm: true,
        user_metadata: { name: target.name, role: target.role },
      });
      if (error) {
        console.error(`Gagal membuat auth ${target.email}:`, error.message);
        continue;
      }
      authUser = created.user;
    } else {
      console.log(`🔄 Mengupdate akun Auth: ${target.email} -> ${target.name}`);
      await supabase.auth.admin.updateUserById(authUser.id, {
        password: target.password,
        user_metadata: { name: target.name, role: target.role },
      });
    }

    // Upsert public.users
    await supabase.from('users').upsert({
      id: authUser.id,
      user_code: target.code,
      name: target.name,
      email: target.email,
      password_hash: 'MANAGED_BY_SUPABASE_AUTH',
      role: target.role,
      status: 'active',
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

    // Upsert permissions
    for (const perm of target.permissions) {
      await supabase.from('user_permissions').upsert({
        user_id: authUser.id,
        feature: perm.feature,
        can_create: perm.can_create,
        can_read: perm.can_read,
        can_update: perm.can_update,
        can_delete: perm.can_delete,
      }, { onConflict: 'user_id,feature' });
    }
  }

  console.log('\n🎉 Selesai! Kasir dan Servis sekarang sudah menjadi 2 peran terpisah.');
}

cleanupAndSetupUsers().catch((err) => {
  console.error('❌ Gagal:', err);
  process.exit(1);
});
