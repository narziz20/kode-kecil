const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const E=require('./dist/engine.js');const vars=new Map(),body={dataset:{},style:{setProperty:(k,v)=>vars.set(k,v),removeProperty:k=>vars.delete(k)}};
const ctx=vm.createContext({document:{body}});vm.runInContext(fs.readFileSync('dist/world-themes.js','utf8'),ctx);
const run=s=>vm.runInContext(s,ctx),scenes=new Set();
function luminance(hex){const c=hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;}
for(const w of E.themes){
 const slug=JSON.stringify(w.slug);assert(run(`!!worldLooks[${slug}]`));
 run(`applyWorldTheme(${slug})`);assert.equal(body.dataset.world,w.slug);
 const scene=run(`worldScene(${slug})`);assert(!scenes.has(scene));scenes.add(scene);assert(scene.includes('aria-hidden="true"'));assert(!scene.includes('undefined'));assert(!scene.includes('NaN'));
 const url=vars.get('--world-backdrop');assert(url.startsWith('url("data:image/svg+xml,'));
 assert((1.05)/(luminance(vars.get('--green'))+.05)>=4.5,`${w.slug}: primary button text contrast`);
 assert(!vars.has('--card-color'),'Scenery must never override answer colors');
}
assert.equal(scenes.size,20);run('applyWorldTheme()');assert.equal(body.dataset.world,undefined);assert.equal(vars.size,0);
run("applyWorldTheme('laut');applyWorldTheme('unknown')");assert.equal(vars.size,0);
console.log('PASS: 20 distinct scenes, complete world mapping, palette reset, unchanged card colors, and 4.5:1 primary button text contrast.');
