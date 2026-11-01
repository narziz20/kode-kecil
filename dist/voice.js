'use strict';
// Device speech stays optional: no account, API key, or uploaded text is required.
const BimoVoice = (() => {
  const synth=window.speechSynthesis;
  const key='kode-kecil-voice-v1';
  let preferences={voiceURI:'',style:'cheerful'},generation=0,pauseTimer=null,current=null;
  try {const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved&&typeof saved.voiceURI==='string'&&['cheerful','gentle'].includes(saved.style))preferences=saved;} catch {}
  const available=()=>synth?.getVoices?.()||[];
  const indonesian=()=>available().filter(v=>/^id(?:[-_]|$)/i.test(v.lang));
  function chooseVoice() {
    const voices=indonesian();
    const selected=voices.find(v=>v.voiceURI===preferences.voiceURI);
    // Names are only a preference heuristic; parents can audition every installed Indonesian voice.
    return selected||[...voices].sort((a,b)=>score(b)-score(a))[0]||null;
  }
  function score(v){return (/natural|neural|premium|enhanced/i.test(v.name)?20:0)+(v.localService?3:0)+(v.default?1:0);}
  function clean(text) {
    return String(text)
      .replace(/Belum pas, tidak apa-apa\./g,'Hmm, belum pas. Tidak apa-apa, ya!')
      .replace(/Berhasil! Kamu mencoba, berpikir, dan menemukan caranya\./g,'Hore, berhasil! Kamu menemukan caranya. Tos dulu, yuk!')
      .replace(/\bDAN\b/g,'dan').replace(/\bATAU\b/g,'atau').replace(/\bBUKAN\b/g,'bukan')
      .replace(/[⭐★]/gu,' bintang ').replace(/🚩/gu,' bendera ').replace(/🔒/gu,' gembok ')
      .replace(/↔/g,' ke samping ').replace(/↕/g,' ke atas dan ke bawah ')
      .replace(/[↑↓←→]/g,c=>({'↑':' ke atas ','↓':' ke bawah ','←':' ke kiri ','→':' lalu '}[c]))
      .replace(/(\d+)\s*[×x]/g,'$1 kali').replace(/[●■▲◆]/g,' ')
      .replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu,' ')
      .replace(/\s+([.!?,:])/g,'$1').replace(/\s+/g,' ').trim();
  }
  function phrases(text){return clean(text).match(/[^.!?]+[.!?]*/g)?.map(s=>s.trim()).filter(Boolean)||[];}
  function talking(on){const buddy=document.querySelector('#bimoBuddy');if(buddy){buddy.classList.toggle('speaking',on);}}
  function stop(){generation++;clearTimeout(pauseTimer);pauseTimer=null;current=null;talking(false);synth?.cancel();}
  function say(text){
    if(!synth||typeof SpeechSynthesisUtterance==='undefined')return false;
    stop();const token=generation,parts=phrases(text);if(!parts.length)return false;
    const voice=chooseVoice();
    function next(i){
      if(token!==generation||i>=parts.length){if(token===generation)talking(false);return;}
      const u=new SpeechSynthesisUtterance(parts[i]);current=u;
      if(voice)u.voice=voice;u.lang=voice?.lang||'id-ID';
      const cheerful=preferences.style==='cheerful',question=/\?$/.test(parts[i]),excited=/!$/.test(parts[i]);
      u.rate=cheerful?(question ? 0.94 : 1):0.88;
      u.pitch=cheerful?(excited?1.16:question?1.10:1.06):1;
      u.volume=1;
      u.onstart=()=>{if(token===generation)talking(true);};
      u.onend=()=>{if(token!==generation)return;talking(false);current=null;pauseTimer=setTimeout(()=>next(i+1),question?230:excited?130:170);};
      u.onerror=e=>{if(token!==generation)return;current=null;talking(false);if(!['canceled','interrupted'].includes(e.error)){stop();const status=document.querySelector('#voiceNotice');if(status)status.textContent=indonesian().length?'Suara ini belum bisa diputar. Coba pilihan suara lain, ya.':'Browser ini belum bisa memutar suara Indonesia. Coba browser atau perangkat yang punya suara Indonesia.';}};
      try{synth.speak(u);}catch{stop();return false;}
      return true;
    }
    return next(0);
  }
  function save(){try{localStorage.setItem(key,JSON.stringify(preferences));}catch{}}
  function options(){return {voices:indonesian(),...preferences,supported:!!synth};}
  function configure(voiceURI,style){stop();preferences={voiceURI:typeof voiceURI==='string'?voiceURI:'',style:style==='gentle'?'gentle':'cheerful'};save();}
  function refreshSettings(){
    const select=document.querySelector('#bimoVoiceSelect');if(!select)return;
    const voices=indonesian();select.replaceChildren();
    const auto=document.createElement('option');auto.value='';auto.textContent='Otomatis · suara Indonesia';select.append(auto);
    voices.forEach(v=>{const option=document.createElement('option');option.value=v.voiceURI;option.textContent=v.name+(v.localService?' · perangkat':' · mungkin perlu internet');select.append(option);});
    select.value=voices.some(v=>v.voiceURI===preferences.voiceURI)?preferences.voiceURI:'';
    const notice=document.querySelector('#voiceNotice');if(notice)notice.textContent=!synth?'Browser ini belum mendukung suara.':voices.length?'Coba dengarkan, lalu pilih suara yang paling nyaman. Karakter suara mengikuti perangkat.':'Suara Indonesia belum terdaftar. Browser akan mencoba suara bawaannya. Coba lagi setelah suara perangkat siap.';
  }
  synth?.addEventListener?.('voiceschanged',refreshSettings);
  return {say,stop,clean,phrases,chooseVoice,configure,options,refreshSettings};
})();
function voiceSettings() {
  const settings=BimoVoice.options();
  return `<section class="voice-settings"><h3>🎙️ Suara teman bermain</h3><p>Gaya ceria memakai kalimat pendek dan jeda kecil. Coba suaranya bersama anak.</p><label>Suara Indonesia<select id="bimoVoiceSelect" ${settings.supported?'':'disabled'}></select></label><label>Gaya bicara<select id="bimoVoiceStyle"><option value="cheerful" ${settings.style==='cheerful'?'selected':''}>Ceria · ayo bermain!</option><option value="gentle" ${settings.style==='gentle'?'selected':''}>Lembut · pelan-pelan</option></select></label><div class="coach-actions"><button class="secondary" data-action="voicePreview" ${settings.supported?'':'disabled'}>▶ Coba suara Bimo</button><button class="secondary" data-action="voiceStop">■ Hentikan</button></div><p id="voiceNotice" class="mini-help" role="status"></p></section>`;
}
function bindVoiceSettings(){BimoVoice.refreshSettings();const select=$('#bimoVoiceSelect'),style=$('#bimoVoiceStyle');if(!select||!style)return;select.onchange=style.onchange=()=>BimoVoice.configure(select.value,style.value);}
