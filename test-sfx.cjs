const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('dist/app.js','utf8').split('const GameSFX=')[1].split('function playNote(')[0];
const nodes=[];let creations=0,resumes=0;
class AudioContext{
 constructor(){creations++;this.currentTime=0;this.state='suspended';this.destination={};}
 resume(){resumes++;this.state='running';return Promise.resolve();}
 createOscillator(){const n={frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){this.disconnected=true;},start(t){this.started=t;},stop(t){this.stopped=t??true;}};nodes.push(n);return n;}
 createGain(){return {gain:{setValueAtTime(){},exponentialRampToValueAtTime(v){assert(v>0&&v<=.045);}},connect(){},disconnect(){}};}
}
const ctx=vm.createContext({window:{AudioContext},sound:false,audioCtx:null});vm.runInContext('const GameSFX='+source,ctx);
const run=s=>vm.runInContext(s,ctx);
run("GameSFX.play('success')");assert.equal(creations,0,'muted playback must not initialize audio');
run("sound=true;GameSFX.play('tap')");assert.equal(nodes.length,1);assert.equal(resumes,1);
run("GameSFX.play('tap')");assert.equal(nodes.length,1,'rapid taps should be throttled');
run("audioCtx.currentTime=1;GameSFX.play('magic')");assert.equal(nodes.length,4);assert(nodes[3].started>nodes[1].started);
run("GameSFX.play('success')");assert(nodes.slice(0,4).every(n=>n.disconnected),'reward should clear overlapping sounds');
run('GameSFX.stop()');assert(nodes.every(n=>n.disconnected),'stop must clean every scheduled oscillator');
const count=nodes.length;run("sound=false;GameSFX.play('drop')");assert.equal(nodes.length,count);
run("sound=true;audioCtx=null;window.AudioContext=undefined;GameSFX.play('tap')");assert.equal(nodes.length,count);
console.log('PASS: mute, gesture audio resume, tap throttling, gentle gain limits, staggered magic, reward overlap cleanup, immediate stop, unsupported audio fallback.');
