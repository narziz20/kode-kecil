const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
function engine(){const ctx=vm.createContext({});for(const f of ['engine.js','lessons.js'])vm.runInContext(fs.readFileSync('dist/'+f,'utf8'),ctx);return ctx.KK;}
const E=engine(),seen=new Map(),stories=new Set();
function signature(m){if(m.id<1000)return E.challengeKey(m);return JSON.stringify(m.type==='cause'?{type:m.type,questions:m.questions}:{type:m.type,items:m.items,tiles:m.tiles});}
for(let id=0;id<1045;id++){
 const m=E.make(id),key=signature(m);
 assert(!seen.has(key),`Identical playable challenge: ${id} and ${seen.get(key)}`);seen.set(key,id);
 assert(E.validate(m,E.solution(m)),`Unsolvable mission ${id}`);
 assert.equal(signature(E.make(id)),key,'Replay must preserve its challenge');
 if(m.type==='sequence'||m.type==='debug'){
  assert(!stories.has(m.story),'Story must not be reused in another stage');stories.add(m.story);
  assert(!E.validate(m,m.tiles),'Story must begin with an actual error');
  assert.equal(m.items.length,m.solution.length);
 }
}
// Generation order and callers mutating a returned mission cannot alter later content.
const fresh=engine();fresh.make(999);for(const id of [999,6,7,207,407,1003,1015,1044])assert.equal(signature(fresh.make(id)),signature(E.make(id)));
const before=signature(E.make(7));E.make(7).target[0]='invalid';assert.equal(signature(E.make(7)),before);
assert.equal(stories.size,30);assert.equal(seen.size,1045);
console.log('PASS: 1,045 distinct playable challenges ignoring IDs/themes/level labels; 30 different stories; solvability, deterministic replay, call-order independence, and cache isolation.');
