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
- `dist/interactions.js`: panduan Bimo, drag-and-drop mouse/pena/sentuhan, tujuan menyala, dan pengurutan kartu kode.
- `dist/playful.js`: reaksi Bimo, bantuan berdasarkan percobaan anak, pertanyaan bertahap, dan alat bermain tambahan.
- `dist/style.css`: tampilan responsif untuk HP/tablet/desktop.
- `test.cjs`: pemeriksaan 1.000 misi (solusi, konsistensi, keunikan, jawaban keliru, dan konsep wajib).
- `test-classic.cjs`: pemeriksaan 40 misi lama.

```sh
node test.cjs
node test-classic.cjs
node test-interactions.cjs
node test-voice.cjs
node test-themes.cjs
node test-motion.cjs
node test-variety.cjs
python3 scripts/build-offline.py
```

Alur berhasil untuk semua 10 jenis permainan, kondisi dalam pengulangan, fungsi, reset saat kartu terbuka, dan persistensi progres telah diperiksa di browser. Semua 1.000 misi diperiksa oleh tes aturan; tidak semuanya dimainkan manual satu per satu.

Versi ini tersedia lokal. Publikasi eksternal belum dilakukan.

## Interaksi untuk anak

Panduan Bimo menampilkan tiga langkah bergambar di setiap permainan. Kartu bisa diseret ke rumah, tas, gerbong pola, dan kotak kebun. Potongan puzzle bertukar tempat ketika diseret ke potongan lain. Pada editor kode, seret kartu ke rencana atau ke depan kartu lain untuk menyisipkan; seret kartu yang sudah ada untuk mengubah urutannya. Area tujuan menyala selama kartu dibawa. Pegang kartu dekat tepi atas/bawah layar untuk menggulir saat menyeret.

Ketukan tetap tersedia sebagai alternatif, termasuk untuk anak yang belum nyaman menyeret. Memori dan detektif tetap memakai ketukan. Keyboard: Tab untuk memilih, Enter untuk mengaktifkan tombol, Alt + panah kiri/kanan untuk memindahkan kartu kode, dan Escape untuk membatalkan seretan. Gerakan dekoratif mengikuti preferensi pengurangan gerakan perangkat.

`test-interactions.cjs` memeriksa perpindahan kartu, kotak terkunci, urutan kode termasuk blok Ulang/Jurus, batas 30 kartu, status sibuk, reset, serta alternatif ketukan. Pemeriksaan browser dilakukan untuk seret kartu ke rumah, seret panah ke rencana, ketukan tambahan, dan menjalankan Bimo di layar kecil. Dukungan sentuhan memakai Pointer Events; pengujian perangkat sentuh fisik belum dilakukan.

## Bimo, animasi, dan petunjuk bertahap

Bimo dapat diajak tos, berkedip, dan bereaksi saat anak berpikir atau memindahkan kartu. Animasi pendek menandai kartu yang ditempatkan, kartu memori yang terbuka, langkah robot, bunyi yang dimainkan, serta perayaan selesai. Semua animasi baru menghormati pengaturan reduced motion. Menu “Tunjukkan caranya” memperagakan gerakan ketuk/seret tanpa menunjukkan solusi misi.

Saat jawaban belum pas, bantuan menjelaskan hal yang teramati dari percobaan anak (misalnya titik berlebih, gambar kembar pada kebun, petunjuk detektif yang belum cocok, atau langkah robot yang terhalang), lalu memberi satu pertanyaan. Tombol “Bantu sedikit lagi” membuka pertanyaan berikutnya, sampai tiga tahap; jawaban anak tidak diubah otomatis. Bagian terkait ditandai dengan garis putus-putus. Anak dapat mendengarkan petunjuk atau kembali mencoba.

