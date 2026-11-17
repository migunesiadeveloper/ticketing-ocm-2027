# OCM 2027 – Landing Page

Landing page Orthopaedic Concurrent Meeting 2027 (IOSSA, IOPIS, IOTS, IOMBS), Surabaya, 11–14 Agustus 2027.
Pendaftaran tiap tiket memakai embed Migunesia Ticket.

Situs statis murni: **HTML, CSS, JS saja**, tanpa build, tanpa framework.

## Struktur

```
website/              ← folder yang di-deploy
  index.html
  css/style.css
  js/config.js        ← satu-satunya berkas yang diubah saat event siap dijual
  js/main.js
  assets/img/
```

## Lihat di lokal

Buka `website/index.html` langsung di browser, atau jalankan server sederhana:

```
cd website && python3 -m http.server 8080
```

Tambahkan `?preview=regular` atau `?preview=closed` di URL untuk melihat tampilan periode harga lain.

## Cloudflare Pages

| Pengaturan | Nilai |
|---|---|
| Framework preset | None |
| Build command | (kosong) |
| Build output directory | `website` |

## Menyambungkan tombol Register ke embed

Isi `website/js/config.js`:

- `EVENT_CODE`: kode event dari dashboard.
- `ticket.early` / `ticket.regular` per item: kode tiket early bird (sampai 30 Juni 2027) dan regular (1 Juli – 14 Agustus 2027).

Tombol membuka `https://embed.migunesia-ticket.com/?event=KODE&type=app_2&ticket=KODE_TIKET` di popup.
Selama `EVENT_CODE` atau kode tiket kosong, tombol menampilkan "Registration opens soon".
Periode harga ditentukan otomatis dari tanggal WIB.

## Aset sementara

Gambar berikut masih potongan dari banner/PDF draft dan perlu diganti file asli dari desainer panitia:

- `logo-ocm-2027.jpg`, `logo-ring.jpg`: logo OCM (minta PNG transparan / SVG)
- `logo-societies.jpg`: enam logo organisasi (minta per logo, PNG transparan)
- `photo-*.jpg`: foto Surabaya, live surgery, trauma, pain (minta resolusi asli)
- `portrait-*.jpg`: foto ketua dan presiden perhimpunan (minta file asli)

`banner-landscape.jpg` (desktop) dan `banner-portrait.jpg` (mobile, ≤ 760 px) adalah banner resmi.

Materi mentah dari panitia (PDF draft, banner ukuran asli) tidak ikut di repo, lihat `.gitignore`.
