# Flash Sale TV Display

Aplikasi web statis untuk menampilkan jadwal Flash Sale di TV toko.

## Fitur

- Otomatis mendeteksi flash sale yang sedang berlangsung berdasarkan jam perangkat.
- Countdown real-time untuk promo yang aktif.
- Coming Soon untuk jadwal berikutnya.
- Jadwal harian lengkap.
- Desain landscape 16:9 untuk TV display.
- Favicon SVG bertema flash sale.

## Jadwal Default

1. 10:00 - 12:00 — Skintific — Diskon 35% Semua Produk
2. 15:00 - 17:00 — Loreal & Garnier — Diskon 35%
3. 19:00 - 21:00 — Maybelline & Glad2 Glow — Diskon 35%

## Cara Upload ke GitHub

1. Buat repository baru di GitHub.
2. Upload semua file di folder ini ke repository tersebut.
3. Pastikan file `index.html`, `styles.css`, `app.js`, `favicon.svg`, dan `package.json` berada di root repository.

## Cara Deploy ke Vercel

1. Masuk ke Vercel.
2. Klik **Add New Project**.
3. Pilih repository GitHub ini.
4. Framework Preset: pilih **Other** atau biarkan otomatis.
5. Build Command: kosongkan.
6. Output Directory: kosongkan atau isi `.`.
7. Deploy.

## Mengubah Jadwal

Edit file `app.js`, bagian berikut:

```js
const schedule = [
  {
    id: 1,
    start: "10:00",
    end: "12:00",
    brands: [{ name: "Skintific", discount: "35%", note: "Semua Produk" }],
  },
];
```

Ubah `start`, `end`, `name`, `discount`, dan `note` sesuai kebutuhan.
