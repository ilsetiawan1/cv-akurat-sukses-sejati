# CMS & Admin UI Guidelines: Modern Minimalist Border-Crafted Design System

Dokumen ini adalah panduan arsitektur visual dan spesifikasi antarmuka (Single Source of Truth) untuk aplikasi Admin / CMS modern. Mengusung gaya **Border-Crafted UI (Modern SaaS Minimalist)**: desain yang bersih, kontras tinggi, ringan diproses mata, berbasis hairline border 1px presisi, dan sepenuhnya bebas dari elemen generik AI (*anti-slop*).

---

## 1. Filosofi Inti: Border-Crafted UI

1. **Hairline Precision over Drop Shadows:** Kedalaman visual tidak diciptakan melalui bayangan tebal (`shadow-lg` / `shadow-2xl`) yang membuat tampilan tampak kotor, melainkan melalui garis batas presisi 1px (`border-slate-200/80` atau `border-gray-200/80`).
2. **High-Contrast Neutral Surfaces:** Mengutamakan kontras tegas antara teks hitam solid (`text-slate-900`), teks sekunder abu-abu tenang (`text-slate-500`), dan permukaan latar abu-abu netral sangat terang (`slate-50`).
3. **Calm & Functional Workspace:** Antarmuka admin ditujukan untuk pekerjaan berulang dalam durasi lama. Warna aksen hanya digunakan pada status atau aksi utama, menghindari elemen dekoratif yang tidak memiliki tujuan fungsional.
4. **Layout Symmetry & Visual Calm:** Setiap kartu informasi dan tombol pada baris yang sama wajib dikunci dengan tinggi dan posisi yang simetris sehingga layout tidak bergelombang.

---

## 2. Surface, Canvas & Background Tokens

| Elemen Antarmuka | Token / Kelas Tailwind | Prinsip Desain |
| :--- | :--- | :--- |
| **Kanvas Utama (Viewport)** | `bg-[#f8f9fa]` atau `bg-[#f8fafc]` | Slate-50 netral terang. **Wajib:** Dilarang menggunakan putih murni (`#ffffff`) pada background halaman agar kartu konten memiliki pemisah kontras yang tegas. |
| **Cards & Container** | `bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:border-slate-300 transition-all` | Sudut membulat 16px (`rounded-2xl`), hairline border 1px, padding seragam `p-4 sm:p-5`, shadow mikro. |
| **Sticky Topbar** | `h-16 w-full bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-20 shrink-0` | Menempel dari batas sidebar hingga ujung kanan layar tanpa radius membulat atau floating margin. |
| **Backdrop Modal** | `fixed inset-0 z-[9999] bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4` | Gelap transparan dengan blur minimalis untuk fokus visual. |
| **Modal Container** | `bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden flex flex-col justify-between max-h-[90vh]` | Dialog modular putih bersih dengan batas border presisi dan tombol tutup di pojok kanan atas. |

---

## 3. Navigasi & Sidebar Architecture

Arsitektur sidebar dirancang fleksibel untuk desktop, tablet, dan mobile.

### 3.1. Struktur Desktop Dock (Collapsible)
* **Wadah Utama:**
  ```text
  hidden md:flex flex-col justify-between shrink-0 bg-white border-r border-gray-200/80 p-4 sm:p-5 h-screen sticky top-0 transition-all duration-300 ease-in-out z-30
  ```
* **Lebar Dinamis:** `w-64` saat diperluas, dan `w-[72px]` saat diciutkan (icon-only mode). State ciutkan/perluas disimpan di `localStorage`.
* **Flat 1-Level Navigation:** Semua menu berformat tautan langsung (`<a>` atau `<Link>`). Dilarang menggunakan accordion, dropdown, atau sub-menu bersarang di sidebar.

### 3.2. State Item Menu Navigasi
* **Item Aktif:**
  ```text
  bg-slate-50 border border-slate-200/90 text-slate-900 font-semibold text-xs rounded-xl shadow-xs px-3 py-2.5 flex items-center justify-between
  ```
  *(Ikon navigasi aktif: `text-slate-900`)*
