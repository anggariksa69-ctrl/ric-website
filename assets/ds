# RIC Website — NFC + QR Google Review

Website platform pengelolaan kartu NFC & QR Code untuk membantu bisnis meningkatkan ulasan pelanggan di Google Review.

---

## 🚀 Panduan Publish Website Secara GRATIS (Vercel)

Layanan terbaik dan paling disarankan untuk mem-publish website ini adalah **Vercel** karena:
- 100% Gratis selamanya (Hobby Plan).
- Sudah dilengkapi file `vercel.json` agar URL kartu (`/c/RIC-000001`), aktivasi, dan dashboard berjalan tanpa error 404.
- Mendapatkan domain HTTPS gratis (contoh: `ric-review.vercel.app`).

---

### Cara 1: Deploy Langsung lewat Vercel CLI (Paling Cepat & Mudah)

1. **Install Vercel CLI** (jika belum ada):
   Buka terminal di komputer Anda dan jalankan:
   ```bash
   npm install -g vercel
   ```
2. **Login & Publish**:
   Masuk ke folder projek ini di terminal, lalu ketik:
   ```bash
   vercel
   ```
3. Tekan **Enter** untuk menyetujui semua pertanyaan default.
4. Dalam 10-15 detik, Vercel akan memberikan **URL Live Website Anda** (contoh: `https://folder-tanpa-judul-xxx.vercel.app`).
5. Kartu NFC / QR Code tinggal diisikan URL domain tersebut, misalnya:
   `https://nama-web-anda.vercel.app/c/RIC-000001`

---

### Cara 2: Deploy lewat GitHub & Dashboard Vercel Web

1. **Buat Repository Baru di GitHub**:
   - Buka [github.com](https://github.com) dan buat repository baru (misal: `ric-nfc-review`).
   - Upload/push seluruh file folder ini ke repository GitHub tersebut.

2. **Hubungkan ke Vercel**:
   - Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
   - Klik tombol **"Add New..."** → **"Project"**.
   - Pilih repository `ric-nfc-review` dari daftar.
   - Klik **"Deploy"**.

3. **Selesai!** Website Anda sudah online dan dapat diakses dari mana saja.

---

## 📌 Panduan Langkah Demi Langkah Penggunaan Website (Step-by-Step)

### 1. Menjalankan Website (Lokal)
1. Buka terminal pada folder projek ini.
2. Jalankan lokal web server:
   ```bash
   python3 -m http.server 8080
   ```
3. Buka browser dan akses [http://localhost:8080](http://localhost:8080).

---

### 2. Langkah Penggunaan Kartu oleh Pelanggan (Flow Utama)
1. **Tap / Scan Kartu Physical**: Pelanggan menempelkan HP ke kartu NFC RIC atau melakukan scan pada QR Code kartu.
2. **Pengalihan Otomatis**:
   - Jika **kartu sudah aktif**, pelanggan akan langsung diarahkan ke halaman **Google Review** bisnis Anda.
   - Jika **kartu belum diaktifkan**, sistem secara otomatis mengarahkan ke halaman **Aktivasi Kartu** (`/aktivasi/[CARD_ID]`).

---

### 3. Langkah Aktivasi Kartu Baru (Untuk Pemilik Bisnis)
1. Buka link aktivasi kartu Anda, misalnya: `https://domain-anda.vercel.app/c/RIC-000002` atau via menu **Kelola Kartu** dengan memasukkan Card ID yang belum aktif.
2. Isi formulir aktivasi:
   - **Nomor WhatsApp**: Isi nomor kontak bisnis (+62...).
   - **🔍 Cari Toko di Google Maps**: Ketik nama toko + kota (contoh: *Warung Pak Budi Yogyakarta*) lalu klik **Cari 🔍** untuk mengisi URL Google Review secara otomatis. Atas isi manual URL Google Review Anda.
   - **PIN & Konfirmasi PIN**: Buat PIN pengaman (minimal 4 digit) yang akan digunakan untuk mengakses Dashboard Pengelolaan Kartu.
3. Klik **Aktifkan Kartu**. Setelah sukses, Anda akan otomatis masuk ke **Dashboard Kartu**.

---

### 4. Langkah Mengelola & Mengubah Link Google Review
1. Masuk ke halaman **Kelola Kartu** dari navigasi utama (`/kelola-kartu`).
2. Masukkan **Card ID** Anda (contoh: `RIC-000001`) lalu klik **Lanjutkan**.
3. Masukkan **PIN kartu** Anda saat diminta.
4. Di dalam **Dashboard Kartu**, Anda dapat:
   - **Melihat Analytics**: Mengetahui jumlah total interaksi, NFC tap, dan redirect ke Google Review.
   - **Memperbarui Link Google Review**: Ubah link Google Review kapan saja tanpa harus mengganti kartu fisik.
   - **Mengecek & Unduh QR Code**: Mengambil gambar QR Code versi digital.
   - **Ubah PIN & Reset Kartu**: Memperbarui PIN atau mereset kartu jika ingin dikonfigurasi ulang.

---

## 🛠️ Fitur Utama
- **Landing Page Interaktif**: Penjelasan produk RIC dan keunggulannya.
- **Dynamic Routing SPA**: Penanganan route otomatis (`/`, `/kelola-kartu`, `/aktivasi/:id`, `/dashboard/:id`, `/c/:id`, `/bantuan`).
- **Integrasi Supabase Backend**: Menyimpan status kartu, link review, PIN, dan statistik interaksi secara realtime.
- **Pencarian Google Maps (Places API)**: Pencarian nama toko otomatis untuk mendapatkan URL `writereview` Google tanpa copy-paste manual.
- **QR Code Generator**: Pembuatan QR Code otomatis berbasis Card ID.

---

## 💳 Demo Card (Testing)
- `RIC-000001` — Active — PIN `1234`
- `RIC-000002` — Inactive (Siap untuk dicoba aktivasi)
- `RIC-000003` — Active — PIN `5678`

---

## 📧 Layanan Bantuan
- **Customer Service Email**: `anggariksa69@gmail.com`
- **WhatsApp Support**: [+62 838-3429-9229](https://wa.me/6283834299229)
