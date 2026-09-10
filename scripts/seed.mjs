// scripts/seed.mjs
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be provided.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log('🚀 Starting Database Seeding for CV Akurat Sukses Sejati...\n');

  // 1. Categories
  console.log('📦 Seeding Categories...');
  const categories = ['AKI', 'SPAREPART', 'CHARGER', 'ANALITIK', 'AKSESORIS'];
  const categoryMap = {};
  for (const cat of categories) {
    const { data } = await supabase.from('categories').upsert({ name: cat }, { onConflict: 'name' }).select().single();
    if (data) categoryMap[cat] = data.id;
  }

  // 2. Units
  console.log('📏 Seeding Units...');
  const units = ['UNIT', 'PCS', 'BOX', 'SET'];
  const unitMap = {};
  for (const u of units) {
    const { data } = await supabase.from('units').upsert({ name: u }, { onConflict: 'name' }).select().single();
    if (data) unitMap[u] = data.id;
  }

  // 3. Suppliers
  console.log('🏭 Seeding Suppliers...');
  const suppliers = [
    { supplier_code: 'S001', name: 'PT. Astra Otoparts Tbk', contact_name: 'Bambang Sudiro', email: 'sales@astra-otoparts.co.id', address: 'Jl. Pegangsaan Dua Km. 2.2, Kelapa Gading, Jakarta Utara', phone: '021-4603550' },
    { supplier_code: 'S002', name: 'PT. GS Battery Indonesia', contact_name: 'Hendra Wijaya', email: 'order@gs-battery.co.id', address: 'Kawasan Industri KIIC Lot. P-1, Karawang', phone: '0267-640123' },
    { supplier_code: 'S003', name: 'PT. Denso Sales Indonesia', contact_name: 'Rian Pratama', email: 'contact@denso.co.id', address: 'Jl. Gaya Motor I No. 6, Sunter II, Jakarta Utara', phone: '021-6512276' },
  ];
  for (const sup of suppliers) {
    await supabase.from('suppliers').upsert(sup, { onConflict: 'supplier_code' });
  }

  // 4. Master Items
  console.log('🏷️  Seeding Master Items...');
  const items = [
    { item_code: '000001', name: 'Aki GS Astra Hybrid NS40Z (35Ah)', category: 'AKI', unit: 'UNIT', price: 785000, stock: 15, hpp: 680000 },
    { item_code: '000002', name: 'Aki GS Astra Maintenance Free NS60 (45Ah)', category: 'AKI', unit: 'UNIT', price: 920000, stock: 12, hpp: 790000 },
    { item_code: '000003', name: 'Busi Iridium Tough Denso VK20 (Set 4 Pcs)', category: 'SPAREPART', unit: 'SET', price: 380000, stock: 25, hpp: 310000 },
    { item_code: '000004', name: 'Smart Battery Charger 12V/24V 20A Digital', category: 'CHARGER', unit: 'UNIT', price: 550000, stock: 8, hpp: 440000 },
    { item_code: '000005', name: 'Battery Tester & Analyzer Digital 12V BT-500', category: 'ANALITIK', unit: 'UNIT', price: 1250000, stock: 4, hpp: 1050000 },
  ];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const { data: itemData } = await supabase.from('items').upsert({
      item_code: item.item_code,
      name: item.name,
      category_id: categoryMap[item.category],
      unit_id: unitMap[item.unit],
      price: item.price,
    }, { onConflict: 'item_code' }).select().single();

    if (itemData) {
      const invCode = `DP${String(i + 1).padStart(4, '0')}`;
      await supabase.from('inventory').upsert({
        inventory_code: invCode,
        item_id: itemData.id,
        stock: item.stock,
        hpp: item.hpp,
      }, { onConflict: 'inventory_code' });
    }
  }

  // 5. Default Users & Permissions
  console.log('👤 Ensuring Default Super Admin Account...');
  const superAdminEmail = 'superadmin@gmail.com';
  const { data: userList } = await supabase.auth.admin.listUsers();
  const existingSuperAdmin = userList?.users?.find((u) => u.email === superAdminEmail);

  let superAdminId = existingSuperAdmin?.id;
  if (!existingSuperAdmin) {
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: superAdminEmail,
      password: 'password123',
      email_confirm: true,
      user_metadata: { name: 'Super Admin', role: 'super_admin' },
    });
    if (createError) console.error('Error creating super admin auth:', createError);
    superAdminId = newUser?.user?.id;
  } else {
    await supabase.auth.admin.updateUserById(existingSuperAdmin.id, { password: 'password123' });
  }

  if (superAdminId) {
    await supabase.from('users').upsert({
      id: superAdminId,
      user_code: 'P01',
      name: 'Super Admin',
      email: superAdminEmail,
      password_hash: 'MANAGED_BY_SUPABASE_AUTH',
      role: 'super_admin',
      status: 'active',
    }, { onConflict: 'id' });
  }

  console.log('\n✅ Seeding Completed Successfully!');
  console.log('----------------------------------------------------');
  console.log('🔑 Default Login Credentials:');
  console.log('   Email   : superadmin@gmail.com');
  console.log('   Password: password123');
  console.log('   Role    : Super Admin (Full Access)');
  console.log('----------------------------------------------------');
}

main().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