* **Item Inaktif:**
  ```text
  text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium text-xs rounded-xl border border-transparent px-3 py-2.5 transition-all flex items-center justify-between
  ```
  *(Ikon navigasi inaktif: `text-slate-400 group-hover:text-slate-700`)*
* **Label Kategori / Section:**
  ```text
  text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 mb-1.5 block
  ```
* **Pill Badge Menu:**
  ```text
  text-[10px] font-medium tracking-wide px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80
  ```

### 3.3. Footer Profil Pengguna (SidebarProfile)
* Card minimalis di bagian bawah sidebar:
  ```text
  flex items-center justify-between rounded-xl bg-white border border-gray-200/70 p-2 shadow-2xs
  ```
* Avatar inisial: Kotak membulat solid hitam (`w-8 h-8 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center`).
* Teks pengguna: Nama tebal (`text-xs font-semibold text-slate-800 truncate`) dan role (`text-[10px] text-slate-400 truncate`).
* Tombol keluar: Ikon ringkas dengan efek hover merah halus (`p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 transition-colors`).

---

## 4. Komponen Inti & Button Hierarchy

Hierarki tombol dirancang tegas agar pengguna langsung mengenali tindakan utama tanpa kebingungan.

### 4.1. Primary Action Button (+ Tambah / Submit Utama)
Digunakan untuk aksi utama seperti pembuatan data baru, simpan transaksi, atau check-in:
```text
inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 shadow-xs active:scale-95 transition-all whitespace-nowrap cursor-pointer disabled:opacity-50
```

### 4.2. Secondary / Action Button (Outline / Edit / Filter)
Digunakan untuk aksi pendukung seperti edit data, atur tarif, atau buka detail:
```text
h-9 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 shadow-2xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer
```

### 4.3. Destructive Action Button (Batal / Hapus / Check-Out)
Menggunakan aksen soft rose/merah muda dengan teks merah tua, bukan blok merah solid agresif:
```text
h-9 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 font-semibold text-xs transition-colors shadow-2xs flex items-center justify-center gap-1.5 px-3 cursor-pointer
```

### 4.4. Quick Action Icon Button (Refresh / WhatsApp / Eksternal)
Tombol ikon bujur sangkar presisi:
```text
w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs flex items-center justify-center shrink-0 cursor-pointer
```

---

## 5. Layout Simetri Grid & Symmetrical Cards

Sistem kartu operasional (seperti kartu kamar, produk, atau transaksi) wajib menjaga simetri tinggi baris:

```text
bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-colors p-4 sm:p-5 flex flex-col justify-between h-full group
```

### 5.1. Aturan Tiga Zona Kartu
1. **Zona Atas (Header Kartu):** Berisi kode identitas (badge `#A1`), nama entitas, dan status operasional.
2. **Zona Tengah (Middle Slot):** Berisi detail kondisi/data dinamis.
   * **Wajib:** Menggunakan tinggi minimum tetap (`min-h-[64px]` hingga `min-h-[76px]`). Baik saat data penuh maupun kosong, slot ini tidak boleh menyusut.
   * State kosong pada slot tengah menggunakan border putus-putus halus:
     ```text
     min-h-[76px] p-2.5 rounded-xl bg-slate-50/50 border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400
     ```
3. **Zona Bawah (Tombol Aksi):** Selalu dirapatkan ke dasar kartu dengan `mt-auto pt-3 border-t border-slate-100 w-full`. Hal ini memastikan seluruh tombol pada satu baris grid sejajar sempurna.

---

## 6. Dual-Viewport Filter Pattern

Pola penyaringan data yang adaptif terhadap ukuran layar:

