const sounds = [
  {name:'Wings',file:'wings.mp3'}, {name:'Walking through water',file:'Walking through water.mp3'},
  {name:'Sword Swing',file:'sword swing.mp3'}, {name:'Hit',file:'hit.mp3'},
  {name:'Splash',file:'splash.mp3'}, {name:'Heavy breathing while running',file:'heavy breathing while running.mp3'},
  {name:'Boy cry',file:'boy cry.mp3'}, {name:'Heavy breath',file:'heavy breath.mp3'},
  {name:'Shock (scream)',file:'shock(scream).mp3'}, {name:'Door',file:'door.mp3'},
  {name:'Kids laughing',file:'kids laughing.mp3'}, {name:'Ball hit',file:'ball hit.mp3'},
  {name:'Cow moo blyat',file:'cow moo blyat.mp3'}, {name:'Footsteps+Birds',file:'footsteps.mp3'},
  {name:'Village + birds',file:'village.mp3'}
];
const grid=document.getElementById('soundGrid'), searchInput=document.getElementById('searchInput'), playingCount=document.getElementById('playingCount'), emptyState=document.getElementById('emptyState');
const activeAudio=new Map();
function render(filter=''){
 const filtered=sounds.map((sound,index)=>({...sound,index})).filter(s=>s.name.toLowerCase().includes(filter.toLowerCase())); grid.innerHTML='';
 filtered.forEach(sound=>{const card=document.createElement('article');card.className='sound-card';card.dataset.index=sound.index;card.innerHTML=`<button class="play-btn" type="button" aria-label="დაკვრა">▶</button><div class="sound-info"><div class="sound-name"></div><div class="sound-type">MP3 AUDIO</div></div><div class="wave" aria-hidden="true">${'<b></b>'.repeat(7)}</div>`;card.querySelector('.sound-name').textContent=sound.name;card.querySelector('.play-btn').addEventListener('click',()=>toggleSound(sound.index));grid.appendChild(card);syncCard(sound.index);});
 emptyState.hidden=filtered.length!==0;document.getElementById('resultsLabel').textContent=filter?`${filtered.length} შედეგი`:'ყველა ხმა';
}
function toggleSound(index){
 if(activeAudio.has(index)){const a=activeAudio.get(index);a.pause();a.currentTime=0;activeAudio.delete(index);syncCard(index);updateCount();return;}
 const sound=sounds[index],audio=new Audio('assets/'+sound.file);activeAudio.set(index,audio);
 audio.addEventListener('ended',()=>{activeAudio.delete(index);syncCard(index);updateCount();});
 audio.addEventListener('error',()=>{activeAudio.delete(index);syncCard(index);updateCount();alert(`ფაილის დაკვრა ვერ მოხერხდა: ${sound.file}`);});
 audio.play().then(()=>{syncCard(index);updateCount();}).catch(()=>{activeAudio.delete(index);syncCard(index);updateCount();alert('აუდიოს დაკვრა ვერ მოხერხდა. სცადე გვერდის ხელახლა გახსნა.');});
}
function syncCard(index){const card=grid.querySelector(`[data-index="${index}"]`);if(!card)return;const on=activeAudio.has(index);card.classList.toggle('playing',on);const b=card.querySelector('.play-btn');b.textContent=on?'■':'▶';b.setAttribute('aria-label',on?'გაჩერება':'დაკვრა');}
function updateCount(){playingCount.textContent=activeAudio.size;}
document.getElementById('stopAll').addEventListener('click',()=>{for(const [i,a] of activeAudio){a.pause();a.currentTime=0;syncCard(i);}activeAudio.clear();updateCount();});
searchInput.addEventListener('input',e=>render(e.target.value));document.getElementById('soundCount').textContent=sounds.length;render();
