# RIC Website — NFC + QR Google Review

Website demo untuk brand RIC.

## Fitur
- Landing page RIC
- Flow NFC/QR berbasis Card ID
- Aktivasi kartu
- Dashboard pengelolaan kartu
- Google Review URL dapat diubah tanpa mengganti URL kartu
- PIN management
- Reset kartu
- QR generation
- Demo analytics
- Halaman bantuan
- Customer Service: anggariksa69@gmail.com

## Demo Card
- RIC-000001 — active — Demo Cafe — PIN 1234
- RIC-000002 — inactive
- RIC-000003 — active — Demo Restaurant — PIN 5678

## Cara menjalankan
Website ini adalah static SPA dan dapat dibuka langsung dengan web server sederhana.

Contoh:
python3 -m http.server 8080

Lalu buka:
http://localhost:8080

## Deploy Vercel
Upload folder ini ke Vercel. File vercel.json melakukan rewrite route seperti:
 /c/RIC-000001
 /aktivasi/RIC-000002
 /dashboard/RIC-000001

ke index.html.

## Catatan produksi
Versi ini adalah prototype frontend dengan localStorage. Untuk produksi:
- pindahkan data kartu ke PostgreSQL/Supabase
- hash PIN di server
- gunakan authentication server-side
- buat API untuk cards
- gunakan rate limiting
- catat analytics di backend
- tulis URL Card ID ke NFC NDEF
- jangan simpan PIN plaintext
- jangan gunakan URL QR demo sebagai data produksi
