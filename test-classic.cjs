const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const el=()=>({innerHTML:'',textContent:'',disabled:false,open:false,querySelector:()=>el(),querySelectorAll:()=>[],setAttribute(){},showModal(){this.open=true},close(){this.open=false}});const elements=new Map();const document={querySelector(s){if(!elements.has(s))elements.set(s,el());return elements.get(s)}};const saved=new Map();const ctx=vm.createContext({document,window:{scrollTo(){}},localStorage:{getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)},structuredClone,console,setTimeout:f=>{f();},Blob,URL});
vm.runInContext(fs.readFileSync('dist/classic/lessons.js','utf8')+'\n'+fs.readFileSync('dist/classic/app.js','utf8'),ctx);
(async()=>{assert.equal(vm.runInContext('lessons.length',ctx),40);for(let i=0;i<40;i++){
vm.runInContext(`openLesson(${i}); program=[]; for(let i=0;i<lesson.path.length;i++){program.push({type:lesson.path[i]});if(lesson.stars.some(s=>eq(s,lesson.route[i+1])))program.push({type:'C'});} if(lesson.require==='repeat'){let unit=lesson.path.startsWith('RR')||lesson.path.startsWith('UU')?1:2;program=[{type:'repeat',count:lesson.path.length/unit,body:[...lesson.path.slice(0,unit)].map(type=>({type}))}];}if(lesson.require==='function')program=[{type:'function',body:program}];`,ctx);
await vm.runInContext('run()',ctx);assert.equal(vm.runInContext(`done.includes(${i})`,ctx),true,`Lesson ${i+1} unsolved`);
}
assert.equal(JSON.parse(saved.get('kode-kecil-v1')).length,40);
vm.runInContext("openLesson(0); program=[{type:'L'}]",ctx);await vm.runInContext('run()',ctx);assert.match(elements.get('#status').textContent,/di luar jalan/);
vm.runInContext("openLesson(25); program=[{type:'R'},{type:'R'}]",ctx);await vm.runInContext('run()',ctx);assert.match(elements.get('#status').textContent,/tertinggal/);
vm.runInContext("openLesson(20); program=[{type:'R'},{type:'R'},{type:'R'}]",ctx);await vm.runInContext('run()',ctx);assert.match(elements.get('#status').textContent,/kotak Ulang/);
vm.runInContext("openLesson(30); program=[{type:'R'},{type:'C'},{type:'R'}]",ctx);await vm.runInContext('run()',ctx);assert.match(elements.get('#status').textContent,/jadi Jurus/);
vm.runInContext("openLesson(25); program=[{type:'C'},{type:'R'},{type:'C'},{type:'R'}]",ctx);await vm.runInContext('run()',ctx);assert.match(elements.get('#status').textContent,/Hore/);
console.log('PASS: 40 missions solvable; persistence; off-path rejection; missing-star rejection; repeat/function requirements; conditional no-op.');
})().catch(e=>{console.error(e);process.exitCode=1});
