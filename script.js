const sounds = [
  {name:'Wings',file:'wings.mp3',type:'MP3'},
  {name:'Walking through water',file:'Walking through water.wav',type:'WAV'},
  {name:'Sword მოძრაობა',file:'sword moqneva.mp3',type:'MP3'},
  {name:'Hit',file:'hit.flac',type:'FLAC'},
  {name:'Splash',file:'splash.wav',type:'WAV'},
  {name:'Heavy breathing while running',file:'heavy breathing while running.wav',type:'WAV'},
  {name:'Boy cry',file:'boy cry.flac',type:'FLAC'},
  {name:'Heavy breath',file:'heavy breath.wav',type:'WAV'},
  {name:'Shock (scream)',file:'shock(scream).mp3',type:'MP3'},
  {name:'Door',file:'door.wav',type:'WAV'},
  {name:'Kids laughing',file:'kids laughing.wav',type:'WAV'},
  {name:'Ball hit',file:'ball hit.wav',type:'WAV'},
  {name:'Cow moo blyat',file:'cow moo blyat.wav',type:'WAV'},
  {name:'Footsteps',file:'footsteps.wav',type:'WAV'},
  {name:'Village + birds',file:'village+birds.wav',type:'WAV'}
];

const grid = document.getElementById('soundGrid');
const searchInput = document.getElementById('searchInput');
const playingCount = document.getElementById('playingCount');
const emptyState = document.getElementById('emptyState');
const activeAudio = new Map();

function render(filter = '') {
  const filtered = sounds.map((sound, index) => ({...sound, index}))
    .filter(sound => sound.name.toLowerCase().includes(filter.toLowerCase()));
  grid.innerHTML = '';
  filtered.forEach(sound => {
    const card = document.createElement('article');
    card.className = 'sound-card';
    card.dataset.index = sound.index;
    card.innerHTML = `
      <button class="play-btn" type="button" aria-label="დაკვრა">▶</button>
      <div class="sound-info">
        <div class="sound-name"></div>
        <div class="sound-type">${sound.type} AUDIO</div>
      </div>
      <div class="wave" aria-hidden="true">${'<b></b>'.repeat(7)}</div>`;
    card.querySelector('.sound-name').textContent = sound.name;
    card.querySelector('.play-btn').addEventListener('click', () => toggleSound(sound.index));
    grid.appendChild(card);
    syncCard(sound.index);
  });
  emptyState.hidden = filtered.length !== 0;
  document.getElementById('resultsLabel').textContent = filter ? `${filtered.length} შედეგი` : 'ყველა ხმა';
}

function toggleSound(index) {
  if (activeAudio.has(index)) {
    activeAudio.get(index).pause();
    activeAudio.get(index).currentTime = 0;
    activeAudio.delete(index);
    syncCard(index);
    updateCount();
    return;
  }
  const sound = sounds[index];
  const audio = new Audio(`assets/${encodeURIComponent(sound.file)}`);
  activeAudio.set(index, audio);
  audio.addEventListener('ended', () => {
    activeAudio.delete(index);
    syncCard(index);
    updateCount();
  });
  audio.addEventListener('error', () => {
    activeAudio.delete(index);
    syncCard(index);
    updateCount();
    alert(`ფაილის დაკვრა ვერ მოხერხდა: ${sound.file}`);
  });
  audio.play().then(() => {
    syncCard(index);
    updateCount();
  }).catch(() => {
    activeAudio.delete(index);
    syncCard(index);
    updateCount();
    alert('ბრაუზერმა აუდიოს დაკვრა ვერ შეძლო. კიდევ ერთხელ სცადე.');
  });
}

function syncCard(index) {
  const card = grid.querySelector(`[data-index="${index}"]`);
  if (!card) return;
  const isPlaying = activeAudio.has(index);
  card.classList.toggle('playing', isPlaying);
  const button = card.querySelector('.play-btn');
  button.textContent = isPlaying ? '■' : '▶';
  button.setAttribute('aria-label', isPlaying ? 'გაჩერება' : 'დაკვრა');
}
function updateCount() { playingCount.textContent = activeAudio.size; }

document.getElementById('stopAll').addEventListener('click', () => {
  for (const [index, audio] of activeAudio) {
    audio.pause();
    audio.currentTime = 0;
    syncCard(index);
  }
  activeAudio.clear();
  updateCount();
});
searchInput.addEventListener('input', event => render(event.target.value));
document.getElementById('soundCount').textContent = sounds.length;
render();
