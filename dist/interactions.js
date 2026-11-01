'use strict';
// Pointer events support mouse, pen and touch; native buttons remain usable by keyboard.
const playGuides = {
  memory: ['Cari dua kartu kembar!', '👆 Buka kartu', '👀 Ingat gambar + warna', '🐾 Temukan kembarnya'],
  cause:['Apa yang terjadi berikutnya?', '👀 Lihat kejadian', '🤔 Pikirkan akibatnya', '👆 Pilih gambar'],
  sequence:['Susun ceritanya!', '👀 Lihat semua gambar', '✋ Tukar tempat', '✅ Cek urutannya'],
  debug:['Perbaiki langkah Bimo!', '👀 Cari yang tertukar', '✋ Tukar gambar', '✅ Cek lagi'],
  sort: ['Antar kartu ke rumahnya!', '👀 Lihat warna & gambar rumah', '✋ Seret satu kartu', '🏡 Lepas di rumah yang cocok'],
  pattern: ['Ayo, lengkapi keretanya!', '👀 Lihat urutan gambar', '✋ Seret gambar pilihan', '🚂 Isi gerbong bertanda ?'],
  mosaic: ['Satukan gambar yang terpotong!', '👀 Lihat gambar contoh', '✋ Seret satu potongan', '🧩 Lepas untuk bertukar tempat'],
  matrix: ['Bantu isi kebun ini!', '👀 Cari gambar yang belum ada', '✋ Seret gambar ke kotak', '🌱 Tiap baris dan kolom beda'],
  factory: ['Samakan dengan tujuan!', '👀 Lihat warna tujuan', '🪄 Pilih atau seret sihir ke kotak', '▶ Tekan Bim Salabim!'],
  route: ['Antar Bimo ke baterai!', '👀 Cari jalan ke 🔋', '✋ Susun kartu panah', '▶ Ayo, Bimo jalan!'],
  music: ['Tirukan irama lucunya!', '👂 Dengarkan contoh', '✋ Susun kartu bunyi', '▶ Mainkan iramamu'],
  detective: ['Siapa yang kita cari?', '🔎 Baca satu petunjuk', '👀 Cari gambar yang cocok', '👆 Ketuk pilihanmu'],
  packing: ['Siapkan bekal petualangan!', '👀 Hitung titik di bekal', '✋ Seret bekal ke tas', '🎒 Cocokkan jumlah titiknya']
};
function childGuide() {
  const [title, ...steps] = playGuides[m.type];
  return `<section class="bimo-guide" aria-label="Cara bermain"><button id="bimoBuddy" class="bimo-buddy" data-action="buddy" aria-label="Tos dengan Bimo"><span class="buddy-antenna" aria-hidden="true">✦</span><span class="buddy-face" aria-hidden="true"><i></i><i></i><span class="buddy-mouth"></span></span><small>Tos! 🖐️</small></button><div><b>${title}</b><ol>${steps.map(s=>`<li>${s}</li>`).join('')}</ol><small>${['memory','detective','cause'].includes(m.type)?'Pelan-pelan saja. Aku menemanimu!':'Pegang kartu, geser, lalu lepaskan. Ketuk kartu dan tujuannya juga boleh.'}</small><details class="how-demo"><summary>👀 Tunjukkan caranya</summary><div class="demo-stage ${['memory','detective','cause'].includes(m.type)?'demo-tap':''}" aria-hidden="true"><span class="demo-hand">☝️</span><span class="demo-card">${({cause:'☂️',sequence:'🌱',debug:'🔧',memory:'🐾',detective:'🔎',route:'↑',music:'🥁',factory:'🎨',packing:'🍎',sort:'🦁',matrix:'🌼',pattern:'🐾',mosaic:'🧩'})[m.type]}</span><span class="demo-home">${m.type==='sort'?'🏡':m.type==='packing'?'🎒':'⬚'}</span></div><p>${['memory','detective','cause'].includes(m.type)?'Ketuk kartu. Lihat gambarnya baik-baik.':'Pegang satu kartu → geser ke tempatnya → lepaskan.'} Coba sendiri, yuk!</p></details></div></section>`;
}
function preparePlay() {
  const game = $('#game');
  const mark = (selector, key, value) => game.querySelectorAll(selector).forEach(el => {
    el.dataset[key] = value;
    if (key === 'dragKind') { el.classList.add('grabbable'); el.draggable = false; }
    else el.classList.add('drop-zone');
  });
  if (m.type === 'sort') { mark('[data-action="select"]','dragKind','sort'); mark('[data-action="bin"]','dropKind','sort'); }
  if (m.type === 'packing') { mark('[data-action="provision"]','dragKind','packing'); mark('[data-action="bag"]','dropKind','packing'); }
  if (m.type === 'pattern') { mark('[data-action="pattern"]','dragKind','pattern'); mark('[data-action="select"]','dropKind','pattern'); }
  if (m.type === 'matrix') { mark('.symbol-button','dragKind','matrix'); mark('[data-action="select"]','dropKind','matrix'); }
  if (isStory()) { mark('[data-action="story"]','dragKind','story'); mark('[data-action="story"]','dropKind','story'); }
  if (m.type === 'mosaic') { mark('[data-action="tile"]','dragKind','mosaic'); mark('[data-action="tile"]','dropKind','mosaic'); }
  mark('[data-action="add"]','dragKind','command');
  mark('[data-action="remove"]','dragKind','reorder');
  mark('.program, .token','dropKind','program');
  game.querySelectorAll('.token').forEach((el,i) => { el.dataset.index=i; el.setAttribute('aria-label', `Kartu ${i+1}: ${codeLabel(state.program[i])}. Enter untuk menghapus. Alt + panah kiri atau kanan untuk memindahkan.`); });
  // Show the actual contents of houses and bags, not just an abstract count.
  if (m.type === 'sort') game.querySelectorAll('[data-drop-kind]').forEach(el=>{
    const bin=+el.dataset.value;
    const contents=m.cards.map((c,i)=>state.answer[i]===bin?`<span data-card-index="${i}">${m.type==='sort'?card(c,{small:true}):theme().objects[c.o].icon}</span>`:'').join('');
    el.insertAdjacentHTML('beforeend',`<span class="placed-items" aria-hidden="true">${contents||'<span class="drop-prompt">↓ Taruh di sini</span>'}</span>`);
  });
}
let dragging=null, suppressClickUntil=0;
function cancelDrag(returnHome=false) {
  if (!dragging) return;
  cancelAnimationFrame(dragging.frame);if(dragging.ghost){suppressClickUntil=Date.now()+400;if(returnHome===true)GameMotion.returnGhost(dragging.ghost,dragging.source);else dragging.ghost.remove();} dragging.source.classList.remove('drag-source');
  document.querySelectorAll('.drop-ready,.drop-hover').forEach(el=>el.classList.remove('drop-ready','drop-hover'));
  dragging=null;
}
function scrollWhileDragging() {
  const d=dragging;if(!d?.ghost)return;
  if(d.lastY>window.innerHeight-65)window.scrollBy(0,10);else if(d.lastY<65)window.scrollBy(0,-10);
  d.frame=requestAnimationFrame(scrollWhileDragging);
}
function compatibleDrop(kind, target) { return target && target.dataset.dropKind === (['command','reorder'].includes(kind)?'program':kind); }
function applyDrop(kind, value, target, releaseRect=null) {
  if (!m || state.busy || !compatibleDrop(kind,target)) return false;
  const to=+target.dataset.value, from=+value;let arrivalKey='';
  if (kind==='sort'||kind==='packing') state.answer[from]=to;
  else if (kind==='pattern') state.answer[to]=clone(m.choices[from]);
  else if (kind==='matrix') { if(m.clues[to]>=0)return false; state.answer[to]=from; }
  else if (kind==='mosaic'||kind==='story') [state.answer[from],state.answer[to]]=[state.answer[to],state.answer[from]];
  else {
    let index=target.dataset.index===undefined?state.program.length:+target.dataset.index;
    if(kind==='command') { if(state.program.length>=30){setStatus('Rencananya penuh. Hapus satu kartu dulu, ya.');return false;} state.program.splice(index,0,{type:value}); }
    else { const [item]=state.program.splice(from,1); if(index>from)index--; state.program.splice(index,0,item); }
    arrivalKey=GameMotion.key(state.program[index]);state.active=-1;
  }
  state.selection=null;
  if(releaseRect){arrivalKey=arrivalKey||({sort:'placed-sort-'+from,packing:'placed-packing-'+from,pattern:'pattern-'+to,matrix:'matrix-'+to,mosaic:'tile-'+state.answer[to],story:'story-'+state.answer[to]})[kind];GameMotion.seed(arrivalKey,releaseRect);}
  state.dotCount=0;renderGame();
  setStatus(({sort:'Kartu sudah sampai! Mau pindahkan? Seret lagi, ya. 🏡',packing:'Bekal masuk! Yuk, hitung titik di tas. 🎒',pattern:'Gerbong terisi! Coba baca urutannya. 🚂',matrix:'Gambar tertanam! Lihat baris dan kolomnya. 🌱',mosaic:'Tukar tempat! Makin mirip contoh belum? 🧩',command:'Kartu masuk rencana! Tambah lagi atau tekan Jalankan. 🤖',story:'Gambarnya sudah bertukar. Ceritanya masuk akal belum? 🌱',reorder:'Urutannya berubah! Yuk, coba rencana barumu. 🤖'})[kind]);
  const targets={sort:`[data-action="bin"][data-value="${to}"]`,packing:`[data-action="bag"][data-value="${to}"]`,pattern:`[data-action="select"][data-value="${to}"]`,matrix:`.matrix-cell[data-value="${to}"]`,mosaic:`[data-action="tile"][data-value="${to}"]`,command:'.program',reorder:'.program'};
  if(['sort','packing'].includes(kind))animatePlay(targets[kind]);else reactBimo('happy');
  return true;
}
document.addEventListener('pointerdown',e=>{
  const source=e.target.closest('[data-drag-kind]');
  if(!source || source.disabled || !m || state.busy || e.button!==0 || !e.isPrimary)return;
  cancelDrag();
  const sourceRect=source.getBoundingClientRect();
  dragging={offsetX:e.clientX-sourceRect.left,offsetY:e.clientY-sourceRect.top,lastX:e.clientX,source,kind:source.dataset.dragKind,value:source.dataset.value,id:e.pointerId,x:e.clientX,y:e.clientY,epoch,ghost:null};
  source.setPointerCapture(e.pointerId);
});
document.addEventListener('pointermove',e=>{
  const d=dragging;if(!d||d.id!==e.pointerId)return;
  if(d.epoch!==epoch){cancelDrag();return;}
  if(!d.ghost && Math.hypot(e.clientX-d.x,e.clientY-d.y)<9)return;
  e.preventDefault();d.lastY=e.clientY;
  if(!d.ghost){
    d.ghost=d.source.cloneNode(true);d.ghost.removeAttribute('id');d.ghost.classList.add('drag-ghost');d.ghost.setAttribute('aria-hidden','true');d.ghost.style.width=d.source.offsetWidth+'px';document.body.append(d.ghost);d.frame=requestAnimationFrame(scrollWhileDragging);d.source.classList.add('drag-source');
    document.querySelectorAll('[data-drop-kind]').forEach(el=>{if(compatibleDrop(d.kind,el))el.classList.add('drop-ready');});
  }
  const tilt=GameMotion.enabled()?Math.max(-7,Math.min(7,(e.clientX-d.lastX)*.3)):0;d.lastX=e.clientX;d.ghost.style.setProperty('--drag-tilt',tilt+'deg');
  d.ghost.style.left=(e.clientX-d.offsetX)+'px';d.ghost.style.top=(e.clientY-d.offsetY)+'px';
  document.querySelectorAll('.drop-hover').forEach(el=>el.classList.remove('drop-hover'));
  const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-drop-kind]');
  if(compatibleDrop(d.kind,target))target.classList.add('drop-hover');
},{passive:false});
document.addEventListener('pointerup',e=>{
  const d=dragging;if(!d||d.id!==e.pointerId)return;
  const moved=!!d.ghost,target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-drop-kind]');
  const releaseRect=GameMotion.rect(d.ghost),valid=compatibleDrop(d.kind,target);
  cancelDrag(moved&&!valid);
  if(moved){suppressClickUntil=Date.now()+400;if(d.epoch===epoch&&!applyDrop(d.kind,d.value,target,releaseRect))setStatus('Belum masuk. Coba lepas kartunya di kotak yang menyala, ya.');}
});
document.addEventListener('pointercancel',()=>cancelDrag(true));
document.addEventListener('lostpointercapture',cancelDrag);
window.addEventListener('blur',cancelDrag);
document.addEventListener('click',e=>{if(Date.now()<suppressClickUntil){e.preventDefault();e.stopImmediatePropagation();}},true);
document.addEventListener('keydown',e=>{
  if(e.key==='Escape')cancelDrag(true);
  const token=e.target.closest('.token');
  if(!token||!e.altKey||!['ArrowLeft','ArrowRight'].includes(e.key)||state.busy)return;
  e.preventDefault();const from=+token.dataset.index,to=from+(e.key==='ArrowLeft'?-1:1);
  if(to<0||to>=state.program.length)return;
  [state.program[from],state.program[to]]=[state.program[to],state.program[from]];
  state.active=-1;renderGame();$('#game').querySelectorAll('.token')[to].focus();setStatus(`Kartu pindah ke langkah ${to+1}.`);
});
