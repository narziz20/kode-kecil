const E=require('./dist/engine.js');const assert=require('node:assert/strict');
let counts={};const signatures=new Set();
for(let id=0;id<1000;id++){
 const m=E.make(id),s=E.solution(m);assert.equal(E.validate(m,s),true,`Mission ${id+1} must be solvable`);assert.deepEqual(m,E.make(id),'Generation must be stable');counts[m.type]=(counts[m.type]||0)+1;
 const signature=JSON.stringify({...m,id:undefined});assert(!signatures.has(signature),`Duplicate mission content ${id+1}`);signatures.add(signature);
 if(m.type==='matrix'){assert.equal(E.solveMatrix(m.clues,m.n).count,1,`Mission ${id+1}: unique matrix`);const wrong=[...s];wrong[m.clues.indexOf(-1)]=(wrong[m.clues.indexOf(-1)]+1)%m.n;assert(!E.validate(m,wrong));}
 if(m.type==='detective'){assert.equal(m.cards.filter((_,i)=>E.validate(m,i)).length,1,'Exactly one suspect');assert(!E.validate(m,-1));}
 if(m.type==='memory'){assert.equal(new Set(m.cards.map(E.cardKey)).size,m.pairs);assert(m.cards.every(c=>m.cards.filter(d=>E.cardKey(d)===E.cardKey(c)).length===2));assert(!E.validate(m,m.cards.map(()=>false)));}
 if(m.type==='mosaic')assert(!E.validate(m,m.tiles));
 if(m.type==='sort'){assert(!E.validate(m,m.cards.map(()=>-1)));assert.equal(new Set(m.answers).size,m.bins.length,'Every sorting category should have a card');}
 if(m.type==='pattern'){assert(!E.validate(m,m.blanks.map(()=>null)));assert(s.every(c=>m.choices.some(p=>E.cardKey(p)===E.cardKey(c))));}
 if(m.type==='route'){assert(!E.validate(m,[]));assert(m.stars.every(s=>!m.walls.includes(s.join(','))));assert(!E.validate(m,[{type:'L'}]));}
 if(m.type==='packing')assert(!E.validate(m,m.cards.map(()=>-1)));
 if(m.type==='factory'||m.type==='music'){assert(!E.validate(m,[]));if(m.require.length){const expanded=E.flatten(s).map(type=>({type}));if(m.require.includes('repeat')||m.require.includes('function'))assert(!E.validate(m,expanded),'Required concept cannot be bypassed with flat steps');}}
}
assert(Object.values(counts).every(n=>n===100));assert.throws(()=>E.make(-1));assert.throws(()=>E.make(1000));assert.throws(()=>E.make(1.5));
const s={o:1,c:1,big:false,badge:false};assert.deepEqual(E.transform(s,'if'),s,'Conditional false branch leaves state unchanged');assert.equal(E.transform({...s,c:0},'if').c,2);assert.equal(E.transform({...s,c:3},'color').c,0);
console.log('PASS: 1,000 stable, distinct, solvable missions; 100 per game; unique logic grids/suspects; invalid answers rejected; conditional branches; required loops/functions.');
