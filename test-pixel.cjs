const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx=vm.createContext({document:{addEventListener(){}},window:{addEventListener(){}}});
for(const file of ['engine','lessons','pixel-data','pixel'])vm.runInContext(fs.readFileSync(`dist/${file}.js`,'utf8'),ctx);
const E=ctx.KK,shapes=new Set(),names=new Set(),tiers=[0,0,0,0,0];
const ids=Array.from(vm.runInContext('PixelArt.ids',ctx));assert.equal(ids.length,100);assert.equal(new Set(ids).size,100);
for(const id of ids){
 const m=E.make(id);tiers[m.level]++;assert.equal(m.target.length,m.n*m.n,`${m.artName}: square grid`);assert.equal(m.n,6+m.level*2);assert(m.palette.length>=1&&m.palette.length<=8);
 assert(m.target.every(v=>Number.isInteger(v)&&v>=-1&&v<m.palette.length));assert.equal(new Set(m.target.filter(v=>v>=0)).size,m.palette.length,`${m.artName}: every palette color appears`);
 const silhouette=m.n+':'+m.target.map(v=>v<0?'.':'#').join('');assert(!shapes.has(silhouette),`${m.artName}: no reused silhouette`);shapes.add(silhouette);assert(!names.has(m.artName));names.add(m.artName);
 const answer=E.solution(m);assert(E.validate(m,answer));answer[0]=answer[0]===-1?0:-1;assert(!E.validate(m,answer));assert(!E.validate(m,Array(m.target.length).fill(-1)));assert.deepEqual(E.make(id),m);
}
assert.deepEqual(tiers,[20,20,20,20,20]);
const old=['Hati Sayang','Jamur Mini','Ikan Kecil','Pohon Apel','Gunung Salju','Bunga Mekar','Burung Merah','Kura-kura','Kucing Manis','Paus Ceria','Kupu-kupu Pelangi','Macan Belang','Dino Sahabat','Roket Bintang','Planet Bercincin'];
old.forEach((name,i)=>assert.equal(E.make(1045+i).artName,name));
for(let id=1045;id<1145;id++)assert(ids.includes(id));
assert.equal(ids[19],1076);assert.equal(ids[20],1048);
console.log('PASS: 100 unique pixel subjects/silhouettes; 20 per tier; 6–14 grids; valid palettes; exact solutions; deterministic replay; original subject IDs preserved.');
