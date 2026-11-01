const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let reduced=false,onPreference;const media={get matches(){return reduced;},addEventListener(_,f){onPreference=f;}};
const ctx=vm.createContext({window:{matchMedia:()=>media,addEventListener(){}},state:{answer:[0,1],program:[],matched:[],flipped:[],outputs:[]},m:{type:'mosaic'}});
vm.runInContext(fs.readFileSync('dist/motion.js','utf8'),ctx);const M=vm.runInContext('GameMotion',ctx);
function element(k,x,y=0){return{dataset:{motion:k},style:{},classList:{contains:c=>k.startsWith('code-')&&c==='token',remove(){},add(){}},box:{left:x,top:y,width:60,height:60},getBoundingClientRect(){return this.box;},animations:[],animate(frames,options){const a={frames,options,cancel(){this.cancelled=true;this.oncancel?.();}};this.animations.push(a);return a;},remove(){this.removed=true;}};}
function board(els,id='1'){return{dataset:{motionMission:id},querySelectorAll:s=>s==='[data-motion]'?els:[]};}
let old=[element('tile-0',0),element('tile-1',70)];let snapshot=M.capture(board(old),1);let fresh=[element('tile-0',70),element('tile-1',0)];M.finish(board(fresh),snapshot,1);
assert.match(fresh[0].animations[0].frames[0].transform,/translate\(-70px,0px\)/);assert.match(fresh[1].animations[0].frames[0].transform,/translate\(70px,0px\)/);
// A rapid next move begins at the rendered position, not the previous target.
fresh[0].box.left=30;snapshot=M.capture(board(fresh),1);assert(fresh[0].animations[0].cancelled);const next=element('tile-0',0);M.finish(board([next]),snapshot,1);assert.match(next.animations[0].frames[0].transform,/translate\(30px,0px\)/);
const piece={type:'U'};assert.equal(M.key(piece),M.key(piece));assert.notEqual(M.key(piece),M.key({type:'U'}));
M.seed('pattern-0',{left:200,top:40,width:100,height:100});snapshot=M.capture(board([]),1);const slot=element('pattern-0',20,100);M.finish(board([slot]),snapshot,1);assert.match(slot.animations[0].frames[0].transform,/translate\(200px,-40px\)/);
const robot=element('bimo',0,0);snapshot=M.capture(board([element('bimo',0,70)]),1);M.finish(board([robot]),snapshot,1);assert.equal(robot.animations[0].options.duration,410);assert.equal(robot.animations[0].frames.length,4);
const back=element('memory-0',0);back.dataset.face='back';const front=element('memory-0',0);front.dataset.face='front';M.finish(board([front]),M.capture(board([back]),1),1);assert.match(front.animations[0].frames[0].transform,/rotateY/);
const unchanged=element('memory-0',0);unchanged.dataset.face='front';M.finish(board([unchanged]),M.capture(board([front]),1),1);assert.equal(unchanged.animations.length,0);
const ghost=element('ghost',200);M.returnGhost(ghost,element('source',0));assert.equal(ghost.animations.length,1);M.clear();assert(ghost.removed);
reduced=true;onPreference();const still=element('tile-0',90);M.seed('tile-0',{left:0,top:0,width:60,height:60});M.finish(board([still]),M.capture(board([]),1),1);assert.equal(still.animations.length,0);const quietGhost=element('ghost',100);M.returnGhost(quietGhost,element('source',0));assert(quietGhost.removed);
reduced=false;snapshot=M.capture(board([element('tile-0',0)],'old-mission'),2);assert.equal(snapshot.size,0);
console.log('PASS: spatial swaps, interrupted motion continuity, stable code identities, pointer-release landing, walking arc, memory flips only on changes, reset cleanup, reduced-motion and cross-mission isolation.');