### 6.1. Mobile & Tablet View (`< lg`)
Menggunakan dropdown select tunggal yang ringkas agar tidak memakan ruang vertikal layar kecil:
```html
<div className="relative w-40 sm:w-48 shrink-0">
  <select className="w-full h-9 appearance-none bg-white border border-slate-200/80 hover:border-slate-300 rounded-xl pl-3.5 pr-8 text-xs font-medium text-slate-800 shadow-2xs outline-none cursor-pointer">
    <option value="all">Semua Data</option>
    <option value="active">Aktif</option>
  </select>
  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
</div>
```

### 6.2. Desktop View (`>= lg`)
Menggunakan baris segmented pill buttons horizontal:
* **Pill Aktif:**
  ```text
  bg-slate-900 text-white font-semibold shadow-xs px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer
  ```
* **Pill Inaktif:**
  ```text
  bg-white/60 hover:bg-white text-slate-600 hover:text-slate-900 font-medium border border-slate-200/60 hover:border-slate-300 px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer
  ```
* **Indikator Hitungan Angka:**
  ```text
  text-[10px] px-1.5 py-0.5 rounded-md font-mono leading-none (bg-white/20 text-white saat aktif, bg-slate-100 text-slate-600 saat inaktif)
  ```

---

## 7. Semantic Status Badges

Setiap status operasional disajikan dalam bentuk pill lonjong halus dengan dot indikator bulat `w-1.5 h-1.5`:

| Status | Badge Container Class | Dot Indikator Class | Makna Semantik |
| :--- | :--- | :--- | :--- |
| **Ready / Sukses** | `bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5` | `w-1.5 h-1.5 rounded-full bg-emerald-500` | Tersedia / Transaksi selesai |
| **Occupied / Aktif** | `bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5` | `w-1.5 h-1.5 rounded-full bg-slate-600` | Sedang berjalan / In-house |
| **Warning / Pending** | `bg-amber-50 text-amber-700 border border-amber-200/80 text-[10px] font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5` | `w-1.5 h-1.5 rounded-full bg-amber-500` | Menunggu aksi / Perlu dibersihkan |
| **Danger / Trouble** | `bg-rose-50 text-rose-700 border border-rose-200/80 text-[10px] font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5` | `w-1.5 h-1.5 rounded-full bg-rose-500` | Perbaikan / Error / Dibatalkan |
| **Identifier Kode** | `w-8 h-8 rounded-xl bg-slate-100 text-slate-800 border border-slate-200/80 font-bold text-xs flex items-center justify-center tabular-nums` | *(Tanpa dot)* | Penanda kode unit (misal: `#A1`) |

---

## 8. Data Table & List Layout

Tabel data admin dirancang ringan dengan garis pemisah hairline halus:

