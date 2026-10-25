// supabase/scripts/seed.mjs
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
  console.log('🚀 Memulai Pembersihan & Seeding Ulang Database CV Akurat Sukses Sejati...\n');

  // 0. Clean Old Dirty Transactions & Inventory Data
  console.log('🧹 1. Membersihkan data transaksi dan inventaris lama...');
  await supabase.from('goods_issues').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('goods_receipts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('inventory').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('items').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // 1. Categories
  console.log('📦 2. Seeding Kategori...');
  const categories = ['AKI', 'SPAREPART', 'CHARGER', 'ANALITIK', 'PELUMAS'];
  const categoryMap = {};
  for (const cat of categories) {
    const { data } = await supabase.from('categories').upsert({ name: cat }, { onConflict: 'name' }).select().single();
    if (data) categoryMap[cat] = data.id;
  }

  // 2. Units
  console.log('📏 3. Seeding Satuan...');
  const units = ['UNIT', 'PCS', 'BOX', 'SET', 'BOTOL'];
  const unitMap = {};
  for (const u of units) {
    const { data } = await supabase.from('units').upsert({ name: u }, { onConflict: 'name' }).select().single();
    if (data) unitMap[u] = data.id;
  }

  // 3. Suppliers
  console.log('🏭 4. Seeding Supplier Otomotif...');
  const suppliers = [
    {
      supplier_code: 'S001',
      name: 'PT. Astra Otoparts Tbk',
      contact_name: 'Bambang Sudiro',
      email: 'sales@astra-otoparts.co.id',
      address: 'Jl. Pegangsaan Dua Km. 2.2, Kelapa Gading, Jakarta Utara',
      phone: '021-4603550',
    },
    {
      supplier_code: 'S002',
      name: 'PT. GS Battery Indonesia',
      contact_name: 'Hendra Wijaya',
      email: 'order@gs-battery.co.id',
      address: 'Kawasan Industri KIIC Lot. P-1, Karawang',
      phone: '0267-640123',
    },
    {
      supplier_code: 'S003',
      name: 'PT. Denso Sales Indonesia',
      contact_name: 'Rian Pratama',
      email: 'contact@denso.co.id',
      address: 'Jl. Gaya Motor I No. 6, Sunter II, Jakarta Utara',
      phone: '021-6512276',
    },
    {
      supplier_code: 'S004',
      name: 'PT. Dirgaputra Ekapratama',
      contact_name: 'Agus Kurniawan',
      email: 'sales@dirgaputra.com',
      address: 'Jl. Pulo Buaran Raya Blok III EE Kav. 2-3, Kawasan Industri Pulogadung',
      phone: '021-46825555',
    },
  ];
  const supplierMap = {};
  for (const sup of suppliers) {
    const { data } = await supabase.from('suppliers').upsert(sup, { onConflict: 'supplier_code' }).select().single();
    if (data) supplierMap[sup.supplier_code] = data.id;
  }

  // 4. Clean & Realistic Automotive Items (Total Modal ~Rp 31,5 Juta)
  console.log('🏷️  5. Seeding Master Suku Cadang & Inventaris Realistis...');
  const items = [
    {
      item_code: '000001',
      name: 'Aki GS Astra Hybrid NS40Z (35Ah)',
      category: 'AKI',
      unit: 'UNIT',
      price: 785000,
      stock: 10,
      hpp: 680000,
    },
    {
      item_code: '000002',
      name: 'Aki GS Astra Maintenance Free NS60 (45Ah)',
      category: 'AKI',
      unit: 'UNIT',
      price: 920000,
      stock: 8,
      hpp: 790000,
    },
    {
      item_code: '000003',
      name: 'Aki Yuasa Pafecta N50Z (60Ah)',
      category: 'AKI',
      unit: 'UNIT',
      price: 880000,
      stock: 6,
      hpp: 740000,
    },
    {
      item_code: '000004',
      name: 'Busi Iridium Tough Denso VK20 (Set 4 Pcs)',
      category: 'SPAREPART',
      unit: 'SET',
      price: 380000,
      stock: 12,
      hpp: 310000,
    },
    {
      item_code: '000005',
      name: 'Busi NGK CPR8EA-9 Nickel',
      category: 'SPAREPART',
      unit: 'PCS',
      price: 35000,
      stock: 25,
      hpp: 25000,
    },
    {
      item_code: '000006',
      name: 'Filter Oli Mobil Denso DXE-1001',
      category: 'SPAREPART',
      unit: 'PCS',
      price: 45000,
      stock: 15,
      hpp: 32000,
    },
    {
      item_code: '000007',
      name: 'Kampas Rem Depan Bendix GCT Avanza/Xenia',
      category: 'SPAREPART',
      unit: 'SET',
      price: 310000,
      stock: 6,
      hpp: 240000,
    },
    {
      item_code: '000008',
      name: 'V-Belt Gates Micro-V 4PK815',
      category: 'SPAREPART',
      unit: 'PCS',
      price: 110000,
      stock: 8,
      hpp: 80000,
    },
    {
      item_code: '000009',
      name: 'Smart Battery Charger 12V/24V 20A Digital',
      category: 'CHARGER',
      unit: 'UNIT',
      price: 550000,
      stock: 5,
      hpp: 440000,
    },
    {
      item_code: '000010',
      name: 'Battery Tester & Analyzer Digital 12V BT-500',
      category: 'ANALITIK',
      unit: 'UNIT',
      price: 1250000,
      stock: 2, // Stok kritis (<= 5)
      hpp: 1050000,
    },
    {
      item_code: '000011',
      name: 'Oli Mesin Shell Helix HX6 10W-40 (4 Liter)',
      category: 'PELUMAS',
      unit: 'BOTOL',
      price: 340000,
      stock: 8,
      hpp: 275000,
    },
    {
      item_code: '000012',
      name: 'Minyak Rem Prestone DOT 4 300ml',
      category: 'PELUMAS',
      unit: 'BOTOL',
      price: 48000,
      stock: 15,
      hpp: 35000,
    },
  ];

  const createdItems = {};
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const { data: itemData, error: itemError } = await supabase
      .from('items')
      .upsert(
        {
          item_code: item.item_code,
          name: item.name,
          category_id: categoryMap[item.category],
          unit_id: unitMap[item.unit],
          price: item.price,
        },
        { onConflict: 'item_code' }
      )
      .select()
      .single();

    if (itemError) {
      console.error(`Gagal seed item ${item.name}:`, itemError.message);
      continue;
    }

    if (itemData) {
      createdItems[item.item_code] = itemData;
      const invCode = `DP${String(i + 1).padStart(4, '0')}`;
      await supabase.from('inventory').upsert(
        {
          inventory_code: invCode,
          item_id: itemData.id,
          stock: item.stock,
          hpp: item.hpp,
        },
        { onConflict: 'inventory_code' }
      );
    }
  }

  // 5. Default Users & Permissions
  console.log('👤 6. Memastikan Akun Pengguna & Hak Akses...');
  const superAdminEmail = 'superadmin@gmail.com';
  const { data: userList } = await supabase.auth.admin.listUsers();
  const existingSuperAdmin = userList?.users?.find((u) => u.email === superAdminEmail);

  let superAdminId = existingSuperAdmin?.id;
  if (!existingSuperAdmin) {
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: superAdminEmail,
      password: 'password123',
      email_confirm: true,
      user_metadata: { name: 'Super Admin (Owner)', role: 'super_admin' },
    });
    if (createError) console.error('Error creating super admin auth:', createError);
    superAdminId = newUser?.user?.id;
  } else {
    await supabase.auth.admin.updateUserById(existingSuperAdmin.id, { password: 'password123' });
  }

  if (superAdminId) {
    await supabase.from('users').upsert(
      {
        id: superAdminId,
        user_code: 'P01',
        name: 'Super Admin (Owner)',
        email: superAdminEmail,
        password_hash: 'MANAGED_BY_SUPABASE_AUTH',
        role: 'super_admin',
        status: 'active',
      },
      { onConflict: 'id' }
    );

    // User permissions for superadmin
    const features = ['dashboard', 'hak_akses', 'data_master', 'transaksi', 'laporan', 'pengaturan'];
    for (const f of features) {
      await supabase.from('user_permissions').upsert(
        {
          user_id: superAdminId,
          feature: f,
          can_create: true,
          can_read: true,
          can_update: true,
          can_delete: true,
        },
        { onConflict: 'user_id,feature' }
      );
    }
  }

  // 6. Realistic Mutasi Terkini (Goods Receipts & Goods Issues)
  console.log('📋 7. Seeding Riwayat Mutasi Barang Terkini...');
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0];

  if (superAdminId && createdItems['000001'] && createdItems['000004'] && createdItems['000006']) {
    // Goods Receipts (Barang Masuk)
    await supabase.from('goods_receipts').upsert([
      {
        receipt_code: 'BM0001',
        item_id: createdItems['000001'].id,
        user_id: superAdminId,
        supplier_id: supplierMap['S002'] || Object.values(supplierMap)[0],
        quantity: 5,
        receipt_date: twoDaysAgo,
        total_price: 5 * 680000,
      },
      {
        receipt_code: 'BM0002',
        item_id: createdItems['000004'].id,
        user_id: superAdminId,
        supplier_id: supplierMap['S003'] || Object.values(supplierMap)[0],
        quantity: 6,
        receipt_date: yesterday,
        total_price: 6 * 310000,
      },
      {
        receipt_code: 'BM0003',
        item_id: createdItems['000006'].id,
        user_id: superAdminId,
        supplier_id: supplierMap['S001'] || Object.values(supplierMap)[0],
        quantity: 10,
        receipt_date: today,
        total_price: 10 * 32000,
      },
    ], { onConflict: 'receipt_code' });

    // Goods Issues (Barang Keluar)
    await supabase.from('goods_issues').upsert([
      {
        issue_code: 'BK0001',
        item_id: createdItems['000001'].id,
        user_id: superAdminId,
        quantity: 2,
        issue_date: yesterday,
        hpp: 680000,
        total_hpp: 2 * 680000,
      },
      {
        issue_code: 'BK0002',
        item_id: createdItems['000004'].id,
        user_id: superAdminId,
        quantity: 1,
        issue_date: today,
        hpp: 310000,
        total_hpp: 1 * 310000,
      },
    ], { onConflict: 'issue_code' });
  }

  console.log('\n✅ Seeding Selesai dengan Data Bersih & Realistis!');
  console.log('----------------------------------------------------');
  console.log('📦 Total SKU           : 12 Produk Otomotif');
  console.log('📊 Estimasi Total Modal: Rp 31.490.000 (~Rp 31,5 Juta)');
  console.log('⚠️  Stok Kritis (<=5)   : 1 Produk (Battery Tester BT-500)');
  console.log('🚚 Supplier Aktif      : 4 Rekanan Distributor');
  console.log('🔑 Akun Login Utama:');
  console.log('   Email   : superadmin@gmail.com');
  console.log('   Password: password123');
  console.log('----------------------------------------------------');
}

main().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
