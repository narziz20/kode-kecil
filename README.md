# Kode Kecil — 1.000 Petualangan Logika

Game web ringan berbahasa Indonesia untuk anak usia 6 tahun bersama pendamping. **10 jenis game × 20 tema × 5 tingkat = 1.000 misi.** Misi dibangkitkan secara deterministik dengan aturan dan susunan yang berbeda. Ini kumpulan latihan terstruktur, bukan 1.000 kurikulum unik.

## Langsung main

Ekstrak `kode-kecil-offline.zip`, lalu buka `index.html` di browser. Tidak perlu memasang Flutter, Node, database, atau aplikasi tambahan. Pilihan satu berkas: buka `dist/kode-kecil-1000.html`; semua kode dan tampilan game baru sudah tertanam di dalamnya.

Jika ingin memakai server lokal, dari folder proyek ini jalankan:

```sh
python3 -m http.server 4173 --directory dist
```

Lalu buka http://localhost:4173. Progres berbasis alamat browser: versi file, localhost, dan hosting merupakan penyimpanan yang berbeda. Gunakan cadangan/impor progres untuk memindahkannya.

## Sepuluh jenis permainan

| Permainan | Tantangan |
| --- | --- |
| Pasangan Rahasia | Ingat letak kartu; cocokkan gambar **dan** warna, 3 sampai 8 pasang. |
| Rumah yang Cocok | Kelompokkan berdasarkan warna, jenis, kombinasi atribut, hingga aturan DAN/ATAU/BUKAN. |
| Kereta Pola | Lengkapi pola AB, ABC, AAB, ABAC, hingga siklus gambar dan warna yang berbeda. |
| Studio Puzzle | Tukar potongan untuk menyusun gambar, dari 2×2 sampai 4×4. |
| Kebun Logika | Isi papan 3×3 atau 4×4 tanpa pengulangan pada baris/kolom; petunjuk memiliki satu solusi. |
| Pabrik Ajaib | Susun transformasi warna, gambar, ukuran, pengulangan, dan kondisi pada beberapa masukan. |
| Jelajah Bimo | Rencanakan jalur, hindari rintangan, ambil bintang dengan instruksi kondisi. |
| Orkestra Kode | Susun irama visual, ringkas dengan pengulangan, buat dan panggil fungsi/jurus. |
| Detektif Cilik | Gabungkan petunjuk positif/negatif, ukuran, warna, jenis, dan atribut bintang. |
| Bekal Seimbang | Cari kombinasi nilai titik untuk satu atau dua tas, dengan batas jumlah barang di tingkat terakhir. |

20 tema mencakup safari, laut, dinosaurus, peternakan, angkasa, hewan peliharaan, kutub, buah, kendaraan, hutan, bunga, robot, musik, cuaca, dongeng, dapur, olahraga, seni, pantai, dan kebun serangga.

## Jenjang dan sesi

- Tingkat 1, misi 1–200: Kenalan. Pilihan sedikit, petunjuk singkat.
- Tingkat 2, misi 201–400: Mencoba. Lebih banyak pilihan dan pengulangan sederhana.
- Tingkat 3, misi 401–600: Merancang. Gabungan atribut dan puzzle lebih besar.
- Tingkat 4, misi 601–800: Menalar. Kondisi, petunjuk negatif, fungsi, dan beberapa target.
- Tingkat 5, misi 801–1.000: Berkreasi. Kombinasi aturan, kondisi dalam loop, dan batasan tambahan.

Semua tingkat terbuka agar pendamping dapat menyesuaikan. Mulai dari tingkat 1; tingkat lanjut bukan kewajiban usia. Usulan sesi 5 menit benda nyata/gerak, 10 menit game, 5 menit refleksi. Boleh lebih singkat, berulang, atau dikembangkan menjadi permainan di luar layar. Tidak ada timer atau penalti karena salah.

Setiap misi memuat tujuan, rincian tantangan, aktivitas tanpa layar, pertanyaan refleksi, dan ide membuat versi sendiri. Lihat `PANDUAN-1000-MISI.md` untuk daftar lengkap, atau unduh/cetak panduan dari menu orang tua.

## Progres dan aksesibilitas

Progres game baru memakai kunci `kode-kecil-v3` di localStorage. Menu orang tua dapat mengekspor cadangan JSON dan mengimpor dengan **menggabungkan**, bukan menghapus, progres yang sudah ada. Tidak meminta nama atau data anak, dan tidak mengirim progres ke server. Saat penyimpanan browser diblokir, unduh cadangan sebelum menutup.

Tombol besar, petunjuk singkat, tanda bentuk pada warna, dan dukungan pengurangan gerakan. Suara petunjuk menggunakan Web Speech API jika tersedia; irama memakai Web Audio. Seluruh game baru dapat berjalan offline tanpa suara dan tanpa font/aset eksternal. Tampilan emoji mengikuti perangkat.

40 misi lama dan progresnya tetap tersedia melalui `classic/index.html` dari menu orang tua. File satu-berkas yang dipindahkan sendiri tetap menjalankan 1.000 misi, tetapi tautan versi lama memerlukan folder `classic` dari ZIP.

## Struktur sumber dan pemeriksaan

- `dist/engine.js`: 10 pembangkit aktivitas, aturan, solver, validasi, dan ringkasan misi.
- `dist/app.js`: UI, instruksi visual, interaksi, animasi, progres, suara, dan panduan.
- `dist/style.css`: tampilan responsif untuk HP/tablet/desktop.
- `test.cjs`: pemeriksaan 1.000 misi (solusi, konsistensi, keunikan, jawaban keliru, dan konsep wajib).
- `test-classic.cjs`: pemeriksaan 40 misi lama.

```sh
node test.cjs
node test-classic.cjs
```

Alur berhasil untuk semua 10 jenis permainan, kondisi dalam pengulangan, fungsi, reset saat kartu terbuka, dan persistensi progres telah diperiksa di browser. Semua 1.000 misi diperiksa oleh tes aturan; tidak semuanya dimainkan manual satu per satu.

Versi ini tersedia lokal. Publikasi eksternal belum dilakukan.
