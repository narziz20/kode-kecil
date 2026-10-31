'use strict';
// Hints describe the child's current attempt, then ask one question at a time.
const thinkingQuestions = {
  memory:['Gambarnya sama. Warna bingkainya juga sama, belum?', 'Ingat satu kartu dulu. Di mana kamu pernah melihat kembarnya?', 'Sebut gambar dan warnanya pelan-pelan saat kartu terbuka.'],
  sort:['Nama rumah ini meminta warna atau gambar apa?', 'Coba bandingkan satu kartu dengan tulisan di rumahnya.', 'Kalau ada DAN, dua-duanya harus cocok. Kalau ATAU, cukup salah satu.'],
  pattern:['Coba sebut gambar dari kiri. Bagian mana yang muncul lagi?', 'Lihat dua kelompok yang sama. Setelah kelompok itu, apa yang datang?', 'Periksa gambar dan warna secara terpisah. Keduanya mengikuti pola apa?'],
  mosaic:['Lihat tepi gambar. Garis mana yang bisa menyambung?', 'Cari potongan langit. Di contoh, langit ada di bagian mana?', 'Bandingkan satu sudut dulu. Apakah warna di kedua tepinya cocok?'],
  matrix:['Lihat satu baris ke samping ↔. Ada gambar kembar?', 'Sekarang lihat ke atas dan bawah ↕. Ada gambar kembar juga?', 'Cari baris yang tinggal satu kotak kosong. Gambar apa yang belum ada?'],
  factory:['Bandingkan hasil dan contoh. Yang beda: warna, gambar, atau ukuran?', 'Lihat satu mesin dulu. Apa yang berubah setelah mesin itu bekerja?', 'Mesin bekerja dari kiri ke kanan. Kalau urutannya ditukar, apa yang berubah?'],
  route:['Dari tempat Bimo berhenti, jalan kosongnya ada di mana?', 'Tunjuk satu petak yang ingin dituju. Panah mana yang menuju ke sana?', 'Coba jalankan rencana pendek dulu. Sudah di jalan yang kamu inginkan?'],
  music:['Tunjuk bunyi contoh satu-satu. Bunyi mana yang berbeda?', 'Tepukkan contoh pelan-pelan. Jumlah bunyinya sudah sama?', 'Adakah kelompok bunyi yang muncul lagi? Kelompok itu bisa diulang.'],
  detective:['Bandingkan kartumu dengan satu petunjuk dulu. Sudah cocok?', 'Pakai tombol Coret. Tandai gambar yang menurutmu tidak cocok.', 'Baca petunjuk berikutnya. Pilihan yang tersisa harus cocok dengan semuanya.'],
  packing:['Bekal mana yang mau kamu coba? Hitung titiknya dulu.', 'Coba tukar satu bekal. Perlu yang titiknya lebih sedikit atau lebih banyak?', 'Hitung lagi satu-satu. Adakah bekal lain yang bisa mengisi selisihnya?']
};
function diagnoseAttempt() {
  const a=state.answer, result=(text,focus='')=>({text,focus});
  switch(m.type){
    case 'sort': {const i=a.findIndex((v,i)=>v!==m.answers[i]);return result(i<0?'Semua kartu sudah punya rumah yang cocok.':a[i]<0?'Masih ada kartu yang belum punya rumah.':`Kartu nomor ${i+1} belum cocok dengan rumahnya.`,i<0?'':`[data-action="select"][data-value="${i}"]`);}
    case 'pattern': {const i=a.findIndex((v,i)=>!v||E.cardKey(v)!==E.cardKey(m.sequence[m.blanks[i]]));return result(i<0?'Kereta sudah mengikuti pola.':!a[i]?'Ada gerbong yang masih kosong.':`Coba lihat gerbong nomor ${m.blanks[i]+1} lagi.`,i<0?'':`[data-action="select"][data-value="${i}"]`);}
    case 'mosaic': return result('Masih ada potongan yang belum menyambung.','.puzzle-example');
    case 'matrix': {
      for(let r=0;r<m.n;r++)for(let c=0;c<m.n;c++){const i=r*m.n+c,v=a[i];if(v<0)continue;const same=E.range(m.n).some(k=>(k!==c&&a[r*m.n+k]===v)||(k!==r&&a[k*m.n+c]===v));if(same)return result(`Ada gambar kembar di baris atau kolom kotak yang ditandai.`,`[data-value="${i}"].matrix-cell`);}
      const i=a.indexOf(-1);return result(i<0?'Kebunnya sudah terisi.':'Masih ada kotak kosong. Kita isi satu dulu, ya.',i<0?'':`[data-value="${i}"].matrix-cell`);
    }
    case 'packing': {const b=m.targets.findIndex((t,b)=>m.cards.reduce((s,c,i)=>s+(a[i]===b?c.value:0),0)!==t||(m.counts&&a.filter(v=>v===b).length!==m.counts[b]));if(b<0)return result('Jumlah bekalnya sudah cocok.');const sum=m.cards.reduce((s,c,i)=>s+(a[i]===b?c.value:0),0),t=m.targets[b];return result(sum===t?`Titiknya pas! Tapi tas ${b+1} perlu ${m.counts[b]} bekal.`:`Tas ${b+1} berisi ${sum} titik. Tujuannya ${t}. Masih ${sum<t?'kurang':'kelebihan'} ${Math.abs(t-sum)} titik.`,`[data-action="bag"][data-value="${b}"]`);}
    case 'detective': {if(a===null)return result('Pilih satu gambar untuk kita periksa.','.suspects');const i=m.rules.findIndex(r=>!E.matches(m.cards[a],r));return result(i<0?'Kartumu cocok dengan semua petunjuk.':`Pilihanmu belum cocok dengan petunjuk ${i+1}: ${ruleText(m.rules[i])}`,i<0?'':`.clue-panel li:nth-child(${i+1})`);}
    case 'factory': {const i=state.outputs.findIndex((c,i)=>['o','c','big','badge'].some(k=>c[k]!==m.targets[i][k]));return result(i<0?'Hasil gambarnya sudah cocok. Yuk, periksa kartu khusus yang diminta.':`Lihat hasil nomor ${i+1}. Masih ada yang berbeda dari contoh.`,i<0?'':`.factory-row:nth-child(${i+1})`);}
    case 'route': {const t=E.travel(m,state.program);return result(t.error>=0?`Bimo berhenti sebelum langkah ${t.error+1}. Di depan ada penghalang atau tepi papan.`:t.stars.length<m.stars.length?'Ada bintang yang belum diambil. Saat di atas bintang, pakai kartu ⭐ ambil.':'Bimo belum sampai bendera. Rencananya boleh ditambah, ya.','.route-board');}
    case 'music': {const heard=state.heard;const i=m.target.findIndex((v,i)=>v!==heard[i]);return result(i>=0?`Dengarkan bunyi nomor ${i+1} lagi. ${heard[i]===undefined?'Rencanamu belum sampai bunyi itu.':'Bunyinya masih berbeda.'}`:heard.length>m.target.length?'Ada bunyi tambahan di akhir rencanamu.':'Bunyinya sudah cocok. Coba periksa kartu Ulang atau Jurus yang diminta.','.music-score');}
    default:return result('Belum kembar. Yuk, ingat letaknya dulu.');
  }
}
function showThinking(isRetry=false, override='') {
  if(!m||state.busy)return;
  const n=state.clueStep||0;
  state.clueStep=Math.min(n+1,2);
  const diagnosis=diagnoseAttempt();
  const question=m.type==='sort'&&!m.ruleText&&n>=2?'Pilih satu kartu. Ciri apa yang sama dengan nama rumahnya?':thinkingQuestions[m.type][Math.min(n,2)];
  setStatus(`${isRetry?'Belum pas, tidak apa-apa. ':''}${override||diagnosis.text}`,'thinking');
  const coach=$('#coach');
  if(coach)coach.innerHTML=`<div class="thinking-card"><span aria-hidden="true">🌱</span><div><b>${isRetry?'Kita coba satu langkah lagi, yuk!':'Bimo punya pertanyaan'}</b><p>${escapeHTML(question)}</p><div class="coach-actions"><button class="secondary" data-action="hint">💡 ${n<2?'Bantu sedikit lagi':'Baca petunjuk lagi'}</button><button class="secondary" data-action="coachListen">🔊 Dengarkan</button><button class="secondary" data-action="tryAgain">✋ Aku mau coba</button></div></div></div>`;
  state.coachSpeech=`${override||diagnosis.text} ${question}`;speak(state.coachSpeech);
  if(diagnosis.focus)document.querySelector(diagnosis.focus)?.classList.add('clue-focus');
  reactBimo('think');
  if(isRetry)$('#status')?.scrollIntoView({behavior:'auto',block:'nearest'});
}
function reactBimo(mood='happy') {
  const face=$('#bimoBuddy');if(!face)return;
  face.dataset.mood=mood;
  face.classList.remove('buddy-pop');void face.offsetWidth;face.classList.add('buddy-pop');
}
function animatePlay(selector,style='pop') {
  const el=document.querySelector(selector);if(!el)return;
  el.classList.remove('play-pop','play-wiggle');void el.offsetWidth;el.classList.add('play-'+style);
  reactBimo('happy');
}
function playfulTools() {
  if(m.type==='detective')return `<div class="play-tools">${btn('crossMode','',state.crossMode?'🔎 Pilih jawaban':'✏️ Coret pilihan','secondary', 'Ganti mode mencoret')}<span>${state.crossMode?'Ketuk gambar untuk mencoret. Ketuk lagi untuk mengembalikan.':'Tidak cocok? Coret dulu. Kamu boleh berubah pikiran.'}</span></div>`;
  if(m.type==='packing')return `<div class="play-tools">${m.targets.map((_,b)=>btn('countDots',b,`👆 Hitung tas ${b+1}`,'secondary')).join('')}<span id="countingDots" role="status">${state.dotCount?`Tas ${(state.countBag||0)+1}: titik ke-${state.dotCount} · ketuk lagi untuk lanjut`:'Satu ketukan, satu titik. Yuk, hitung bersama!'}</span></div>`;
  if(m.type==='mosaic')return `<div class="play-tools">${btn('peek','','🔍 Lihat contoh lebih dekat','secondary')}</div>`;
  if(m.type==='music')return `<div class="sound-playground"><b>🎵 Coba bunyinya dulu!</b><p>Ketuk alat musik. Rencanamu tetap seperti tadi.</p><div>${['0','1','2','3'].map(v=>btn('audition',v,`${noteIcon(v)} <small>${commandName(v)}</small>`,'sound-pad')).join('')}</div></div>`;
  return '';
}
function decoratePlay() {
  const game=$('#game');game.insertAdjacentHTML('beforeend',playfulTools());
  if(m.type==='detective')game.querySelectorAll('.suspect').forEach((el,i)=>{el.classList.toggle('crossed-out',!!state.crossed?.includes(i));el.setAttribute('aria-pressed',String(state.crossMode?!!state.crossed?.includes(i):state.answer===i));el.setAttribute('aria-label',`Pilihan ${i+1}: ${cardName(m.cards[i])}${state.crossed?.includes(i)?', kamu coret':''}`);});
}
function playfulAction(a,v) {
  if(a==='buddy'){state.highFives=(state.highFives||0)+1;reactBimo('happy');setStatus(['Tos! 🖐️ Aku senang kamu mau mencoba.','Bip-bip! 🤖 Kita pikirkan satu langkah dulu.','Kamu boleh salah. Kita bisa coba cara lain! 🌱'][(state.highFives-1)%3]);return true;}
  if(a==='coachListen'){if('speechSynthesis'in window)speak(state.coachSpeech||initialMessage(),true);else setStatus('Suara belum tersedia. Yuk, baca petunjuknya bersama pendamping.');return true;}
  if(a==='tryAgain'){$('#coach').innerHTML='';document.querySelector('.clue-focus')?.scrollIntoView({block:'center',behavior:'auto'});setStatus('Yuk, ubah satu bagian dulu. Menurutmu, apa yang akan terjadi?');return true;}
  if(a==='crossMode'){state.crossMode=!state.crossMode;renderGame();setStatus(state.crossMode?'Ketuk gambar yang menurutmu tidak cocok. Ketuk lagi kalau berubah pikiran.':'Sekarang ketuk satu gambar untuk jawabanmu.');return true;}
  if(a==='suspect'&&state.crossMode){state.crossed??=[];const i=state.crossed.indexOf(+v);if(i>=0)state.crossed.splice(i,1);else state.crossed.push(+v);if(state.answer===+v)state.answer=null;renderGame();animatePlay(`[data-action="suspect"][data-value="${v}"]`);return true;}
  if(a==='countDots'){const b=+(v||0);if(state.countBag!==b)state.dotCount=0;state.countBag=b;const total=m.cards.reduce((s,c,i)=>s+(state.answer[i]===b?c.value:0),0);state.dotCount=total?((state.dotCount||0)%total)+1:0;$('#countingDots').textContent=total?`Tas ${b+1}: ${'● '.repeat(state.dotCount)} ${state.dotCount}${state.dotCount===total?' · Semua titik di tas ini sudah dihitung!':''}`:'Tas masih kosong. Masukkan satu bekal dulu, ya.';speak(total?String(state.dotCount):'Tas masih kosong.');animatePlay(`[data-action="bag"][data-value="${b}"]`);return true;}
  if(a==='peek'){showDialog(`<div class="peek-picture"><h2>🔍 Lihat baik-baik, yuk!</h2><img src="${pictureURI()}" alt="Contoh gambar utuh"><p>Cari langit, sudut, dan garis yang menyambung.</p><button class="primary" data-action="close">Aku mau menyusun! 🧩</button></div>`);return true;}
  if(a==='audition'){sound=true;updateSound();playNote(v);animatePlay(`[data-action="audition"][data-value="${v}"]`);setStatus(`${commandName(v)}! Coba ketuk alat musik yang lain. 🎶`);return true;}
  return false;
}