Variasi tambahan: mode coret pilihan detektif yang dapat dibatalkan, menghitung titik per tas dengan ketukan, mencoba bunyi alat musik tanpa menambah kode, dan memperbesar contoh puzzle. Tes memeriksa bantuan di semua 1.000 misi, tidak adanya perubahan jawaban oleh petunjuk, hitungan per tas, coretan yang dapat dibatalkan, serta bantuan setelah program berhenti. Alur bantuan salah pilih dan bertahap, mencoret, mencoba bunyi, serta memperbesar puzzle diperiksa di browser; tampilan Bimo dan panduan diperiksa pada lebar 390 piksel. Belum dilakukan uji pemahaman langsung bersama anak.

## Suara Bimo

Suara memakai gaya Ceria secara default: kalimat pendek, jeda antar kalimat, tempo lebih hidup, dan variasi nada ringan untuk pertanyaan/seruan. Emoji hias tidak dibacakan; simbol penting seperti bintang, bendera, arah, dan ulang tetap diucapkan. Mulut Bimo bergerak ketika browser mulai membacakan kalimat. Petunjuk tidak lagi memulai dua bacaan berturut-turut yang saling memotong.

Di menu orang tua, bagian “Suara teman bermain” menyediakan pilihan suara Indonesia yang tersedia di perangkat, gaya Ceria/Lembut, contoh suara, dan tombol berhenti. Pilihan disimpan lokal. Suara berhenti ketika dimatikan, pindah aktivitas, atau menutup dialog. Suara berlabel Natural/Neural/Premium/Enhanced diprioritaskan jika tersedia; label ini hanya petunjuk pemilihan, bukan jaminan kualitas. Suara nonlokal mungkin membutuhkan internet.

Ini tetap sintesis suara bawaan browser, bukan rekaman pengisi suara atau layanan TTS baru. Kualitas dan dukungan pengaturan nada berbeda antarperangkat. Tes `test-voice.cjs` memeriksa pemilihan bahasa, preferensi, pemenggalan kalimat, pembersihan simbol, jeda, pembatalan, dan kegagalan suara. UI pengaturan dan kondisi tidak tersedianya suara diperiksa di browser; browser pengujian tidak memiliki suara Indonesia sehingga kualitas audio belum dapat didengarkan di sana.

## Popup saat jawaban belum tepat

Pemeriksaan jawaban yang belum tepat membuka dialog dengan penjelasan, satu pertanyaan pemantik, bantuan lanjutan, tombol dengarkan, dan “Coba lagi”. Jawaban anak tetap tersimpan. Bantuan berikutnya tetap di dalam dialog; tombol coba lagi kembali ke bagian permainan yang perlu diperiksa. Dialog juga bisa ditutup dengan × atau Escape. Pada memori, dua kartu diperlihatkan sekitar satu detik sebelum popup muncul. Program kosong, jalur terhalang, dan syarat kartu khusus yang belum dipenuhi memakai popup yang sama. Petunjuk yang diminta sendiri di luar popup tetap tersedia di bawah permainan.

Pengujian mencakup popup setelah pemeriksaan, bantuan lanjutan di dialog, kembali mencoba tanpa reset jawaban, kegagalan memori, program kosong, serta popup setelah program dijalankan. Alur buka–bantuan lanjutan–coba lagi diperiksa langsung di browser.

## Tema dunia yang mengikuti pilihan

Semua 20 dunia memakai palet dan ilustrasi lingkungan sendiri. Safari menampilkan gerbang kebun binatang, pagar, pohon, dan hewan; Laut Ajaib memakai lapisan biru laut, berkas cahaya, gelembung, ikan, dan karang. Dunia lain memiliki lingkungan yang sesuai: lembah purba, peternakan, planet, kota hewan, es kutub, kios buah, jalan kota, hutan, bunga, kota robot, panggung musik, pelangi, istana, dapur, lapangan, studio seni, dan pantai.

