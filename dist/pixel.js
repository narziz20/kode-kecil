'use strict';
// Each level has its own hand-drawn silhouette, not a recolored duplicate.
const PixelArt=(()=>{
 const colors={R:['Merah','#ef5350'],P:['Merah muda','#f59ac4'],Y:['Kuning','#facc15'],G:['Hijau','#4caf50'],D:['Hijau tua','#21764b'],L:['Hijau muda','#a3d95b'],B:['Biru','#4c8fe8'],C:['Biru muda','#86dcea'],W:['Putih','#ffffff'],K:['Hitam','#263446'],O:['Jingga','#fb923c'],N:['Cokelat','#a67349'],V:['Ungu','#a78bfa'],S:['Krem','#f9e6b2']};
 const levels=PIXEL_LEVELS;
 // Keep the original fifteen IDs attached to their subjects so saved stars survive.
 const ids=levels.map((_,i)=>{const tier=Math.floor(i/20),slot=i%20;return slot<3?1045+tier*3+slot:1060+tier*17+slot-3;});
 const indices=new Map(ids.map((id,i)=>[id,i]));
 const make=i=>{const [artName,icon,palette,rows]=levels[i];return {id:ids[i],type:'pixel',title:'Piksel Ajaib',skill:'Pola, koordinat & ketelitian',brief:'Pilih warna. Warnai kotak seperti contoh. Kotak kosong tidak perlu diwarnai.',level:Math.floor(i/20),theme:i%20,artName,icon,n:rows.length,palette:palette.split('').map(k=>({key:k,name:colors[k][0],hex:colors[k][1]})),target:rows.join('').split('').map(k=>k==='.'?-1:palette.indexOf(k))};};
 const baseMake=KK.make,baseValidate=KK.validate,baseSolution=KK.solution,baseDescribe=KK.describe;
 KK.types.push({id:'pixel',name:'Piksel Ajaib',icon:'🎨',brief:'Warnai kotak seperti gambar contoh.',skill:'Pola & koordinat',goal:'Anak mencocokkan posisi dan warna untuk membentuk objek.',off:'Susun gambar dari kotak kertas berwarna.',reflect:'Bagian mana yang kamu warnai lebih dulu?'});
 KK.make=id=>indices.has(id)?make(indices.get(id)):baseMake(id);
 KK.validate=(m,a)=>m.type==='pixel'?Array.isArray(a)&&a.length===m.target.length&&a.every((v,i)=>v===m.target[i]):baseValidate(m,a);
 KK.solution=m=>m.type==='pixel'?[...m.target]:baseSolution(m);
 KK.describe=m=>m.type==='pixel'?`${m.artName}: ${m.n} × ${m.n} kotak, ${m.palette.length} warna. Tiru letak warna; sisakan latar kosong.`:baseDescribe(m);
 return {count:levels.length,ids:Object.freeze(ids)};
})();
function pixelPicture(m){return `<svg class="pixel-picture" viewBox="0 0 ${m.n} ${m.n}" role="img" aria-label="${m.artName}" shape-rendering="crispEdges">${m.target.map((v,i)=>v<0?'':`<rect x="${i%m.n}" y="${Math.floor(i/m.n)}" width="1" height="1" fill="${m.palette[v].hex}"/>`).join('')}</svg>`;}
function pixelBoard(){
 const cell=(v,i,example=false)=>{const color=v<0?null:m.palette[v],label=`Baris ${Math.floor(i/m.n)+1}, kolom ${i%m.n+1}: ${color?color.name:'kosong'}`;return example?`<span class="pixel-cell ${v<0?'pixel-blank':''}" style="--paint:${color?.hex||'#edf2f7'}" role="img" aria-label="${label}">${v<0?'':v+1}</span>`:`<button class="pixel-cell ${v<0?'pixel-blank':''}" data-action="paintPixel" data-value="${i}" style="--paint:${color?.hex||'#edf2f7'}" aria-label="${label}">${v<0?'':v+1}</button>`;};
 return `<div class="pixel-title">${pixelPicture(m)}<div><h2>${m.icon} ${m.artName}</h2><span>${m.n} × ${m.n} kotak · ${m.palette.length} warna</span></div></div><div class="pixel-workspace"><section class="pixel-panel pixel-example"><h3>👀 Contoh</h3><div class="pixel-grid" style="--pixel-n:${m.n}" aria-label="Gambar contoh ${m.artName}">${m.target.map((v,i)=>cell(v,i,true)).join('')}</div></section><section class="pixel-panel"><h3>🖌️ Gambarmu</h3><div class="pixel-grid pixel-canvas" style="--pixel-n:${m.n}" aria-label="Papan mewarnai">${state.answer.map((v,i)=>cell(v,i)).join('')}</div></section></div><div class="pixel-tools" aria-label="Pilih warna">${m.palette.map((c,i)=>btn('pixelColor',i,`<span style="background:${c.hex}" aria-hidden="true">${i+1}</span><small>${c.name}</small>`,`pixel-swatch ${state.paint===i?'selected':''}`,`Pakai warna ${c.name}`).replace('<button ',`<button aria-pressed="${state.paint===i}" `)).join('')}${btn('pixelColor',-1,'<span aria-hidden="true">🧽</span><small>Penghapus</small>',`pixel-swatch ${state.paint===-1?'selected':''}`,'Pakai penghapus').replace('<button ',`<button aria-pressed="${state.paint===-1}" `)}${btn('pixelUndo','','↶<small>Urungkan</small>','pixel-undo','Urungkan sapuan terakhir')}</div><p class="pixel-help">Ketuk atau usap kotaknya. Angka membantu mencocokkan warna.</p>`;
}
function pixelClue(){const i=m.target.findIndex((v,i)=>state.answer[i]!==v);if(i<0)return 'Gambarmu sudah sama!';const row=Math.floor(i/m.n)+1,col=i%m.n+1;return `Coba lihat baris ${row}, kotak ke-${col} dari kiri. Bandingkan dengan contoh: apakah warnanya sama, atau perlu dibiarkan kosong?`;}
let pixelStroke=null;
function paintPixel(i,remember=true){if(!m||m.type!=='pixel'||state.busy||!Number.isInteger(i)||i<0||i>=state.answer.length||state.answer[i]===state.paint)return false;if(remember){state.paintHistory.push([...state.answer]);if(state.paintHistory.length>30)state.paintHistory.shift();}state.answer[i]=state.paint;GameSFX.play('tap');renderGame();return true;}
function pixelAction(a,v){if(m.type!=='pixel')return false;if(a==='pixelColor'){pixelStroke=null;state.paint=+v;renderGame();return true;}if(a==='paintPixel'){paintPixel(+v);return true;}if(a==='pixelUndo'){pixelStroke=null;if(state.paintHistory.length){state.answer=state.paintHistory.pop();renderGame();}return true;}return false;}
document.addEventListener('pointerdown',e=>{const cell=e.target.closest('[data-action="paintPixel"]');if(!cell||!m||m.type!=='pixel'||state.busy||e.button!==0||!e.isPrimary)return;pixelStroke={id:e.pointerId,epoch,remembered:false};if(paintPixel(+cell.dataset.value))pixelStroke.remembered=true;});
document.addEventListener('pointermove',e=>{if(!pixelStroke||pixelStroke.id!==e.pointerId)return;if(pixelStroke.epoch!==epoch||m?.type!=='pixel'){pixelStroke=null;return;}e.preventDefault();const cell=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-action="paintPixel"]');if(cell&&paintPixel(+cell.dataset.value,!pixelStroke.remembered))pixelStroke.remembered=true;},{passive:false});
document.addEventListener('pointerup',()=>{pixelStroke=null;});
document.addEventListener('pointercancel',()=>{pixelStroke=null;});
window.addEventListener('blur',()=>{pixelStroke=null;});