```html
<div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
  <!-- Table Header Bar -->
  <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div>
      <h3 className="text-sm font-bold text-slate-900 tracking-tight">Judul Tabel Data</h3>
      <p className="text-xs text-slate-400 mt-0.5">Ringkasan keterangan data tabel</p>
    </div>
  </div>

  <!-- Table Body -->
  <div className="overflow-x-auto">
    <table className="w-full text-left text-xs">
      <thead className="bg-[#faf9fc] text-slate-400 font-semibold border-b border-slate-200/60 uppercase tracking-wider text-[10px]">
        <tr>
          <th className="py-3 px-4 sm:px-5">Kolom Utama</th>
          <th className="py-3 px-4 sm:px-5">Kategori</th>
          <th className="py-3 px-4 sm:px-5">Status</th>
          <th className="py-3 px-4 sm:px-5 text-right">Aksi</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
        <tr className="hover:bg-[#faf9fc] transition-colors">
          <td className="py-3.5 px-4 sm:px-5 font-bold text-slate-900">Nama Data</td>
          <td className="py-3.5 px-4 sm:px-5 text-slate-500">Kategori A</td>
          <td className="py-3.5 px-4 sm:px-5">
            <span className="badge...">Aktif</span>
          </td>
          <td className="py-3.5 px-4 sm:px-5 text-right">
            <button className="text-xs font-semibold text-slate-900 hover:underline">Kelola</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

---

## 9. Form Controls & Input Styling

Standar input form pada pengaturan CMS atau modal input data:

### 9.1. Input Text / Number (Mode Edit Aktif)
```text
w-full h-10 px-3.5 text-sm bg-white border border-slate-900/30 focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 text-slate-900 rounded-xl shadow-2xs outline-none transition-all placeholder:text-slate-400
```

### 9.2. Input Disabled (Mode Pratinjau / Read-only)
```text
w-full h-10 px-3.5 text-sm bg-slate-50/70 border border-slate-200/60 text-slate-800 rounded-xl shadow-2xs outline-none cursor-not-allowed transition-all
```

### 9.3. Label & Tooltip Penjelasan
```text
text-xs font-medium text-slate-700 mb-1.5 inline-flex items-center gap-1.5
```
*(Tooltip ikon: `w-3.5 h-3.5 text-slate-400 hover:text-slate-700 cursor-pointer`)*

---

## 10. Tipografi & Standar Format Data

* **Keluarga Font:** `Plus Jakarta Sans`, `Inter`, `sans-serif`.
* **Hierarki Judul Halaman:**
  * Title: `text-xl md:text-2xl font-bold text-slate-900 tracking-tight`.
  * Subtitle: `text-xs md:text-sm text-slate-500 mt-1`.
  * Card Heading: `text-sm font-bold text-slate-900`.
  * Sub-card Label: `text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400`.
* **Format Mata Uang:**
  * Format standar: `Rp 250.000` menggunakan kelas `tabular-nums` agar lebar angka sejajar.
  * Awalan simbol `Rp` dapat diberi warna lebih tenang: `<span className="text-slate-400 text-lg">Rp</span> <span className="tabular-nums">250.000</span>`.
* **Format Waktu & Tanggal:**
  * Wajib format lokal ramah manusia (misal: `Rab, 21 Okt 2026 • 12:35 WIT` atau `21 Okt 2026, 14:00`).
  * Dilarang menampilkan format ISO string mentah (`2026-10-21T05:35:00.000Z`).

---

## 11. Anti-Slop Guardrails (Larangan Mutlak & Quality Checklist)

Daftar larangan wajib untuk mencegah penurunan kualitas desain menjadi tampilan template generik AI:

1. **Dilarang Drop Shadow Tebal:** Shadow dibatasi maksimal `shadow-xs` atau `shadow-2xs`. Dilarang menggunakan `shadow-lg`, `shadow-xl`, atau `shadow-2xl` pada kartu reguler.
2. **Dilarang Warna Ungu / Gradien Klise AI:** Dilarang tombol ungu neon (`bg-purple-600`) atau gradien cyan-ke-pink tanpa alasan identitas brand. Gunakan solid slate-900 solid atau neutral soft badge.
3. **Dilarang Teks Sapaan Basa-basi:** Dilarang menggunakan *"Selamat Datang di Sistem Admin Kami"* atau *"Halo Admin"*. Gunakan nama halaman fungsional langsung seperti *"Dashboard Operasional"* atau *"Pengaturan Sistem"*.
4. **Dilarang Format Tanggal ISO:** Semua tanggal wajib di-format via helper lokal (`toLocaleDateString("id-ID")`).
5. **Dilarang Kartu Mencong / Tidak Simetris:** Hindari baris grid di mana satu kartu tinggi dan kartu sebelahnya pendek karena perbedaan jumlah teks. Kunci dengan `h-full flex flex-col justify-between` dan `min-h-[..]` pada slot tengah.
6. **Dilarang Placeholder Menumpuk:** Jangan membuat label berulang (misal label kamar sudah ada di header, tidak perlu ditulis ulang di badan kartu jika tidak menambah konteks).
7. **Dilarang Sub-menu Bersarang di Sidebar:** Navigasi CMS wajib flat 1-level agar seluruh fitur operasional dapat diakses hanya dalam satu klik langsung.
