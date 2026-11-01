/* Additional visual lessons. Original mission IDs stay stable for saved progress. */
(()=>{
const baseMake=KK.make,baseValidate=KK.validate,baseSolution=KK.solution,baseDescribe=KK.describe;
const additions=[['cause','Sebab Akibat','☀️','Lihat kejadian, pilih tindakan.'],['sequence','Urutan Cerita','🌱','Susun gambar dari awal sampai akhir.'],['debug','Detektif Kode','🔧','Perbaiki langkah yang tertukar.']];
KK.types.push(...additions.map(([id,name,icon,brief])=>({id,name,icon,brief,skill:brief,goal:brief,off:'Peragakan urutannya dengan benda di rumah.',reflect:'Apa yang membuatmu memilih langkah itu?'})));
const stories=[["Ayam tumbuh", ["🥚", "🐣", "🐥"], ["telur", "menetas", "anak ayam"]], ["Bunga tumbuh", ["seed", "🌱", "🌼"], ["benih", "tunas", "bunga"]], ["Pakai sepatu", ["🦶", "🧦", "👟"], ["kaki kosong", "kaus kaki", "sepatu"]], ["Buka hadiah", ["🎁", "open-box", "🧸"], ["hadiah terbungkus", "buka kotak", "ambil boneka"]], ["Gambar matahari", ["blank-paper", "draw-circle", "draw-sun"], ["kertas kosong", "gambar lingkaran", "beri sinar"]], ["Pisang untuk camilan", ["whole-banana", "peeled-banana", "eat-banana"], ["ambil pisang", "kupas kulit", "makan pisang"]], ["Cuci tangan", ["wet-hands", "soap-hands", "rinse-hands", "dry-hands"], ["basahi tangan", "beri sabun", "bilas tangan", "keringkan"]], ["Tanam di pot", ["soil-pot", "seed-pot", "water-pot", "sprout-pot"], ["siapkan tanah", "masukkan benih", "beri air", "tunas tumbuh"]], ["Surat untuk teman", ["📝", "letter-envelope", "📮", "📬"], ["tulis surat", "masukkan amplop", "kirim surat", "surat diterima"]], ["Buat teh bersama orang tua", ["brew-tea", "pour-tea", "cool-tea", "drink-tea"], ["orang tua seduh teh", "tuang ke cangkir", "tunggu dingin", "minum"]], ["Siap tidur", ["🪥", "👕", "🛏️", "😴"], ["sikat gigi", "pakai piyama", "masuk kasur", "tidur"]], ["Kupu-kupu tumbuh", ["leaf-eggs", "🐛", "chrysalis", "🦋"], ["telur", "ulat", "kepompong", "kupu-kupu"]], ["Piknik", ["🧺", "pack-picnic", "picnic", "clean-picnic", "🏠"], ["siapkan keranjang", "masukkan bekal", "makan di taman", "bersihkan sampah", "pulang"]], ["Roti selai", ["bread-slice", "open-jam", "spread-jam", "sandwich", "eat-sandwich"], ["ambil roti", "buka selai", "oles dengan pisau tumpul", "tutup roti", "makan"]], ["Buat layang-layang", ["kite-frame", "kite-paper", "kite-color", "kite-string", "🪁"], ["siapkan rangka", "pasang kertas", "beri warna", "ikat benang", "terbangkan"]], ["Mobil mainan", ["car-battery", "car-switch", "car-moving"], ["pasang baterai", "nyalakan mobil", "mobil berjalan"]], ["Baca buku", ["📚", "📖", "book-mark"], ["ambil buku", "buka dan baca", "pasang pembatas"]], ["Isi botol", ["bottle-open", "bottle-fill", "bottle-closed"], ["buka botol", "isi air", "pasang tutup"]], ["Es mencair", ["🧊", "ice-melting", "puddle"], ["es beku", "terkena hangat", "menjadi air"]], ["Pintu rumah", ["unlock-door", "open-door", "enter-door"], ["buka kunci", "buka pintu", "masuk rumah"]], ["Rapikan mainan", ["🧩", "toys-box", "toys-shelf"], ["kumpulkan mainan", "masukkan kotak", "simpan di rak"]], ["Siap melukis", ["blank-paper", "🎨", "paint-stroke", "🖼️"], ["siapkan kertas", "pilih cat", "sapukan kuas", "lukisan selesai"]], ["Cuci apel", ["🍎", "wash-apple", "dry-apple", "eat-apple"], ["ambil apel", "bilas air", "keringkan", "makan"]], ["Naik sepeda", ["bike-helmet", "🚲", "pedal-bike", "bike-finish"], ["pakai helm", "naik sepeda", "kayuh pedal", "sampai tujuan"]], ["Buat balon", ["balloon-flat", "balloon-pump", "balloon-knot", "balloon-string"], ["ambil balon kosong", "orang tua pompa", "ikat ujung", "pasang tali"]], ["Cuci piring bersama", ["dirty-plate", "soap-plate", "rinse-plate", "plate-rack"], ["piring kotor", "gosok sabun", "bilas air", "simpan setelah kering"]], ["Menyeberang bersama orang tua", ["crosswalk", "crosswalk-stop", "crosswalk-look", "crosswalk-go"], ["menuju zebra cross", "berhenti di tepi", "lihat bersama orang tua", "menyeberang saat aman"]], ["Menanam pohon", ["🕳️", "plant-sapling", "cover-roots", "water-sapling", "grown-sapling"], ["buat lubang", "letakkan bibit", "tutup dengan tanah", "siram", "daun tumbuh"]], ["Bersiap sekolah", ["wake-up", "🚿", "school-shirt", "🎒", "🏫"], ["bangun", "mandi", "pakai seragam", "ambil tas", "pergi sekolah"]], ["Pesawat kertas", ["blank-paper", "fold-middle", "fold-wings", "paper-plane", "plane-flying"], ["siapkan kertas", "lipat tengah", "lipat sayap", "pesawat jadi", "terbangkan"]]];
const situations=[
['🌧️','Hujan turun. Agar badan tidak basah, pakai apa?',['☂️','🕶️','🧢'],'payung|kacamata hitam|topi','Benda mana yang bisa menahan tetesan air?'],
['dry-pot','Tanah tanaman kering. Apa yang dibutuhkan?',['💧','🧸','🪨'],'air|boneka|batu','Apa yang bisa membasahi tanah?'],
['🌙 🛏️','Sudah malam dan mengantuk. Apa langkah berikutnya?',['😴','⚽','🥁'],'tidur|main bola|main drum','Apa yang membuat tubuh beristirahat?'],
['soap-hands','Tangan sudah diberi sabun. Selanjutnya?',['rinse-hands','🍎','🧤'],'bilas air|makan apel|pakai sarung tangan','Bagaimana menghilangkan sabun dari tangan?'],
['red-signal','Bimo tiba di lampu merah. Bimo harus…',['🛑','🏃','🚴'],'berhenti|berlari|bersepeda','Warna merah meminta kita menunggu atau bergerak?'],
["dark-room", "Ruangan gelap. Agar terlihat, pakai apa?", ["🔦", "🧸", "🥁"], "senter|boneka|drum", "Benda mana yang mengeluarkan cahaya?"],
["spilled-water", "Air tumpah di meja. Bersihkan dengan apa?", ["🧽", "📚", "🪁"], "spons|buku|layang-layang", "Benda mana yang menyerap air?"],
["☀️", "Matahari terik. Lindungi kepala dengan apa?", ["🧢", "🧦", "🧤"], "topi|kaus kaki|sarung tangan", "Mana yang dipakai di kepala?"],
["🧊 ☀️", "Es dibiarkan di tempat hangat. Es menjadi apa?", ["💧", "🪨", "🌱"], "air|batu|tunas", "Pernah melihat es di luar kulkas?"],
["🚲", "Bimo mau bersepeda. Lindungi kepala dengan apa?", ["bike-helmet", "🧣", "👓"], "helm|syal|kacamata", "Mana yang keras dan menutup kepala?"],
["📄 🌬️", "Kertas tertiup angin. Supaya tetap di meja, gunakan apa?", ["🪨", "🪶", "🫧"], "batu pemberat|bulu|gelembung", "Mana yang cukup berat menahan kertas?"],
["wet-pot", "Tanah masih basah. Perlu ditambah air sekarang?", ["✋", "🚿", "🪣"], "tunggu dulu|siram banyak|tuang seember", "Apa yang terjadi kalau airnya terlalu banyak?"],
["crosswalk-go", "Lampu pejalan kaki hijau dan jalan aman. Bersama orang tua kita…", ["🚶", "⚽", "🛏️"], "menyeberang|main bola|tidur", "Apa tujuan kita menunggu di zebra cross?"],
["toys-box", "Mainan sudah masuk kotak. Supaya rapi, kotaknya ditaruh di mana?", ["toys-shelf", "🚪", "🛁"], "rak|depan pintu|bak mandi", "Tempat mana yang tidak menghalangi jalan?"],
["hot-tea", "Minuman masih panas. Sebelum minum, kita…", ["⏳", "🏃", "🥤"], "tunggu dingin|berlari|langsung minum", "Apa yang berubah kalau kita menunggu?"]
];
KK.make=id=>{
 if(id<1000)return baseMake(id);
 if(!Number.isInteger(id)||id>=1045)throw Error('Nomor misi tidak valid');
 const k=Math.floor((id-1000)/15),n=(id-1000)%15,l=Math.floor(n/3),t=KK.types[10+k];
 const m={id,type:t.id,title:t.name,skill:t.skill,brief:t.brief,level:l,theme:n%20,round:n%3};
 if(k===0){m.questions=Array.from({length:Math.min(l+1,5)},(_,j)=>{const x=situations[(n+j)%situations.length],shift=(n+j)%3;return {scene:x[0],text:x[1],choices:x[2].map((icon,i)=>({icon,name:x[3].split('|')[i],correct:i===0})).slice(shift).concat(x[2].map((icon,i)=>({icon,name:x[3].split('|')[i],correct:i===0})).slice(0,shift)),clue:x[4]};});}
 else{const story=stories[(k-1)*15+n],size=story[1].length;m.story=story[0];m.items=story[1].slice(0,size).map((icon,i)=>({icon,name:story[2][i]}));m.solution=KK.range(size);m.tiles=[...m.solution];if(k===2){for(let j=0;j<(l>=3?2:1);j++){const a=j*2;[m.tiles[a],m.tiles[a+1]]=[m.tiles[a+1],m.tiles[a]];}}else m.tiles.reverse();}
 return m;
};
KK.validate=(m,a)=>m.type==='cause'?Array.isArray(a)&&a.length===m.questions.length&&a.every((v,i)=>Number.isInteger(v)&&m.questions[i].choices[v]?.correct):['sequence','debug'].includes(m.type)?JSON.stringify(a)===JSON.stringify(m.solution):baseValidate(m,a);
KK.solution=m=>m.type==='cause'?m.questions.map(q=>q.choices.findIndex(c=>c.correct)):m.id>=1000?m.solution:baseSolution(m);
KK.describe=m=>m.id>=1000?m.brief:baseDescribe(m);
})();
function isStory(){return ['sequence','debug'].includes(m.type);}
// Small inline scenes show actions and intermediate states, not unrelated emoji.
function lessonIllustration(key){
 const emoji=(text,x=60,y=70,size=48)=>`<text x="${x}" y="${y}" text-anchor="middle" font-family="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif" font-size="${size}">${text}</text>`;
 const path=(d,fill='none',stroke='#475569',width=4)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
 const rect=(x,y,w,h,fill,rx=5)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="#64748b" stroke-width="2"/>`;
 const circle=(x,y,r,fill)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
 const water=path('M35 15v15m18-15v22m18-22v15','#0000','#38bdf8',5);
 const bubbles=circle(40,52,7,'#bae6fd')+circle(71,46,9,'#e0f2fe')+circle(84,60,6,'#7dd3fc');
 const towel=rect(60,48,43,43,'#fde68a')+path('M70 50v39m9-39v39','none','#f59e0b',3);
 const paper=rect(26,12,68,94,'#fff');
 const pot=path('M28 66h64l-9 38H37Z','#e98a5f','#a95638')+rect(24,58,72,13,'#f4a777')+`<ellipse cx="60" cy="58" rx="33" ry="8" fill="#795139"/>`;
 const sprout=path('M60 58V32','none','#4d7c0f')+path('M60 46Q31 44 37 26Q59 25 60 46M60 39Q79 39 83 20Q60 18 60 39','#84cc16','#4d7c0f',2);
 const bottle=path('M48 33v14L35 59v46h50V59L72 47V33Z','#e0f2fe','#0284c7');
 const cap=rect(46,20,28,13,'#38bdf8');
 const plane=path('M10 65 109 18 79 99 58 71 42 94 42 72Z','#e0f2fe','#0284c7',3)+path('M42 72 109 18 58 71','none','#0284c7',2);
 const kite=path('M60 10 96 48 60 91 24 48Z','#fef3c7','#d97706',3);
 const tree=path('M60 87V42','none','#92400e',5)+path('M60 66Q30 61 32 39Q57 39 60 59M60 53Q86 50 87 28Q61 27 60 53','#86cb65','#4d7c0f',2);
 const ground=`<ellipse cx="60" cy="92" rx="49" ry="14" fill="#b8875d"/>`;
 const plate=circle(60,66,37,'#cbd5e1')+circle(60,66,31,'#fff')+circle(60,66,23,'#f1f5f9');
 const road=rect(5,65,110,42,'#64748b')+[15,38,61,84].map(x=>rect(x,70,12,32,'#fff',0)).join('');
 const shelf=rect(12,20,96,89,'#e0b98c')+path('M13 64h94','none','#956544',5);
 const bread=path('M31 43C17 12 100 12 88 43v53H31Z','#fef3c7','#bd814a');
 const jam=rect(33,43,52,59,'#fda4af')+rect(33,28,52,13,'#fb7185');
 const people=circle(43,25,9,'#d89c70')+path('M43 38v25m0-18-12 17m12-17 18 13M43 63 34 86m9-23 10 23','none','#2563eb',9)+circle(76,46,7,'#d89c70')+path('M76 57v17m0-13L61 58m15 3 10 9M76 74l-6 15m6-15 8 15','none','#fb923c',7);
 const scenes={
 'red-signal':rect(38,6,44,90,'#334155',12)+circle(60,25,12,'#ef4444')+circle(60,51,10,'#64748b')+circle(60,77,10,'#64748b')+path('M60 98v16','none','#475569',6),
 'dark-room':rect(5,6,110,104,'#1e293b')+rect(69,17,30,33,'#334155')+emoji('🌙',84,44,24)+path('M17 82h43v21m-43-33v33','none','#64748b',5),
 'hot-tea':emoji('🍵',60,111,70)+path('M45 12q-12 10 0 20t0 17m15-37q-12 10 0 20t0 17m15-37q-12 10 0 20t0 17','none','#94a3b8',3),
 'whole-banana':path('M31 23q8 55 60 48-24 45-62 5Q11 52 22 27Z','#facc15','#ca8a04',3)+path('m22 27-3-12 10-2 2 10','#926537','#71502c',2)+path('M29 34q6 45 45 48','none','#fde68a',4),
 'leaf-eggs':path('M18 87Q12 19 101 19q-1 74-83 68Z','#86cb65','#4d7c0f',3)+path('M18 87 91 28','none','#4d7c0f',3)+[circle(47,53,7,'#fff8d7'),circle(64,47,7,'#fff8d7'),circle(61,64,7,'#fff8d7')].join(''),
 'bread-slice':bread,
 'seed':`<ellipse cx="60" cy="63" rx="15" ry="25" fill="#9a6841" transform="rotate(25 60 63)"/>`+path('M64 43q-13 16-11 35','none','#d9b38c',3),
 'open-box':path('M30 54 60 66 90 54v40l-30 13-30-13Z','#d5a16e','#97683e')+path('m30 54-20-17 31-12 19 21 20-21 30 12-20 17-30-8Z','#e7bf8e','#97683e'),
 'blank-paper':paper,
 'draw-circle':paper+`<circle cx="60" cy="58" r="22" fill="none" stroke="#f59e0b" stroke-width="4"/>`+emoji('✏️',90,100,25),
 'draw-sun':paper+circle(60,58,18,'#facc15')+path('M60 27v8m0 46v8M29 58h8m46 0h8M38 36l6 6m32 32 6 6m0-44-6 6M44 74l-6 6','none','#f59e0b',3),
 'peeled-banana':path('M61 18q25 27-2 69l-13-8q24-30 7-57Z','#fff2b8','#eab308',3)+path('M54 57q-18 3-24 31 21-6 27-20M61 60q27-4 30 27-22-3-30-17','#facc15','#ca8a04',3),
 'eat-banana':emoji('😋',52,73,62)+emoji('🍌',89,104,40),
 'wet-hands':water+emoji('👐',60,101,66),
 'soap-hands':emoji('👐',60,103,66)+bubbles+emoji('🧼',79,34,32),
 'rinse-hands':water+emoji('👐',60,101,66)+path('M22 88q38 21 76 0','none','#38bdf8',4),
 'dry-hands':emoji('👐',44,95,65)+towel,
 'seed-pot':pot+`<ellipse cx="61" cy="26" rx="6" ry="10" fill="#94603a"/>`+path('M61 39v11m-6-4 6 6 6-6','none','#d97706',3),
 'water-pot':pot+emoji('💧',61,38,35),
 'sprout-pot':pot+sprout,
 'dry-pot':pot+sprout+path('m38 57 10-4 8 6 12-5 10 7','none','#e7ba83',3),
 'wet-pot':pot+sprout+`<ellipse cx="60" cy="58" rx="30" ry="6" fill="#5c392a"/>`+emoji('💧',89,42,23)+path('M27 102q33 13 67 0','none','#38bdf8',5),
 'letter-envelope':emoji('✉️',60,100,70)+rect(40,8,40,40,'#fff')+path('M48 19h24m-24 8h19M60 51v13m-6-5 6 6 6-6','none','#64748b',3),
 'brew-tea':emoji('🫖',57,102,62)+path('M48 22q12-14 9 5t5 13','none','#94a3b8',3)+rect(72,20,17,23,'#d6b88a')+path('M80 43v18','none','#92400e',2),
 'pour-tea':emoji('🫖',38,58,45)+emoji('🍵',80,105,46)+path('M61 43q26 0 20 24','none','#c58b43',5),
 'cool-tea':emoji('🍵',45,101,57)+emoji('⏳',91,62,35),
 'drink-tea':emoji('😋',48,70,59)+emoji('🍵',88,103,40),
 'chrysalis':path('M15 17h89M62 17v15','none','#8a6344',5)+`<ellipse cx="62" cy="64" rx="21" ry="33" fill="#b5cd76" stroke="#6b873c" stroke-width="3"/>`+path('M45 45q20 15 34 9M42 61q18 14 40 8M45 78q16 9 31 5','none','#839c4d',3),
 'pack-picnic':emoji('🧺',60,110,65)+emoji('🥪',60,35,34)+path('M60 40v20m-7-6 7 7 7-7','none','#64748b',3),
 'picnic':rect(20,68,85,35,'#fda4af')+emoji('🌳',22,65,43)+emoji('🥪',68,78,38)+emoji('🧃',96,83,25),
 'clean-picnic':emoji('🗑️',81,105,54)+emoji('🧻',27,48,28)+path('M33 55 65 76m-10 0h10v-10','none','#64748b',3),
 'open-jam':jam.replace(rect(33,28,52,13,'#fb7185'),rect(61,10,48,12,'#fb7185')),
 'spread-jam':bread+path('M43 51q18-12 34 2v28H43Z','#e879a4','#db5286',2)+path('M72 53 101 24q7-5 10 2L81 61Z','#cbd5e1','#64748b',2),
 'sandwich':bread+path('M33 84h53','none','#e879a4',6)+path('M33 92h53','none','#bd814a',3),
 'eat-sandwich':emoji('😋',43,69,58)+`<g transform="translate(58 55) scale(.5)">${bread}${path('M33 84h53','none','#e879a4',6)}</g>`,
 'kite-frame':path('M60 12v85M24 47h72','none','#b8875d',6)+path('M60 12 96 47 60 97 24 47Z','none','#b8875d',2),
 'kite-paper':kite+path('M60 10v81M24 48h72','none','#d97706',2),
 'kite-color':kite+path('M60 10v81L24 48Z','#fb7185','#d97706',2)+emoji('🖍️',96,108,30),
 'kite-string':kite+path('M60 10v81L24 48Z','#fb7185','#d97706',2)+path('M60 91q-20 15 4 18t19 5','none','#64748b',2),
 'car-battery':emoji('🚗',60,107,68)+emoji('🔋',60,34,32)+path('M60 40v16m-6-5 6 6 6-6','none','#64748b',3),
 'car-switch':emoji('🚗',60,107,68)+circle(61,29,19,'#4ade80')+path('M61 16v13m-8-8a13 13 0 1 0 16 0','none','#166534',3),
 'car-moving':emoji('🚗',74,94,67)+path('M8 56h28M4 71h24M12 86h18','none','#38bdf8',4),
 'book-mark':emoji('📖',60,103,85)+path('M64 38h16v44l-8-7-8 7Z','#fb7185','#be123c',2),
 'bottle-open':bottle+`<g transform="translate(24 -14) rotate(12 60 20)">${cap}</g>`,
 'bottle-fill':bottle+path('M39 80h42v21H39Z','#7dd3fc','#7dd3fc')+emoji('💧',60,23,25)+path('M60 24v25','none','#38bdf8',3),
 'bottle-closed':bottle+path('M39 72h42v29H39Z','#7dd3fc','#7dd3fc')+cap,
 'ice-melting':emoji('☀️',89,35,32)+`<ellipse cx="52" cy="96" rx="36" ry="9" fill="#7dd3fc"/>`+emoji('🧊',51,93,48),
 'puddle':`<ellipse cx="60" cy="79" rx="44" ry="15" fill="#7dd3fc"/>`+path('M34 78q22 10 48-1','none','#e0f2fe',4),
 'unlock-door':rect(34,12,62,96,'#d6b88a')+circle(80,64,5,'#92400e')+emoji('🔑',39,79,43),
 'open-door':rect(27,10,69,98,'#334155')+path('M27 10 71 27v81H27Z','#deb887','#926544',3)+circle(62,67,4,'#a16207'),
 'enter-door':rect(44,10,61,99,'#334155')+emoji('🚶',60,104,74)+path('M7 65h26m-7-7 8 7-8 7','none','#38bdf8',4),
 'toys-box':emoji('📦',63,109,69)+emoji('🧩',46,48,32)+emoji('🧸',84,47,30)+path('M60 46v17','none','#64748b',3),
 'toys-shelf':shelf+emoji('🧸',38,59,31)+emoji('📦',78,59,31)+emoji('🚗',59,102,36),
 'paint-stroke':paper+path('M42 44q13-11 32 5M40 57l35 8','none','#60a5fa',10)+emoji('🖌️',85,101,37),
 'wash-apple':water+emoji('🍎',60,108,62),
 'dry-apple':emoji('🍎',42,103,58)+towel,
 'eat-apple':emoji('😋',47,70,58)+emoji('🍎',90,105,40),
 'bike-helmet':path('M19 66C16 12 104 10 104 66Z','#60a5fa','#2563eb',4)+path('M27 67q10 43 34 35 16-4 23-35','none','#334155',5)+path('M41 31v16m20-21v17m20-12v16','none','#1d4ed8',6),
 'pedal-bike':emoji('🚴',61,102,86)+path('M46 75a15 15 0 1 0 27 11m-8 1h9v-9','none','#f59e0b',4),
 'bike-finish':emoji('🚲',42,106,64)+emoji('🏁',94,69,43),
 'balloon-flat':path('M49 28q30-9 25 18L62 81l8 8-19 1 4-12-11-31q-7-15 5-19Z','#fb7185','#be123c',3),
 'balloon-pump':`<ellipse cx="80" cy="42" rx="23" ry="29" fill="#fb7185" stroke="#be123c" stroke-width="3"/>`+rect(17,57,16,44,'#60a5fa')+path('M25 56V26m-10 0h20M33 94q47 20 47-23','none','#475569',4),
 'balloon-knot':`<ellipse cx="60" cy="43" rx="29" ry="34" fill="#fb7185" stroke="#be123c" stroke-width="3"/>`+path('m60 77-7 12h14Z','#e11d48','#9f1239',3)+circle(60,84,18,'none')+path('M36 102 51 91m-9 1 9-1-2 9','none','#475569',3),
 'balloon-string':emoji('🎈',60,105,91),
 'dirty-plate':plate+path('M44 57q12 5 9 17m12-18 12 18','none','#b97736',6)+circle(68,81,4,'#b97736'),
 'soap-plate':plate+bubbles+emoji('🧽',89,99,39),
 'rinse-plate':plate+water,
 'plate-rack':shelf+emoji('🍽️',38,59,34)+emoji('🍽️',80,59,34)+emoji('🍵',59,103,33),
 'crosswalk':road+`<g transform="translate(0 -13) scale(.7)">${people}</g>`,
 'crosswalk-stop':road+`<g transform="translate(0 -13) scale(.7)">${people}</g>`+emoji('🛑',93,44,30),
 'crosswalk-look':road+`<g transform="translate(18 -13) scale(.7)">${people}</g>`+path('M40 20H14m7-6-7 6 7 6M80 20h26m-7-6 7 6-7 6','none','#0284c7',3),
 'crosswalk-go':road+`<g transform="translate(18 34) scale(.7)">${people}</g>`+rect(90,6,22,46,'#334155')+circle(101,38,7,'#4ade80')+circle(101,17,6,'#64748b'),
 'plant-sapling':`<ellipse cx="60" cy="101" rx="30" ry="8" fill="#795139"/>`+tree+path('m60 87-10 9m10-9 11 9','none','#92400e',3),
 'cover-roots':ground+tree+path('M17 67 37 85m-10-2 10 2-3-10','none','#92400e',3),
 'water-sapling':ground+tree+emoji('💧',94,66,30),
 'grown-sapling':ground+path('M60 94V34','none','#92400e',6)+circle(60,37,28,'#65a30d')+circle(40,54,22,'#84cc16')+circle(79,54,22,'#84cc16'),
 'wake-up':emoji('🛏️',61,107,75)+emoji('☀️',26,35,31)+emoji('⏰',93,43,30),
 'school-shirt':emoji('👕',60,102,89)+path('m55 34 8 0-1 35-6 0Z','#2563eb','#1d4ed8',2),
 'fold-middle':paper+path('M60 14v90','none','#94a3b8',2)+path('M26 12 60 27v64L26 106Z','#bfdbfe','#3b82f6',2)+path('M72 48q25 0 6 24m0-9v9h9','none','#f59e0b',3),
 'fold-wings':path('M60 10 101 93 60 74 19 93Z','#dbeafe','#0284c7',3)+path('M60 10v64M60 38 34 86m26-48 26 48','none','#0284c7',2)+path('M12 54h22m-6-6 6 6-6 6M108 54H86m6-6-6 6 6 6','none','#f59e0b',3),
 'paper-plane':plane,
 'plane-flying':`<g transform="translate(16 0) scale(.85)">${plane}</g>`+path('M7 91q15 15 31-3M5 105q25 12 43-5','none','#38bdf8',3),
 'spilled-water':rect(5,83,110,12,'#d6b88a')+`<ellipse cx="78" cy="80" rx="29" ry="7" fill="#7dd3fc"/>`+`<g transform="rotate(-65 38 64)">${path('M21 40h30l-4 42H25Z','#e0f2fe','#0284c7',3)}</g>`
 };
 return scenes[key]?`<svg class="lesson-illustration" viewBox="0 0 120 120" aria-hidden="true" focusable="false">${scenes[key]}</svg>`:'';
}

function storyPicture(icon){
 const illustration=lessonIllustration(icon);if(illustration)return illustration;
 if(icon!=='soil-pot')return icon;
 return `<svg class="story-soil-pot" viewBox="0 0 120 120" aria-hidden="true" focusable="false"><ellipse cx="60" cy="108" rx="37" ry="5" fill="#e2e8f0"/><path d="M26 45h68l-9 54q-1 7-9 7H44q-8 0-9-7Z" fill="#dc784a" stroke="#a64f31" stroke-width="4"/><path d="m35 57 7 38" stroke="#f6b080" stroke-width="7" stroke-linecap="round"/><rect x="20" y="35" width="80" height="24" rx="8" fill="#ef9966" stroke="#a64f31" stroke-width="4"/><ellipse cx="60" cy="37" rx="35" ry="13" fill="#69412d" stroke="#a64f31" stroke-width="4"/><path d="M33 36q12-14 25-8 16-10 29 7" fill="#855538"/><g fill="#bf9166"><ellipse cx="43" cy="35" rx="4" ry="2.5"/><ellipse cx="69" cy="39" rx="4" ry="2"/><circle cx="59" cy="30" r="2"/><circle cx="81" cy="34" r="2"/></g></svg>`;
}
function renderLesson(){
 if(m.type==='cause'){const j=state.question||0,q=m.questions[j];return `<section class="cause-question"><span class="round-dots" aria-label="Soal ${j+1} dari ${m.questions.length}">${m.questions.map((_,i)=>`<i class="${i<=j?'active':''}"></i>`).join('')}</span><div class="cause-scene"><h2>${q.text.split('. ')[0]}</h2><div class="big-scene" aria-hidden="true">${storyPicture(q.scene)}</div></div><p class="cause-prompt">${q.text.split('. ').slice(1).join('. ')||'Pilih yang cocok!'}</p><div class="visual-choices">${q.choices.map((c,i)=>btn('cause',j+':'+i,`<span aria-hidden="true">${storyPicture(c.icon)}</span>`,`visual-choice ${state.answer[j]===i?'selected':''}`,c.name)).join('')}</div></section>`;}

 return `<div class="story-heading"><span class="pill">${m.type==='debug'?'🔧 Ada langkah tertukar':'🌱 Dari awal ke akhir'}</span><h2>${m.story}</h2></div><div class="story-track">${state.answer.map((v,i)=>btn('story',i,`<small>${i+1}</small><span aria-hidden="true">${storyPicture(m.items[v].icon)}</span><b>${m.items[v].name}</b>`,`story-tile ${state.selection===i?'selected':''}`,`Langkah ${i+1}: ${m.items[v].name}`)).join('')}</div>`;
}
function lessonClue(){if(m.type==='cause'){const i=m.questions.findIndex((q,j)=>!q.choices[state.answer[j]]?.correct);return m.questions[Math.max(0,i)].clue;}return 'Bayangkan kamu melakukan ceritanya. Apa yang harus terjadi lebih dulu sebelum langkah ini?';}

function shortInstruction(){return ({memory:'Cari dua kartu kembar!',sort:m.ruleText?'Ikuti aturan rumahnya.':'Samakan warna atau gambarnya!',pattern:'Isi gerbong yang kosong.',mosaic:'Susun seperti gambar contoh.',matrix:'Isi kotak. Jangan ada gambar kembar!',factory:'Susun mesin. Samakan hasilnya!',route:'Susun panah. Antar Bimo ke 🔋.',music:'Dengar, lalu tirukan iramanya.',detective:'Cari gambar sesuai petunjuk.',packing:'Isi tas sesuai jumlah titik.',sequence:'Seret gambar. Urutkan ceritanya!',debug:'Tukar gambar yang terbalik.'})[m.type]||m.brief;}

function visualClue(r){
 const icon=v=>r.field==='o'?`<span class="clue-object">${theme().objects[v].icon}</span>`:r.field==='c'?`<span class="clue-swatch" style="background:${E.colors[v].hex}">${E.colors[v].mark}</span>`:r.field==='big'?`<span class="clue-size ${v?'large':'little'}">🐾</span><small>${v?'Besar':'Kecil'}</small>`:`<span class="clue-object">${v?'★':'☆̸'}</span><small>${v?'Berbintang':'Tanpa bintang'}</small>`;
 return `<div class="clue-picture" role="img" aria-label="${escapeHTML(ruleText(r))}">${r.op==='ne'?'<b class="clue-not">BUKAN</b>':''}${r.op==='in'?r.value.map(icon).join('<small>atau</small>'):icon(r.value)}</div>`;
}
