'use strict';
// Task 1 — Form validation
const form = document.getElementById('registrationForm');
form.addEventListener('submit', function(event) {
  event.preventDefault();
  const email = document.getElementById('emailRegistration').value.trim();
  const password = document.getElementById('passwordRegistration').value;
  const confirm = document.getElementById('passwordCheck').value;
  const emailError = !email ? 'Email is required.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Enter a valid email.' : '';
  const passwordError = !password ? 'Password is required.' : password.length < 8 ? 'Use at least 8 characters.' : '';
  const confirmError = !confirm ? 'Confirm your password.' : confirm !== password ? 'Passwords do not match.' : '';
  document.getElementById('emailError').textContent = emailError;
  document.getElementById('passwordError').textContent = passwordError;
  document.getElementById('confirmError').textContent = confirmError;
  const valid = !emailError && !passwordError && !confirmError;
  const status = document.getElementById('registrationStatus');
  status.textContent = valid ? '✓ Validation passed! Demo only: no account was created.' : 'Please correct the errors above.';
  status.style.color = valid ? '#287c36' : '#b22e2e';
});
// Task 2 — Accordion (smooth open/close)
document.querySelectorAll('.faq button').forEach(button => {
  button.addEventListener('click', () => {
    const answer = document.getElementById(button.getAttribute('aria-controls'));
    const opening = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(opening));
    button.querySelector('span').textContent = opening ? '−' : '+';
    if (opening) {
      answer.hidden = false;
      answer.animate([{opacity:0,transform:'translateY(-10px)'},{opacity:1,transform:'translateY(0)'}], {duration:250,easing:'ease-out'});
    } else {
      answer.hidden = true;
    }
  });
});
// Task 3 — Popup form
const backdrop = document.getElementById('modalBackdrop');
const openModal = document.getElementById('openModal');
const closeModal = document.getElementById('closeModal');
let previousFocus;
function showModal() { previousFocus = document.activeElement; backdrop.hidden = false; document.getElementById('contactName').focus(); }
function hideModal() { backdrop.hidden = true; if (previousFocus) previousFocus.focus(); }
openModal.addEventListener('click', showModal);
closeModal.addEventListener('click', hideModal);
backdrop.addEventListener('click', e => { if (e.target === backdrop) hideModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !backdrop.hidden) hideModal(); });
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('contactStatus').textContent = '✓ Demo message validated! Nothing was sent.';
});
// Task 4 — Background color cycle
const colors = ['#f6f8f2','#e9f4ff','#fff0e7','#f4edff','#f7f5dc'];
let colorIndex = 0;
document.getElementById('colorButton').addEventListener('click', () => {
  colorIndex = (colorIndex + 1) % colors.length;
  document.body.style.backgroundColor = colors[colorIndex];
});
// Task 5 — Current date and time
function updateDateTime() {
  document.getElementById('dateTime').textContent = '● ' + new Date().toLocaleString('en-US', {year:'numeric',month:'long',day:'numeric',hour:'numeric',minute:'2-digit',second:'2-digit'});
}
updateDateTime();
setInterval(updateDateTime, 1000);

