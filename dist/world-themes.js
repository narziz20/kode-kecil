'use strict';
// Scenery is decorative. Game-card colors retain their original meaning in every world.
const worldLooks = {
  safari: ['#fff7e4','#f3db9b','#55753b','#305c37','#dce8bc','Jalan-jalan ke kebun binatang'],
  laut: ['#eaf8fc','#a4dfed','#326c9c','#155c7c','#c8edf2','Menyelam ke laut ajaib'],
  kebun: ['#f5fae7','#d9ec9c','#65843d','#41652e','#e6f0c8','Terbang bersama kupu-kupu'],
  dino: ['#eef7e9','#bfdbac','#55805b','#326447','#d5e9c9','Menjelajah lembah purba'],
  peternakan: ['#fff5e8','#f4d2a1','#ad7856','#85492f','#fae3c5','Pagi cerah di peternakan'],
  angkasa: ['#f1effc','#cbc3ee','#6568a3','#50478b','#e1dcf5','Meluncur di antara planet'],
  kucing: ['#fff1ec','#f4c9bc','#b67e7f','#8b4b59','#f9dfd6','Bertamu ke kota sahabat'],
  kutub: ['#edf9fc','#bce4ed','#6aabb8','#21697c','#d8f0f5','Bermain di negeri es'],
  buah: ['#fff4ed','#f9d9a9','#bc7778','#934655','#fce5ce','Pilih buah warna-warni'],
  kendaraan: ['#eef6fc','#c1dbed','#6797b3','#326b8e','#dcecf6','Keliling kota bersama'],
  hutan: ['#f0f6e7','#c5d8b2','#658561','#355e40','#dfebd2','Mengintip rahasia pepohonan'],
  taman: ['#fff9e7','#f5df9f','#af899b','#815269','#f9ebc6','Mekar bersama bunga'],
  robot: ['#edf8f4','#bce3d8','#659c9c','#326b6d','#d9eee8','Bip-bip! Selamat datang'],
  musik: ['#f9f0fb','#e4cbed','#a18bb9','#77518c','#efe0f4','Konser kecil penuh irama'],
  cuaca: ['#edf7fd','#cee6f3','#88b5c9','#326d88','#e0f1f9','Bermain di atas awan'],
  dongeng: ['#faf0fc','#e7cdef','#a394c7','#77508d','#f0e1f7','Masuk ke hutan dongeng'],
  dapur: ['#fff4ec','#f5d4bb','#bc8d7e','#8a5441','#f9e5d6','Ada ide manis hari ini'],
  olahraga: ['#f0f8e9','#c5e4ac','#79a480','#3d7046','#e0efcf','Ayo bergerak dan bermain'],
  seni: ['#fff3ed','#f5d0c0','#b7879d','#8c506d','#f9e1d8','Warnai ide besarmu'],
  pantai: ['#fff9e8','#f5dda7','#7abec1','#246b78','#fbebc4','Petualangan di tepi pantai']
};
const sceneEmoji=(icon,x,y,size=66,cls='')=>`<text x="${x}" y="${y}" font-size="${size}" text-anchor="middle" class="${cls}" font-family="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif">${icon}</text>`;
const sceneCloud=(x,y)=>`<g fill="#fff" opacity=".78" transform="translate(${x} ${y})"><ellipse rx="65" ry="23"/><circle cx="-22" cy="-16" r="26"/><circle cx="20" cy="-20" r="33"/></g>`;
const sceneTree=(x,y,c='#83a46a',scale=1)=>`<g transform="translate(${x} ${y}) scale(${scale})"><path d="M0 0V-110" stroke="#9c7c53" stroke-width="16" stroke-linecap="round"/><ellipse cy="-105" rx="65" ry="36" fill="${c}"/><ellipse cx="-28" cy="-118" rx="40" ry="27" fill="${c}"/></g>`;
const sceneHouse=(x,y,c='#e9b096',roof='#b87e6f')=>`<g transform="translate(${x} ${y})"><rect width="120" height="100" rx="8" fill="${c}"/><path d="M-12 0L60-55 132 0Z" fill="${roof}"/><rect x="45" y="40" width="30" height="60" rx="15" fill="#fff7de"/><path d="M15 20h20v25H15zm70 0h20v25H85z" fill="#f3faf5"/></g>`;
const sceneFlower=(x,y,c='#e9a8b8')=>`<g transform="translate(${x} ${y})"><path d="M0 0v-36" stroke="#7da276" stroke-width="7"/><g fill="${c}"><circle cx="-14" cy="-43" r="14"/><circle cx="14" cy="-43" r="14"/><circle cy="-60" r="14"/><circle cy="-28" r="14"/></g><circle cy="-43" r="10" fill="#ffdf86"/></g>`;
const worldSceneCache=new Map();
function worldScene(slug) {
  if(worldSceneCache.has(slug))return worldSceneCache.get(slug);
  const look=worldLooks[slug]||worldLooks.safari;
  const sky=`<rect width="1200" height="360" fill="${look[1]}"/>`;
  const hills=`<path d="M0 235Q190 160 380 245T800 225T1200 230V360H0Z" fill="${look[2]}" opacity=".25"/><path d="M0 290Q240 220 450 290T920 275T1200 290V360H0Z" fill="${look[2]}" opacity=".28"/>`;
  const sunshine=`<circle cx="1060" cy="68" r="38" fill="#ffe9a4"/>${sceneCloud(200,62)}${sceneCloud(770,55)}`;
  const fence=`<g stroke="#b78c59" stroke-width="9" stroke-linecap="round"><path d="M120 292H1080M120 322H1080"/>${[140,200,260,320,380,440,760,820,880,940,1000,1060].map(x=>`<path d="M${x} 275v67"/>`).join('')}</g>`;
  const ocean=`<path d="M0 95Q100 65 200 95T400 95T600 95T800 95T1000 95T1200 95V360H0Z" fill="#61bad2"/><path d="M0 210Q220 175 440 220T880 215T1200 210V360H0Z" fill="#387faa"/><path d="M0 325Q200 280 420 325T800 320T1200 310V360H0Z" fill="#23618a"/>`;
  const coral=`<g fill="none" stroke-linecap="round" stroke-width="12"><path d="M100 350v-68m0 33-26-24m26 7 25-32M1090 350v-78m0 35-28-20m28 0 26-25" stroke="#e6a6b4"/><path d="M155 350q-35-45 0-90m890 90q32-45 0-90" stroke="#86c7b9"/></g>`;
  const stars=[80,200,340,510,680,820,970,1110].map((x,i)=>sceneEmoji('✦',x,45+(i%3)*40,20)).join('');
  const scenes={
    safari: sunshine+hills+sceneTree(100,280)+sceneTree(1100,280,'#83a46a',1.3)+`<path d="M450 360Q500 260 550 230H650Q710 270 760 360" fill="#faedc9"/>`+fence+`<path d="M490 300V180Q600 110 710 180V300" fill="none" stroke="#a17d50" stroke-width="16"/><rect x="510" y="157" width="180" height="42" rx="18" fill="#fff6d8"/>`+sceneEmoji('🐾',600,189,30)+sceneEmoji('🦒',345,264,84)+sceneEmoji('🐘',870,278,82)+sceneEmoji('🦁',600,293,76),
    laut: ocean+`<path d="M340 0l-90 310h120L430 0m160 0-30 250h100L690 0" fill="#e1faff" opacity=".12"/>`+coral+sceneEmoji('🐳',680,155,100,'scene-float')+sceneEmoji('🐠',325,245,60)+sceneEmoji('🐙',800,320,68)+[230,300,880,950,450].map((x,i)=>`<circle cx="${x}" cy="${55+i*48}" r="${8+i*2}" fill="none" stroke="#c4f4fb" stroke-width="3" opacity=".65"/>`).join(''),
    kebun: sunshine+hills+[120,290,475,720,930,1080].map((x,i)=>sceneFlower(x,330,i%2?'#e9b5cf':'#e9c56a')).join('')+sceneEmoji('🦋',600,170,85,'scene-float')+sceneEmoji('🐝',880,205,55)+sceneEmoji('🐛',365,327,56),
    dino: sunshine+`<path d="M30 280L250 65 440 280M730 280L950 80 1200 280" fill="#9cb795"/><path d="M194 125l56-60 61 63-62-19Z" fill="#f7ead3"/>`+hills+sceneTree(1050,320)+sceneEmoji('🦕',470,300,105)+sceneEmoji('🦖',730,310,85)+sceneEmoji('🥚',900,333,45),
    peternakan: sunshine+hills+sceneHouse(180,215,'#df9d83','#bb6e5e')+fence+sceneEmoji('🐮',520,288,82)+sceneEmoji('🐑',760,294,70)+sceneEmoji('🐔',950,304,58),
    angkasa: `<rect width="1200" height="360" fill="#5d638e"/>`+stars+`<circle cx="950" cy="230" r="80" fill="#bda8dd"/><ellipse cx="950" cy="230" rx="135" ry="24" fill="none" stroke="#e4cdb2" stroke-width="15" transform="rotate(-18 950 230)"/><path d="M0 330Q370 220 650 360" fill="#a0a8cb"/>`+sceneEmoji('🚀',510,200,98,'scene-float')+sceneEmoji('🛸',750,300,65),
    kucing: sunshine+hills+[140,360,700,940].map((x,i)=>sceneHouse(x,220-i%2*25,['#e5b8b2','#d8c8a9','#e3c8b9','#c7d7c4'][i])).join('')+sceneEmoji('🐱',585,275,84)+sceneEmoji('🐶',820,340,58),
    kutub: sunshine+`<path d="M0 275L170 105 330 275 540 100 740 270 1000 90 1200 280V360H0Z" fill="#f5fcff"/><path d="M0 295Q300 235 600 295T1200 300V360H0Z" fill="#8ccad8"/><ellipse cx="610" cy="300" rx="230" ry="40" fill="#f0faff"/>`+sceneEmoji('🐧',540,280,85)+sceneEmoji('🦭',720,302,67),
    buah: sunshine+hills+`<rect x="350" y="165" width="500" height="155" rx="12" fill="#b58c65"/><path d="M320 165l45-70h470l45 70Z" fill="#fff7dc"/><path d="M365 95h80l-15 70h-90zm160 0h80v70h-88zm160 0h80l20 70h-92" fill="#e7a29c"/><rect x="370" y="220" width="460" height="65" rx="8" fill="#f8e5ba"/>`+['🍓','🍌','🍎','🍇'].map((v,i)=>sceneEmoji(v,430+i*115,270,58)).join(''),
    kendaraan: sunshine+[100,280,820,1000].map((x,i)=>sceneHouse(x,145+i%2*30,'#a9cad9','#799eb5')).join('')+`<path d="M0 255H1200V360H0Z" fill="#93a9b4"/><path d="M0 310H1200" stroke="#ffefba" stroke-width="7" stroke-dasharray="45 40"/>`+sceneEmoji('🚂',445,294,87)+sceneEmoji('🚗',780,300,67),
    hutan: sunshine+hills+[100,260,910,1100].map((x,i)=>sceneTree(x,310,'#789575',1+i%2*.3)).join('')+sceneEmoji('🦊',510,300,80)+sceneEmoji('🦉',910,170,57)+sceneEmoji('🍄',720,325,48),
    taman: sunshine+hills+[120,260,420,600,780,940,1100].map((x,i)=>sceneFlower(x,320,i%2?'#e6a8b8':'#e7c366')).join('')+sceneEmoji('🌻',600,205,80)+sceneEmoji('🦋',835,160,48,'scene-float'),
    robot: sunshine+`<g fill="#8ebeb5">${[100,310,790,1000].map((x,i)=>`<rect x="${x}" y="${170-i%2*40}" width="130" height="170" rx="15"/>`).join('')}</g><path d="M0 320H1200M100 340h330v-90h250v90h420" fill="none" stroke="#ecfaf0" stroke-width="8" stroke-linecap="round"/>`+sceneEmoji('🤖',590,280,100)+sceneEmoji('⚙️',880,165,60)+sceneEmoji('💡',345,140,50),
    musik: `<path d="M0 0H1200V360H0Z" fill="#bba2cd"/><path d="M0 0h180v300Q85 270 0 330zm1200 0h-180v300q95-30 180 30" fill="#9574ae"/><path d="M330 0 200 300h380L470 0M800 0 690 300h360L940 0" fill="#fff0be" opacity=".25"/><ellipse cx="600" cy="325" rx="440" ry="55" fill="#8d739f"/>`+sceneEmoji('🥁',600,280,100)+sceneEmoji('🎸',350,260,80)+sceneEmoji('🎺',845,255,76)+sceneEmoji('♪',750,110,60,'scene-float'),
    cuaca: sunshine+`<path d="M320 300a280 280 0 0 1 560 0" fill="none" stroke="#eab4b0" stroke-width="32"/><path d="M355 300a245 245 0 0 1 490 0" fill="none" stroke="#f3dda1" stroke-width="30"/><path d="M388 300a212 212 0 0 1 424 0" fill="none" stroke="#a5d2bb" stroke-width="28"/>`+sceneCloud(350,300)+sceneCloud(850,300)+sceneCloud(1000,190)+sceneEmoji('🌤️',570,215,70),
    dongeng: sunshine+hills+`<g fill="#b69acb"><path d="M430 300V170h340v130zM400 300V115h70v185zm330 0V115h70v185z"/><path d="M385 115l50-75 50 75zm330 0 50-75 50 75z" fill="#9678b6"/><path d="M565 300v-60a35 35 0 0 1 70 0v60" fill="#fff4da"/></g>`+sceneTree(100,320,'#b3a0c4')+sceneEmoji('🦄',890,310,85)+sceneEmoji('🧚',315,190,65,'scene-float'),
    dapur: `<path d="M0 250H1200V360H0Z" fill="#b8907b"/><path d="M0 80H1200" stroke="#e3b99c" stroke-width="14"/><g fill="#fff5e5"><rect x="160" y="120" width="170" height="115" rx="14"/><rect x="860" y="120" width="170" height="115" rx="14"/><ellipse cx="600" cy="295" rx="230" ry="32"/></g>`+sceneEmoji('🧁',535,270,92)+sceneEmoji('🍪',700,280,70)+sceneEmoji('🥄',240,210,60),
    olahraga: sunshine+`<path d="M0 190H1200V360H0Z" fill="#99c18b"/><g fill="none" stroke="#eff8dd" stroke-width="6"><rect x="110" y="210" width="980" height="125" rx="20"/><path d="M600 210v125"/><ellipse cx="600" cy="272" rx="80" ry="55"/><path d="M145 235h110v75H145M1055 235H945v75h110"/></g>`+sceneEmoji('⚽',530,290,76)+sceneEmoji('🏀',810,296,65)+sceneEmoji('🏆',1010,180,58),
    seni: sunshine+`<g opacity=".5"><circle cx="230" cy="230" r="90" fill="#e7b6be"/><circle cx="990" cy="170" r="90" fill="#a9cadb"/><circle cx="850" cy="300" r="95" fill="#e4d193"/></g><path d="M490 340 550 70m150 270L640 70m-150 220h210" stroke="#ad866b" stroke-width="15"/><rect x="480" y="115" width="230" height="165" rx="10" fill="#fffaf0"/>`+sceneEmoji('🌈',595,230,95)+sceneEmoji('🎨',870,310,80)+sceneEmoji('🖍️',325,310,74),
    pantai: sunshine+`<path d="M0 145H1200V300H0Z" fill="#91d3d5"/><path d="M0 250Q230 200 450 265T900 255T1200 250V360H0Z" fill="#fff0c9"/><path d="M0 246Q230 196 450 261T900 251T1200 246" fill="none" stroke="#f2fffa" stroke-width="12"/>`+sceneEmoji('🏖️',420,300,110)+sceneEmoji('🐚',720,320,62)+sceneEmoji('🪁',900,135,73,'scene-float')
  };
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 360" aria-hidden="true" focusable="false">${sky}${scenes[slug]||scenes.safari}</svg>`;
  worldSceneCache.set(slug,svg);return svg;
}
function applyWorldTheme(slug=null) {
  const body=document.body;
  if(!slug||!worldLooks[slug]){delete body.dataset.world;['--paper','--green','--world-soft','--world-sky','--world-shadow','--world-backdrop'].forEach(k=>body.style.removeProperty(k));return;}
  const [paper,sky,,accent,soft]=worldLooks[slug];
  body.dataset.world=slug;
  Object.entries({'--paper':paper,'--green':accent,'--world-soft':soft,'--world-sky':sky,'--world-shadow':accent,'--world-backdrop':`url("data:image/svg+xml,${encodeURIComponent(worldScene(slug))}")`}).forEach(([k,v])=>body.style.setProperty(k,v));
}
function worldPostcard(w){return `<div class="world-postcard">${worldScene(w.slug).replace('<svg ','<svg preserveAspectRatio="xMidYMid slice" ')}<span>${w.icon} ${worldLooks[w.slug][5]}</span></div>`;}