Tema aktif saat membuka dunia maupun langsung membuka misi, bertahan ketika mencoba ulang/berpindah permainan dalam dunia itu, dan kembali netral saat membuka peta. `dist/world-themes.js` menyimpan palet dan ilustrasi SVG lokal. Ilustrasi tetap tersedia offline; tidak memuat gambar eksternal. Latar dekoratif tidak bisa diklik dan tidak dibacakan pembaca layar. Area soal memakai permukaan terang, warna kartu jawaban tetap sama, dan animasi mengikuti pengaturan reduced motion.

Tes memeriksa cakupan 20 dunia, ilustrasi berbeda, pergantian/pembersihan tema, tema pada seluruh 1.000 misi, serta kontras teks putih tombol utama minimal 4,5:1. Tema safari dan laut serta popup pada layar 390 piksel diperiksa di browser.

## Gerakan saat bermain

Potongan puzzle dan kartu perintah bergeser dari posisi sebelumnya. Bimo melangkah antarpetak dengan lengkungan kecil dan pendaratan lembut. Kartu mengikuti titik pegangan saat diseret, sedikit miring mengikuti arah tangan, lalu masuk ke tujuan; kartu yang dilepas di luar sasaran kembali ke asal. Membuka kartu memori tidak mengulang animasi kartu lain.

`dist/motion.js` mengelola transisi visual tanpa menunda perubahan jawaban. Gerakan yang sedang berjalan dibersihkan saat mengganti misi, mengulang permainan, atau mengaktifkan reduced motion. Versi standalone dan ZIP menyertakan modul ini.

## Menu permainan dan jalur level

Menu utama berisi 13 kartu permainan besar dengan progres bintang masing-masing. Setiap pilihan membuka hanya level permainan itu. Sepuluh permainan awal memiliki 100 level (20 tema per tingkat); tiga tambahan memiliki masing-masing 15 level: Sebab Akibat, Urutan Cerita, dan Detektif Kode. Total 1.045 misi.

Level dibuka berurutan setelah berhasil; tombol lanjut tetap berada di jenis yang sama. Level selesai bisa diulang tanpa menambah bintang ganda. ID 1.000 misi lama tetap sama dan cadangan versi 3 tetap bisa diimpor. Progres lama yang melompati level tetap tersimpan dan bisa diulang; isi level yang terlewati untuk melanjutkan jalur. `journey.js` mengatur navigasi dan pembukaan level, `lessons.js` berisi permainan baru. Urutan Cerita dan Detektif Kode mendukung seret atau ketuk dua kartu untuk bertukar tempat.

## UI ringkas

Sidebar desktop berisi identitas Bimo, total bintang, dan navigasi; di ponsel berubah menjadi bilah atas. Soal menonjolkan gambar dan instruksi satu baris, dengan cara main serta panduan pendamping dilipat. Sebab Akibat menampilkan satu pertanyaan sekaligus dan langsung memeriksa pilihan; jawaban keliru tetap mempertahankan pertanyaan. Animasi mengambang, pantulan tombol, dan perayaan mengikuti prefers-reduced-motion.

## Variasi tantangan dan UI seluruh permainan

Ketiga belas permainan memakai area bermain ringkas, kartu besar, panel putih, tombol timbul, dan bantuan terlipat. Petunjuk detektif serta urutan mesin memakai simbol visual.

Generator memeriksa isi tantangan tanpa memakai ID, nama tema, atau label tingkat sebagai pembeda. Kandidat yang identik dibuat ulang dengan seed deterministik; level tetap sama saat dimainkan ulang. Irama awal memakai tiga bunyi dari empat instrumen, dan posisi awal rute dapat bervariasi. Cerita baru mencakup 30 cerita berbeda, sedangkan Sebab Akibat memakai 15 situasi dengan rangkaian soal bertambah. Nomor misi serta bintang lama tetap dipertahankan; beberapa isi level yang sebelumnya duplikat diperbarui. `node test-variety.cjs` memeriksa keunikan 1.045 tantangan, solusi, kestabilan saat membuka level dalam urutan berbeda, serta isolasi cache.