// Assignment 5: dynamic article library, keyboard navigation, callbacks, audio.
const wikiSettings = {
  nightMode: false, soundEnabled: false,
  toggleTheme() {
    this.nightMode = !this.nightMode;
    document.body.classList.toggle('night', this.nightMode);
    return this.nightMode;
  }
};
const articles = [
  {id:'html', title:'HTML', symbol:'</>', description:'The structure and meaning of every webpage.', detail:'Semantic HTML tags organize accessible content.', url:'https://developer.mozilla.org/en-US/docs/Web/HTML'},
  {id:'css', title:'CSS', symbol:'✺', description:'Colors, spacing, and responsive layouts.', detail:'Flexbox, Grid, and media queries help create responsive designs.', url:'https://developer.mozilla.org/en-US/docs/Web/CSS'},
  {id:'javascript', title:'JavaScript', symbol:'JS', description:'The language that makes the web interactive.', detail:'JavaScript listens to events and updates the DOM dynamically.', url:'https://developer.mozilla.org/en-US/docs/Web/JavaScript'}
];
let audioContext;
function playClickSound() {
  if (!wikiSettings.soundEnabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    audioContext = audioContext || new AudioCtx();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.frequency.value = 520;
    gain.gain.setValueAtTime(0.04, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.10);
    oscillator.connect(gain); gain.connect(audioContext.destination);
    oscillator.start(); oscillator.stop(audioContext.currentTime + 0.11);
  } catch (error) { console.warn('Audio not available', error); }
}
function makeArticleCard(article) {
  const card = document.createElement('article');
  const graphic = document.createElement('div');
  graphic.className = `graphic ${article.id}`;
  graphic.textContent = article.symbol;
  const title = document.createElement('h3'); title.textContent = article.title;
  const summary = document.createElement('p'); summary.textContent = article.description;
  const more = document.createElement('button');
  more.className = 'read-more'; more.textContent = 'Read more +'; more.setAttribute('aria-expanded','false');
  const detail = document.createElement('p'); detail.className = 'card-details'; detail.textContent = article.detail; detail.hidden = true;
  const link = document.createElement('a'); link.href = article.url; link.target='_blank'; link.rel='noopener noreferrer'; link.textContent='Open MDN ↗';
  more.addEventListener('click', () => {
    const open = detail.hidden;
    detail.hidden = !open;
    more.textContent = open ? 'Read less −' : 'Read more +';
    more.setAttribute('aria-expanded', String(open));
    if (open && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      detail.animate([{opacity:0,transform:'translateY(-8px)'},{opacity:1,transform:'translateY(0)'}], {duration:250});
    }
    playClickSound();
  });
  card.append(graphic,title,summary,more,detail,link);
  return card;
}
function filterArticles(category) {
  let selected;
  switch (category) {
    case 'html': selected = articles.filter(item => item.id === 'html'); break;
    case 'css': selected = articles.filter(item => item.id === 'css'); break;
    case 'javascript': selected = articles.filter(item => item.id === 'javascript'); break;
    default: selected = articles;
  }
  const container = document.querySelector('.cards');
  container.replaceChildren();
  for (const article of selected) container.append(makeArticleCard(article));
  document.getElementById('articleCount').textContent = `Showing ${selected.length} of ${articles.length} articles`;
}
document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(item => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    filterArticles(button.dataset.category);
    playClickSound();
  });
});
filterArticles('all');
const navLinks = Array.from(document.querySelectorAll('#mainNav a'));
document.getElementById('mainNav').addEventListener('keydown', event => {
  if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  const index = navLinks.indexOf(document.activeElement);
  const offset = event.key === 'ArrowRight' ? 1 : -1;
  navLinks[(index + offset + navLinks.length) % navLinks.length].focus();
});
document.getElementById('themeToggle').addEventListener('click', event => {
  const on = wikiSettings.toggleTheme();
  event.currentTarget.textContent = on ? '☀ Day mode' : '☾ Night mode';
  event.currentTarget.setAttribute('aria-pressed',String(on));
  playClickSound();
});
document.getElementById('soundToggle').addEventListener('click', event => {
  wikiSettings.soundEnabled = !wikiSettings.soundEnabled;
  event.currentTarget.textContent = wikiSettings.soundEnabled ? '♪ Sound on' : '♪ Sound off';
  event.currentTarget.setAttribute('aria-pressed',String(wikiSettings.soundEnabled));
  playClickSound();
});
function showWizardStep(step, callback) {
  document.getElementById('wizardStep1').hidden = step !== 1;
  document.getElementById('wizardStep2').hidden = step !== 2;
  if (typeof callback === 'function') callback(step);
}
document.getElementById('wizardNext').addEventListener('click', () => {
  showWizardStep(2, () => document.getElementById('wizardResult').textContent = ''); playClickSound();
});
document.getElementById('wizardBack').addEventListener('click', () => {
  showWizardStep(1, () => document.getElementById('wizardResult').textContent = ''); playClickSound();
});
document.getElementById('wizardFinish').addEventListener('click', () => {
  const chosen = articles.find(item => item.id === document.getElementById('interest').value);
  const beginner = document.getElementById('experience').value === 'beginner';
  document.getElementById('wizardResult').textContent = `${beginner ? 'Start with' : 'Explore'} ${chosen.title}: ${chosen.description}`;
  playClickSound();
});
document.getElementById('surpriseButton').addEventListener('click', () => {
  const random = articles[Math.floor(Math.random() * articles.length)];
  document.getElementById('surpriseResult').textContent = `Try ${random.title}: ${random.detail}`;
  playClickSound();
});
