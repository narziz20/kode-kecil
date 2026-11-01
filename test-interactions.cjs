const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const listeners={};
const el=()=>({open:false,showModal(){this.open=true;},close(){this.open=false;},focus(){},removeAttribute(){},innerHTML:'',textContent:'',disabled:false,dataset:{},classList:{add(){},remove(){},toggle(){}},querySelectorAll:()=>[],insertAdjacentHTML(){},addEventListener(){},setAttribute(){},scrollIntoView(){}});
const elements=new Map();
const document={body:{dataset:{},style:{setProperty(){},removeProperty(){}}},querySelector(s){if(!elements.has(s))elements.set(s,el());return elements.get(s)},querySelectorAll:()=>[],addEventListener(k,f){(listeners[k]??=[]).push(f)}};
const ctx=vm.createContext({document,window:{addEventListener(){},scrollTo(){}},localStorage:{getItem(){},setItem(){}},structuredClone,console,setTimeout,clearTimeout,requestAnimationFrame:()=>1,cancelAnimationFrame(){},Date});
for(const file of ['engine.js','interactions.js','playful.js','voice.js','world-themes.js','app.js'])vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),ctx);
const run=s=>vm.runInContext(s,ctx),open=id=>run(`dialog.close();openMission(${id})`);
const drop=(kind,value,type,index)=>run(`applyDrop(${JSON.stringify(kind)},${JSON.stringify(String(value))},{dataset:{dropKind:${JSON.stringify(type)},value:${JSON.stringify(String(index))}${type==='program'&&index!==undefined?',index:'+JSON.stringify(String(index)):''}}})`);
for(let level=0;level<5;level++)for(let type=0;type<10;type++)open(level*200+type);
open(1);assert(drop('sort',0,'sort',1));assert.equal(run('state.answer[0]'),1);assert(drop('sort',0,'sort',0));assert.equal(run('state.answer[0]'),0);
assert.equal(drop('sort',1,'packing',0),false);assert.equal(run('state.answer[1]'),-1);
open(9);drop('packing',0,'packing',0);assert.equal(run('state.answer[0]'),0);run("action('provision','0')");assert.equal(run('state.answer[0]'),-1);
open(2);drop('pattern',0,'pattern',0);assert.equal(run('E.cardKey(state.answer[0])'),run('E.cardKey(m.choices[0])'));assert.equal(run('state.selection'),null);
open(4);const blank=run('m.clues.indexOf(-1)'),fixed=run('m.clues.findIndex(v=>v>=0)');drop('matrix',0,'matrix',blank);assert.equal(run(`state.answer[${blank}]`),0);assert.equal(drop('matrix',1,'matrix',fixed),false);
open(3);const before=run('JSON.stringify(state.answer)');drop('mosaic',0,'mosaic',1);assert.equal(run('state.answer[0]'),JSON.parse(before)[1]);drop('mosaic',0,'mosaic',1);assert.equal(run('JSON.stringify(state.answer)'),before);
for(const id of [5,6,7]){open(id);const cmds=id===5?['color','size']:id===6?['R','D']:['0','1'];drop('command',cmds[0],'program');drop('command',cmds[1],'program',0);assert.equal(run('state.program[0].type'),cmds[1]);drop('reorder',0,'program');assert.equal(run('state.program[1].type'),cmds[1]);assert.equal(run('state.program.length'),2);run('state.busy=true');assert.equal(drop('command',cmds[0],'program'),false);}
open(6);run("state.program=Array.from({length:30},()=>({type:'R'}))");assert.equal(drop('command','D','program'),false);assert.equal(run('state.program.length'),30);
open(607);run("state.program=[{type:'repeat',count:2,body:[{type:'0'}]},{type:'function',body:[{type:'1'}]}]");const group=run('JSON.stringify(state.program[0])');drop('reorder',0,'program');assert.equal(run('JSON.stringify(state.program[1])'),group);
// A cancelled gesture and navigation must never leave a floating card or mutate answers.
run("dragging={source:{classList:{remove(){}}},ghost:{remove(){}},frame:1};cancelDrag()");assert.equal(run('dragging'),null);open(1);run("action('select','0');action('bin','1')");assert.equal(run('state.answer[0]'),1);run("action('reset')");assert.equal(run('state.answer[0]'),-1);
console.log('PASS: 50 mission screens; all drop types; reassignment; invalid targets; fixed clues; command insertion/reordering; nested blocks; busy/length guards; reset; cancellation; tap fallback.');
// Hints must work for every generated activity and never silently fill in answers.
for(let id=0;id<1000;id++){
  open(id);assert.equal(document.body.dataset.world,run('theme().slug'));
  const before=run('JSON.stringify({answer:state.answer,program:state.program})');
  const detail=run('diagnoseAttempt()');assert.equal(typeof detail.text,'string');assert(detail.text.length>0);
  run('showThinking(true);hint();hint();hint()');
  assert.equal(run('state.clueStep'),2);
  assert.equal(run('JSON.stringify({answer:state.answer,program:state.program})'),before,`Hint changed mission ${id}`);
}
open(9);run('state.answer=state.answer.map(()=>0)');assert.match(run('diagnoseAttempt().text'),/kelebihan/);
run('state.answer=state.answer.map(()=>-1)');assert.match(run('diagnoseAttempt().text'),/kurang/);
run("playfulAction('countDots')");assert.equal(run('state.dotCount'),0);
run('state.answer[0]=0');run("playfulAction('countDots')");assert.equal(run('state.dotCount'),1);
run("action('reset')");assert.equal(run('state.dotCount||0'),0);
open(8);run("playfulAction('crossMode');playfulAction('suspect','0')");assert.equal(run('state.crossed.includes(0)'),true);assert.equal(run('state.answer'),null);
run("playfulAction('suspect','0')");assert.equal(run('state.crossed.includes(0)'),false);
run("playfulAction('suspect','0');playfulAction('crossMode');action('suspect','0')");assert.equal(run('state.answer'),0);assert.equal(run('state.crossed.includes(0)'),false);
run('state.answer=m.cards.findIndex(c=>!m.rules.every(r=>E.matches(c,r)))');assert.match(run('diagnoseAttempt().text'),/petunjuk \d/);
open(6);run("state.program=[{type:'L'}]");assert.match(run('diagnoseAttempt().text'),/langkah|bintang|bendera/);
open(4);run('state.answer=state.answer.map(()=>0)');assert.match(run('diagnoseAttempt().text'),/kembar/);
open(7);run("state.program=[{type:'0'}];playfulAction('audition','1')");assert.equal(run('JSON.stringify(state.program)'), '[{"type":"0"}]');
console.log('PASS: contextual hints for 1,000 missions, bounded hint stages, no answer mutation, too much/too little packing, counter reset, reversible detective elimination, rule mismatch, grid duplicates, and independent instrument preview.');
open(609);run('state.answer[0]=0;state.answer[1]=1');run("playfulAction('countDots','0');playfulAction('countDots','1')");assert.equal(run('state.countBag'),1);assert.equal(run('state.dotCount'),1);assert.match(elements.get('#countingDots').textContent,/Tas 2:/);
for(let world=0;world<20;world++){run(`chapter(${world})`);assert.equal(document.body.dataset.world,run(`E.themes[${world}].slug`));run('home()');assert.equal(document.body.dataset.world,undefined);}
ctx.setTimeout=f=>{f();return 0;};
(async()=>{
  open(6);run("state.program=[{type:'L'}]");await run('check()');assert.match(elements.get('#status').textContent,/Belum pas/);assert.equal(run('state.busy'),false);assert.match(elements.get('#dialog').innerHTML,/Coba lagi/);assert.equal(elements.get('#dialog').open,true);
  open(7);run("state.program=[{type:String((+m.target[0]+1)%4)}]");await run('check()');assert.match(elements.get('#status').textContent,/bunyi nomor 1/);assert.equal(run('state.busy'),false);
  open(1);await run('check()');assert.match(elements.get('#status').textContent,/belum punya rumah/);
  run("playfulAction('tryAgain');action('select','0');action('bin','0')");assert.equal(elements.get('#dialog').open,false);assert.equal(elements.get('#coach').innerHTML,'');
  open(0);run('state.testOther=m.cards.findIndex(c=>c.pair!==m.cards[0].pair)');await run('memory(0)');await run('memory(state.testOther)');assert.equal(elements.get('#dialog').open,true);assert.equal(run('state.busy'),false);assert.equal(run('state.flipped.length'),0);
  run('hint()');assert.equal(elements.get('#dialog').open,true);assert.match(elements.get('#dialog').innerHTML,/Coba pikirkan/);run("playfulAction('tryAgain')");assert.equal(elements.get('#dialog').open,false);
  open(6);await run('check()');assert.equal(elements.get('#dialog').open,true);assert.match(elements.get('#dialog').innerHTML,/masih kosong/);run('hint()');assert.match(elements.get('#dialog').innerHTML,/masih kosong/);
  console.log('PASS: per-bag counting, blocked route and wrong music feedback after playback, unfinished sorting feedback, and clearing stale clues after edits.');
})().catch(e=>{console.error(e);process.exitCode=1;});
