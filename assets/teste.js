const form = document.getElementById('quiz');
const resultSection = document.getElementById('result');
const personagemImg = document.getElementById('personagem-img');
const personagemNome = document.getElementById('personagem-nome');
const descricaoEl = document.getElementById('descricao');
const resetBtn = document.getElementById('reset');

const characters = {
  hello: { name: 'Hello Kitty', emoji: '🎀', img: 'assets/hellokitty.png', desc: 'Você é solícito(a), carinhoso(a) e adora ajudar os outros.' },
  kuromi: { name: 'Kuromi', emoji: '😈', img: 'assets/kuromi.png', desc: 'Você é travesso(a), ousado(a) e adora um toque rebelde.' },
  gudetama: { name: 'Gudetama', emoji: '🥚', img: 'assets/gudetama.png', desc: 'Você tende a se sentir sobrecarregado(a) ou preguiçoso(a), precisando de descanso.' },
  aggretsuko: { name: 'Aggretsuko', emoji: '🎤', img: 'assets/aggretsuko.png', desc: 'Você tem emoções intensas e às vezes precisa extravasar.' },
  cinnamoroll: { name: 'Cinnamoroll', emoji: '☁️', img: 'assets/cinnamoroll.png', desc: 'Você é muito fofo(a), sonhador(a) e gentil.' },
  keroppi: { name: 'Keroppi', emoji: '🐸', img: 'assets/keroppi.png', desc: 'Você é aventureiro(a), curioso(a) e cheio(a) de energia.' }
};

// --- Mostrar apenas uma pergunta por vez ---
const fieldsets = Array.from(form.querySelectorAll('fieldset'));
const nextBtn = document.getElementById('nextBtn');
const progressEl = document.getElementById('progress');
let currentIndex = 0;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function shuffleOptions() {
  fieldsets.forEach((fieldset) => {
    const labels = Array.from(fieldset.querySelectorAll('label'));
    const parent = labels[0]?.parentElement;
    shuffleArray(labels);
    labels.forEach((label) => {
      fieldset.appendChild(label);
    });
  });
}

shuffleOptions();

function showQuestion(i){
  fieldsets.forEach((fs, idx) => fs.style.display = idx === i ? '' : 'none');
  progressEl.textContent = `Pergunta ${i+1} de ${fieldsets.length}`;
  if(i === fieldsets.length - 1){
    nextBtn.textContent = 'Ver resultado';
  } else {
    nextBtn.textContent = 'Próximo';
  }
}

showQuestion(0);

nextBtn.addEventListener('click', () => {
  // valida se respondeu a pergunta atual
  const inputs = fieldsets[currentIndex].querySelectorAll('input[type=radio]');
  const answered = Array.from(inputs).some(i => i.checked);
  if(!answered){
    alert('Por favor responda a pergunta antes de continuar.');
    return;
  }

  if(currentIndex < fieldsets.length - 1){
    currentIndex++;
    showQuestion(currentIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    form.requestSubmit();
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const answers = [];
  for (let i = 1; i <= 10; i++) {
    const val = data.get('q' + i);
    if (!val) {
      alert('Por favor responda todas as perguntas.');
      return;
    }
    answers.push(val);
  }

  // Contar votos
  const counts = { hello:0, kuromi:0, gudetama:0, aggretsuko:0, cinnamoroll:0, keroppi:0 };
  answers.forEach(a => { if (counts.hasOwnProperty(a)) counts[a]++; });

  // Determinar maior
  let winner = null;
  let best = -1;
  for (const key of Object.keys(counts)) {
    if (counts[key] > best) { best = counts[key]; winner = key; }
  }

  const info = characters[winner];
  personagemImg.src = info.img;
  personagemImg.alt = info.name;
  personagemNome.textContent = `${info.emoji} ${info.name}`;
  descricaoEl.textContent = info.desc;
  resultSection.hidden = false;
  window.scrollTo({top: resultSection.offsetTop - 10, behavior: 'smooth'});
});

resetBtn.addEventListener('click', () => {
  window.location.reload();
});
