# OCM 2027 – Mini Registration

Halaman registrasi mini Orthopaedic Concurrent Meeting 2027 (IOSSA, IOPIS, IOTS, IOMBS), Surabaya, 11–14 Agustus 2027.
Tanpa navbar/about/contact (permintaan klien 23 Nov 2026): banner + tiket untuk satu kategori dokter. Website panitia menautkan tiap kategori ke link di bawah.
Pendaftaran tiap tiket memakai embed Migunesia Ticket. Landing page lengkap versi lama ada di riwayat git (sebelum branch `feat/mini-registration`).

| Kategori (Registration Mapping Update 01) | Link |
|---|---|
| Orthopaedic Consultants (Sub-Specialist / Clinical Fellow) | `/?category=consultant` |
| General Orthopaedics / Other Specialists | `/?category=general-ortho` |
| General Practitioner | `/?category=gp` |
| Resident | `/?category=resident` |
| Medical Student | `/?category=student` |

Tanpa `?category` (atau kategori tak dikenal) halaman menampilkan pilihan kategori.

Situs statis murni: **HTML, CSS, JS saja**, tanpa build, tanpa framework.

## Struktur

```
index.html
css/style.css
js/config.js        ← kategori → kode tiket, teks kartu, info hotel
js/main.js
assets/img/
_materi/            ← PDF draft, banner asli, pratinjau (tidak masuk git)
```

## Lihat di lokal

Jalankan server sederhana (harga diambil dari API, jadi perlu internet):

```
python3 -m http.server 8080
```

Buka `http://localhost:8080/?category=consultant`. Tambahkan `&preview=regular` atau `&preview=closed` untuk melihat tampilan periode harga lain.

## Cloudflare Pages

| Pengaturan | Nilai |
|---|---|
| Framework preset | None |
| Production branch | `main` (setiap push ke `main` langsung tayang) |
| Build command | `mkdir -p dist && cp -R index.html css js assets dist/` |
| Build output directory | `dist` |

Build command hanya menyalin berkas situs ke `dist`, supaya `README.md`, `.gitignore` dan berkas repo lain tidak ikut tayang.
Kalau menambah berkas/folder baru di root yang harus tayang (misalnya `favicon.ico`), tambahkan juga ke build command.
`dist/` tidak perlu dibuat di repo.

## Data tiket: dashboard vs config.js

**Dari dashboard (langsung, tanpa ubah kode):** harga, periode jual Early/Regular, kuota habis, aktif/nonaktif.
Halaman memanggil `GET https://api.migunesia-ticket.com/api/v1/tickets/{kode_tiket}` per tiket (publik, cache API ±20 detik).
Tiket OCM privat (`is_public = N`), jadi daftar tiket per event tidak dipakai.

**Dari `js/config.js`:**

- `EVENT_CODE`: kode event dari dashboard.
- `T`: kode tiket per kategori, `early` dan `regular`. Kalau harga sama sepanjang periode (Resident, Medical Student), isi kode yang sama di keduanya. Kode `""` = kartu "Coming soon".
- `categories`: kategori mana menampilkan kartu apa (judul, isi paket, tanggal).
- `hotels`: info hotel (hanya informasi; kamar dipilih sebagai add-on di form, harga dashboard yang berlaku).

Status kartu: Register (tiket dalam periode jual), Opens soon (belum mulai), Sold out (kuota habis), Not available (tiket nonaktif), Coming soon (kode belum diisi).
Kalau API tidak terjangkau, tombol tetap jalan dan Early/Regular dipilih dari `EARLY_END`/`REGULAR_END` di config.

Tombol membuka `https://embed.migunesia-ticket.com/?event=KODE&type=app_2&ticket=KODE_TIKET` di popup penuh layar, dengan konfirmasi sebelum ditutup.

## Aset sementara

Gambar berikut masih potongan dari banner/PDF draft dan perlu diganti file asli dari desainer panitia:

- `logo-ocm-2027.png`, `logo-ring.png`: logo OCM (minta PNG transparan / SVG)
- `logo-societies.jpg`: enam logo organisasi (minta per logo, PNG transparan)
- `photo-*`, `portrait-*.png`: tidak dipakai halaman mini (sisa landing page lama)

`banner-landscape.jpg` (desktop) dan `banner-portrait.jpg` (mobile, ≤ 760 px) adalah banner resmi.

Materi mentah dari panitia (PDF draft, banner ukuran asli) disimpan di `_materi/` dan tidak ikut di repo, lihat `.gitignore`.
