const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx=vm.createContext({document:{addEventListener(){}},window:{addEventListener(){}}});
for(const file of ['engine','lessons','pixel'])vm.runInContext(fs.readFileSync(`dist/${file}.js`,'utf8'),ctx);
const E=ctx.KK,shapes=new Set(),names=new Set();let previousSize=0,previousColors=0;
for(let id=1045;id<1060;id++){
 const m=E.make(id);assert.equal(m.target.length,m.n*m.n,`${m.artName}: square grid`);assert(m.n>=previousSize);assert(m.palette.length>=previousColors);previousSize=m.n;previousColors=m.palette.length;
 assert(m.target.every(v=>Number.isInteger(v)&&v>=-1&&v<m.palette.length));assert.equal(new Set(m.target.filter(v=>v>=0)).size,m.palette.length,`${m.artName}: every palette color appears`);
 const silhouette=m.n+':'+m.target.map(v=>v<0?'.':'#').join('');assert(!shapes.has(silhouette),'No reused silhouettes');shapes.add(silhouette);assert(!names.has(m.artName));names.add(m.artName);
 const answer=E.solution(m);assert(E.validate(m,answer));answer[0]=answer[0]===-1?0:-1;assert(!E.validate(m,answer));assert(!E.validate(m,Array(m.target.length).fill(-1)));assert.deepEqual(E.make(id),m);
}
assert.equal(E.make(1045).n,4);assert.equal(E.make(1045).palette.length,2);assert.equal(E.make(1059).n,10);assert.equal(E.make(1059).palette.length,6);
console.log('PASS: 15 unique pixel subjects and silhouettes, progressive grid/color counts, valid palettes, exact solutions, blank and incorrect rejection, deterministic replay.');
