'use strict';
// Visual motion never owns game state. Answers update immediately, even with motion disabled.
const GameMotion=(()=>{
  const active=new Map(),ghosts=new Set(),ids=new WeakMap();let serial=0,seeds=new Map();
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const enabled=()=>!reduced?.matches;
  const key=object=>{if(!ids.has(object))ids.set(object,++serial);return 'code-'+ids.get(object);};
  const rect=el=>{const r=el?.getBoundingClientRect?.();return r&&r.width>0&&r.height>0?{left:r.left,top:r.top,width:r.width,height:r.height}:null;};
  function animate(el,frames,options){
    active.get(el)?.cancel();active.delete(el);
    if(!el?.animate||!enabled())return null;
    const animation=el.animate(frames,{duration:280,easing:'cubic-bezier(.22,.8,.25,1)',...options});
    active.set(el,animation);
    const finish=()=>{if(active.get(el)===animation)active.delete(el);};
    animation.onfinish=finish;animation.oncancel=finish;return animation;
  }
  function seed(k,r){if(r)seeds.set(k,{rect:r});}
  function capture(game,mission){
    const before=new Map();
    if(game.dataset.motionMission===String(mission)&&enabled())game.querySelectorAll('[data-motion]').forEach(el=>{
      const r=rect(el);if(r)before.set(el.dataset.motion,{rect:r,face:el.dataset.face,content:el.dataset.content});
    });
    // Capture the current in-flight position before cancelling old animations.
    clearAnimations();for(const [k,v] of seeds)before.set(k,v);seeds.clear();return before;
  }
  function clearAnimations(){for(const a of active.values())a.cancel();active.clear();}
  function clear(){clearAnimations();seeds.clear();for(const ghost of ghosts)ghost.remove();ghosts.clear();}
  function move(el,from,robot=false){
    const to=rect(el);if(!from||!to)return;
    const dx=from.left+from.width/2-to.left-to.width/2,dy=from.top+from.height/2-to.top-to.height/2,sx=from.width/to.width,sy=from.height/to.height;
    if(Math.abs(dx)+Math.abs(dy)<1&&Math.abs(sx-1)+Math.abs(sy-1)<.04)return;
    const start=`translate(${dx}px,${dy}px) scale(${sx},${sy})`;
    animate(el,robot?[
      {transform:start,offset:0},{transform:`translate(${dx*.5}px,${dy*.5-5}px) rotate(${dx>0?-3:3}deg)`,offset:.52},
      {transform:'translate(0,0) scale(1.04,.96)',offset:.88},{transform:'none',offset:1}
    ]:[{transform:start},{transform:'none'}],{duration:robot?410:300});
  }
  function bind(game){
    const mark=(selector,fn)=>game.querySelectorAll(selector).forEach((el,i)=>{el.dataset.motion=fn(el,i);});
    mark('.sort-card',el=>'placed-sort-'+el.dataset.cardIndex);
    mark('.story-tile',(el,i)=>'story-'+state.answer[i]);
    mark('.puzzle-tile',(el,i)=>'tile-'+state.answer[i]);
    mark('.token',(el,i)=>key(state.program[i]));
    mark('.bag-icon',(el,i)=>{el.dataset.content=JSON.stringify(state.answer.map((v,k)=>v===i?k:-1));return 'bag-icon-'+i;});
    mark('.route-avatar',()=> 'bimo');
    mark('.memory-tile',(el,i)=>{el.dataset.face=state.matched[i]?'matched':state.flipped.includes(i)?'front':'back';return 'memory-'+i;});
    mark('.machine-output .picture-card',(el,i)=>{el.dataset.content=JSON.stringify(state.outputs[i]);return 'output-'+i;});
    mark('.train-car.missing',el=>'pattern-'+el.dataset.value);
    mark('.matrix-cell',el=>'matrix-'+el.dataset.value);
    mark('.placed-items [data-card-index]',el=>'placed-'+m.type+'-'+el.dataset.cardIndex);
  }
  function finish(game,before,mission){
    game.dataset.motionMission=String(mission);bind(game);if(!enabled()||!before.size)return;
    game.querySelectorAll('[data-motion]').forEach(el=>{
      const old=before.get(el.dataset.motion);
      if(old){
        move(el,old.rect,el.dataset.motion==='bimo');
        if(old.face&&old.face!==el.dataset.face){
          animate(el,el.dataset.face==='matched'?[{transform:'scale(1)'},{transform:'scale(1.06)',offset:.5},{transform:'scale(1)'}]:[{transform:'perspective(700px) rotateY(-85deg)',opacity:.6},{transform:'perspective(700px) rotateY(0)',opacity:1}],{duration:el.dataset.face==='matched'?260:230});
        }else if(old.content&&old.content!==el.dataset.content){
          animate(el,[{transform:'scale(.94)',opacity:.6},{transform:'scale(1)',opacity:1}],{duration:250});
        }
      }else if(el.classList.contains('token'))animate(el,[{transform:'translateY(-14px) scale(.9)',opacity:0},{transform:'none',opacity:1}],{duration:230});
    });
  }
  function settle(el){animate(el,[{transform:'scale(1)'},{transform:'scale(1.025,.98)',offset:.45},{transform:'scale(1)'}],{duration:210});}
  function returnGhost(ghost,source){
    if(!ghost)return;const from=rect(ghost),to=rect(source);
    if(!enabled()||!from||!to||!ghost.animate){ghost.remove();return;}
    ghosts.add(ghost);ghost.classList.remove('drag-ghost');ghost.classList.add('returning-card');
    Object.assign(ghost.style,{left:from.left+'px',top:from.top+'px',width:from.width+'px',height:from.height+'px',transform:'none'});
    const a=animate(ghost,[{transform:'translate(0,0)',opacity:.95},{transform:`translate(${to.left-from.left}px,${to.top-from.top}px) scale(${to.width/from.width},${to.height/from.height})`,opacity:0}],{duration:220});
    const cleanup=()=>{active.delete(ghost);ghosts.delete(ghost);ghost.remove();};if(a){a.onfinish=cleanup;a.oncancel=cleanup;}else cleanup();
  }
  reduced?.addEventListener?.('change',()=>{if(!enabled())clear();});
  window.addEventListener('resize',clear);window.addEventListener('blur',clear);
  return {capture,finish,clear,seed,rect,key,settle,returnGhost,enabled};
})();
