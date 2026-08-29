/* ============================================================
   Gín-á Flashcards — deck logic and card rendering.
   WORDS is injected at build time: [en, zh, pinyin, twHan, twTailo, cat]
   drawArt(key, cat) comes from the art engine.
============================================================ */
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const CATS = [
    ['animals','Animals'],['food','Food'],['family','Family'],['body','Body'],['feelings','Feelings'],
    ['home','Home'],['clothes','Clothes'],['school','School'],['toys','Toys'],['music','Music'],
    ['sports','Sports'],['transport','Getting around'],['nature','Nature'],['places','Places'],
    ['colors','Colours'],['shapes','Shapes'],['numbers','Numbers'],['time','Time'],['jobs','Jobs'],
    ['culture','Festivals'],['phrases','Everyday talk'],['actions','Doing words'],
    ['describing','Describing'],['position','Where things are'],['misc','Odds and ends']
  ];
  const SIZES = [10, 20, 30, 50, 100, 250, 500, 1000];

  /* ---------- state ---------- */
  const saved = (() => { try { return JSON.parse(localStorage.getItem('ginacards') || '{}'); } catch (e) { return {}; } })();
  const state = {
    size: saved.size || 20,
    cats: new Set(saved.cats && saved.cats.length ? saved.cats : []),
    pinyin: saved.pinyin !== false,
    sound: saved.sound !== false,
    shuffle: saved.shuffle !== false,
    deck: [], i: 0, round: 1, flipped: false
  };
  const save = () => { try { localStorage.setItem('ginacards', JSON.stringify({
    size: state.size, cats: [...state.cats], pinyin: state.pinyin, sound: state.sound, shuffle: state.shuffle
  })); } catch (e) {} };

  const pool = () => state.cats.size ? WORDS.filter(w => state.cats.has(w[5])) : WORDS.slice();

  /* ---------- home screen ---------- */
  $('mark').innerHTML = drawArt('cat', 'animals');

  const sizesEl = $('sizes');
  SIZES.forEach(n => {
    const b = document.createElement('button');
    b.className = 'size'; b.type = 'button'; b.dataset.n = n;
    b.innerHTML = n + '<small>cards</small>';
    b.addEventListener('click', () => { setSize(n); });
    sizesEl.appendChild(b);
  });

  const topicsEl = $('topics');
  const allBtn = document.createElement('button');
  allBtn.className = 'topic all'; allBtn.type = 'button'; allBtn.textContent = 'Everything';
  allBtn.addEventListener('click', () => { state.cats.clear(); syncHome(); save(); });
  topicsEl.appendChild(allBtn);
  const counts = {};
  WORDS.forEach(w => counts[w[5]] = (counts[w[5]] || 0) + 1);
  CATS.forEach(([key, label]) => {
    if (!counts[key]) return;
    const b = document.createElement('button');
    b.className = 'topic'; b.type = 'button'; b.dataset.cat = key;
    b.innerHTML = label + ' <i>' + counts[key] + '</i>';
    b.addEventListener('click', () => {
      state.cats.has(key) ? state.cats.delete(key) : state.cats.add(key);
      syncHome(); save();
    });
    topicsEl.appendChild(b);
  });

  const range = $('sizeRange');
  range.addEventListener('input', () => setSize(+range.value, true));

  function setSize(n, fromRange) {
    const max = pool().length;
    state.size = Math.max(1, Math.min(n, max));
    syncHome(fromRange); save();
  }

  const toggle = (el, on) => el.setAttribute('aria-pressed', on ? 'true' : 'false');
  [['optPinyin', 'pinyin'], ['optSound', 'sound'], ['optShuffle', 'shuffle']].forEach(([id, key]) => {
    $(id).addEventListener('click', () => { state[key] = !state[key]; syncHome(); save(); });
  });

  function syncHome(fromRange) {
    const max = pool().length;
    if (state.size > max) state.size = max;
    range.max = max;
    if (!fromRange) range.value = state.size;
    $('sizeOut').textContent = state.size;
    $('poolNote').textContent = max + ' available';
    [...sizesEl.children].forEach(b => {
      const n = +b.dataset.n;
      b.disabled = n > max;
      b.style.opacity = n > max ? .35 : 1;
      toggle(b, n === state.size);
    });
    toggle(allBtn, state.cats.size === 0);
    [...topicsEl.querySelectorAll('[data-cat]')].forEach(b => toggle(b, state.cats.has(b.dataset.cat)));
    toggle($('optPinyin'), state.pinyin); toggle($('optSound'), state.sound); toggle($('optShuffle'), state.shuffle);
    const names = [...state.cats].map(c => (CATS.find(x => x[0] === c) || [, c])[1].toLowerCase());
    const topicTxt = names.length === 0 ? 'all topics'
      : names.length <= 2 ? names.join(' + ')
        : names.length + ' topics';
    $('startNote').textContent = state.size + (state.size === 1 ? ' card · ' : ' cards · ') + topicTxt;
  }

  /* ---------- deck ---------- */
  function shuffled(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function build() {
    state.deck = shuffled(pool()).slice(0, state.size);
    state.i = 0; state.round = 1;
    show(0);
  }

  /* ---------- speech ---------- */
  let voices = [];
  const loadVoices = () => { try { voices = speechSynthesis.getVoices() || []; } catch (e) { voices = []; } };
  if ('speechSynthesis' in window) {
    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
  }
  function voiceFor(prefixes) {
    for (const p of prefixes) {
      const v = voices.find(v => (v.lang || '').toLowerCase().replace('_', '-').startsWith(p));
      if (v) return v;
    }
    return null;
  }
  function speak(text, prefixes) {
    if (!state.sound || !('speechSynthesis' in window)) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const v = voiceFor(prefixes);
      if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = prefixes[0]; }
      u.rate = .85; u.pitch = 1.05;
      speechSynthesis.speak(u);
    } catch (e) {}
  }
  const speakerIcon = '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4 4 0 0 0-2-3.5v7a4 4 0 0 0 2-3.5zM19 12a6.5 6.5 0 0 0-3-5.5v11A6.5 6.5 0 0 0 19 12z"/></svg>';
  const canSpeak = (prefixes) => 'speechSynthesis' in window && !!voiceFor(prefixes);

  /* ---------- rendering ---------- */
  const esc = (s) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function show(dir) {
    const w = state.deck[state.i];
    if (!w) return;
    const [en, zh, py, twh, twt, cat] = w;
    const card = $('card');
    card.classList.remove('flip');
    state.flipped = false;

    const topic = (CATS.find(c => c[0] === cat) || [, cat])[1];
    $('front').innerHTML =
      '<span class="eyebrow">' + esc(topic) + '</span>' +
      '<div class="art">' + drawArt(en, cat) + '</div>' +
      '<div class="zh' + (zh.length > 3 ? ' long' : '') + '">' + esc(zh) + '</div>' +
      (state.pinyin ? '<div class="py">' + esc(py) + '</div>' : '') +
      '<span class="hint">tap to flip</span>';

    const mandBtn = canSpeak(['zh-tw', 'zh-hant', 'zh', 'cmn'])
      ? '<button class="say" data-say="zh">' + speakerIcon + '華語</button>' : '';
    const enBtn = canSpeak(['en'])
      ? '<button class="say" data-say="en">' + speakerIcon + 'English</button>' : '';

    $('backface').innerHTML =
      '<div class="rows">' +
        '<div class="row"><span class="tag">English</span><div class="en">' + esc(en) + '</div>' + enBtn + '</div>' +
        '<div class="divider"></div>' +
        '<div class="row"><span class="tag">台語 Taiwanese</span><div class="tw">' + esc(twh) + '</div>' +
          '<div class="tl">' + esc(twt) + '</div></div>' +
        '<div class="divider"></div>' +
        '<div class="row"><span class="tag">華語 Mandarin</span>' +
          '<div class="mand">' + esc(zh) + ' <span>' + esc(py) + '</span></div>' + mandBtn + '</div>' +
      '</div>' +
      '<span class="hint">tap to flip back</span>';

    $('backface').querySelectorAll('[data-say]').forEach(b => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        b.dataset.say === 'en' ? speak(en, ['en']) : speak(zh, ['zh-tw', 'zh-hant', 'zh', 'cmn']);
      });
    });

    $('pos').textContent = state.i + 1;
    $('total').textContent = state.deck.length;
    $('roundLbl').textContent = 'Round ' + state.round;

    if (dir) {
      card.style.setProperty('--from', (dir > 0 ? 42 : -42) + 'px');
      card.style.setProperty('--rot', (dir > 0 ? 3 : -3) + 'deg');
      card.classList.remove('deal'); void card.offsetWidth; card.classList.add('deal');
    }
    if (state.sound && dir >= 0) speak(zh, ['zh-tw', 'zh-hant', 'zh', 'cmn']);
  }

  function flip() {
    state.flipped = !state.flipped;
    $('card').classList.toggle('flip', state.flipped);
  }
  function step(d) {
    const n = state.deck.length;
    state.i += d;
    if (state.i >= n) {                       // infinite: keep dealing
      state.i = 0; state.round++;
      if (state.shuffle) state.deck = shuffled(state.deck);
      banner('Round ' + state.round + ' — here we go again!');
    } else if (state.i < 0) {
      state.i = n - 1;
      if (state.round > 1) state.round--;
    }
    show(d);
  }
  function banner(text) {
    const old = document.querySelector('.round'); if (old) old.remove();
    const el = document.createElement('div');
    el.className = 'round'; el.textContent = text;
    document.querySelector('.stage').appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }

  /* ---------- input ---------- */
  $('card').addEventListener('click', flip);
  $('card').addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); }
  });
  $('flip').addEventListener('click', flip);
  $('next').addEventListener('click', () => step(1));
  $('prev').addEventListener('click', () => step(-1));
  $('reshuffle').addEventListener('click', () => {
    state.deck = shuffled(state.deck); state.i = 0; show(1); banner('Shuffled!');
  });
  $('back').addEventListener('click', () => go('home'));
  $('start').addEventListener('click', () => { build(); go('deck'); $('card').focus(); });

  document.addEventListener('keydown', (e) => {
    if (!$('deck').classList.contains('on')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    else if (e.key === 'Escape') go('home');
  });

  let tx = 0, ty = 0, moved = false;
  const card = $('card');
  card.addEventListener('touchstart', (e) => {
    tx = e.touches[0].clientX; ty = e.touches[0].clientY; moved = false;
  }, { passive: true });
  card.addEventListener('touchmove', (e) => {
    if (Math.abs(e.touches[0].clientX - tx) > 12) moved = true;
  }, { passive: true });
  card.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (moved && Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) { step(dx < 0 ? 1 : -1); }
  }, { passive: true });

  function go(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.toggle('on', s.id === name));
    if (name === 'home') { syncHome(); try { speechSynthesis.cancel(); } catch (e) {} }
  }

  syncHome();
})();
