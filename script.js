/* ══════════════════════════════════════════════════════════════
   KRONOS — script.js  v2.0
   Features: Timezone switching + sky sync, global TZ search,
             Settings panel, Rain sound effects
══════════════════════════════════════════════════════════════ */

// ── Full timezone dataset (searchable) ───────────────────────
const ALL_ZONES = [
  { id:'lon',  city:'London',        region:'Europe',       off:1,    label:'GMT+1 / BST',  color:'#4f8ef7', pill:'wp-lon' },
  { id:'nyc',  city:'New York',      region:'Americas',     off:-4,   label:'UTC-4 / EDT',  color:'#f5a623', pill:'wp-nyc' },
  { id:'tok',  city:'Tokyo',         region:'Asia',         off:9,    label:'UTC+9 / JST',  color:'#a78bfa', pill:'wp-tok' },
  { id:'syd',  city:'Sydney',        region:'Pacific',      off:10,   label:'UTC+10 / AEST',color:'#34d399', pill:'wp-syd' },
  { id:'mum',  city:'Mumbai',        region:'Asia',         off:5.5,  label:'UTC+5:30 / IST',color:'#fb7185', pill:null    },
  { id:'dxb',  city:'Dubai',         region:'Middle East',  off:4,    label:'UTC+4 / GST',  color:'#fbbf24', pill:null    },
  { id:'ber',  city:'Berlin',        region:'Europe',       off:2,    label:'UTC+2 / CEST', color:'#60a5fa', pill:null    },
  { id:'lax',  city:'Los Angeles',   region:'Americas',     off:-7,   label:'UTC-7 / PDT',  color:'#f97316', pill:null    },
  { id:'cal',  city:'Calcutta',      region:'Asia',         off:5.5,  label:'UTC+5:30 / IST',color:'#f472b6', pill:null   },
  { id:'sin',  city:'Singapore',     region:'Asia',         off:8,    label:'UTC+8 / SGT',  color:'#2dd4bf', pill:null    },
  { id:'hkg',  city:'Hong Kong',     region:'Asia',         off:8,    label:'UTC+8 / HKT',  color:'#818cf8', pill:null    },
  { id:'seo',  city:'Seoul',         region:'Asia',         off:9,    label:'UTC+9 / KST',  color:'#c084fc', pill:null    },
  { id:'ban',  city:'Bangkok',       region:'Asia',         off:7,    label:'UTC+7 / ICT',  color:'#4ade80', pill:null    },
  { id:'kar',  city:'Karachi',       region:'Asia',         off:5,    label:'UTC+5 / PKT',  color:'#facc15', pill:null    },
  { id:'dha',  city:'Dhaka',         region:'Asia',         off:6,    label:'UTC+6 / BST',  color:'#fb923c', pill:null    },
  { id:'col',  city:'Colombo',       region:'Asia',         off:5.5,  label:'UTC+5:30 / IST',color:'#e879f9', pill:null   },
  { id:'par',  city:'Paris',         region:'Europe',       off:2,    label:'UTC+2 / CEST', color:'#38bdf8', pill:null    },
  { id:'mos',  city:'Moscow',        region:'Europe',       off:3,    label:'UTC+3 / MSK',  color:'#f87171', pill:null    },
  { id:'ist',  city:'Istanbul',      region:'Europe',       off:3,    label:'UTC+3 / TRT',  color:'#fb923c', pill:null    },
  { id:'cai',  city:'Cairo',         region:'Africa',       off:2,    label:'UTC+2 / EET',  color:'#fde68a', pill:null    },
  { id:'lag',  city:'Lagos',         region:'Africa',       off:1,    label:'UTC+1 / WAT',  color:'#6ee7b7', pill:null    },
  { id:'nai',  city:'Nairobi',       region:'Africa',       off:3,    label:'UTC+3 / EAT',  color:'#5eead4', pill:null    },
  { id:'joh',  city:'Johannesburg',  region:'Africa',       off:2,    label:'UTC+2 / SAST', color:'#a3e635', pill:null    },
  { id:'sao',  city:'São Paulo',     region:'Americas',     off:-3,   label:'UTC-3 / BRT',  color:'#34d399', pill:null    },
  { id:'bue',  city:'Buenos Aires',  region:'Americas',     off:-3,   label:'UTC-3 / ART',  color:'#60a5fa', pill:null    },
  { id:'mex',  city:'Mexico City',   region:'Americas',     off:-5,   label:'UTC-5 / CDT',  color:'#f97316', pill:null    },
  { id:'chi',  city:'Chicago',       region:'Americas',     off:-5,   label:'UTC-5 / CDT',  color:'#fb7185', pill:null    },
  { id:'den',  city:'Denver',        region:'Americas',     off:-6,   label:'UTC-6 / MDT',  color:'#a78bfa', pill:null    },
  { id:'van',  city:'Vancouver',     region:'Americas',     off:-7,   label:'UTC-7 / PDT',  color:'#fbbf24', pill:null    },
  { id:'tor',  city:'Toronto',       region:'Americas',     off:-4,   label:'UTC-4 / EDT',  color:'#4f8ef7', pill:null    },
  { id:'hou',  city:'Houston',       region:'Americas',     off:-5,   label:'UTC-5 / CDT',  color:'#f5a623', pill:null    },
  { id:'auc',  city:'Auckland',      region:'Pacific',      off:12,   label:'UTC+12 / NZST',color:'#2dd4bf', pill:null   },
  { id:'mel',  city:'Melbourne',     region:'Pacific',      off:10,   label:'UTC+10 / AEST',color:'#818cf8', pill:null   },
  { id:'per',  city:'Perth',         region:'Pacific',      off:8,    label:'UTC+8 / AWST', color:'#c084fc', pill:null    },
  { id:'hon',  city:'Honolulu',      region:'Pacific',      off:-10,  label:'UTC-10 / HST', color:'#4ade80', pill:null    },
  { id:'ank',  city:'Anchorage',     region:'Americas',     off:-8,   label:'UTC-8 / AKDT', color:'#38bdf8', pill:null    },
  { id:'utc',  city:'UTC',           region:'Universal',    off:0,    label:'UTC+0',         color:'#94a3b8', pill:null    },
];

// Active zones shown in sidebar (top 5)
const SIDEBAR_ZONE_IDS = ['lon','nyc','tok','syd','mum'];
const ZONES = ALL_ZONES.filter(z => SIDEBAR_ZONE_IDS.includes(z.id));

// ── Active timezone state ─────────────────────────────────────
let activeZone = { city:'Calcutta', region:'India', off:5.5, label:'IST +5:30', color:'#f472b6' };

// ── CRT code snippets ─────────────────────────────────────────
const CODE_SNIPPETS = [
  'C:\\KRONOS> run clock.c',
  '#include <stdio.h>',
  '#include <time.h>',
  '',
  'int main() {',
  '  time_t now = time(0);',
  '  struct tm *t;',
  '  t = localtime(&now);',
  '  printf("Time: %02d:%02d",',
  '    t->tm_hour,',
  '    t->tm_min);',
  '  return 0;',
  '}',
  '',
  'C:\\KRONOS> gcc clock.c',
  'C:\\KRONOS> clock.exe',
  'Time: 00:28',
  '',
  'C:\\KRONOS> _',
];

// ── Helpers ───────────────────────────────────────────────────
function getT(off) {
  const n = new Date();
  return new Date(n.getTime() + n.getTimezoneOffset() * 60000 + off * 3600000);
}
function pad(n) { return String(n).padStart(2, '0'); }
function fmt12(d) {
  let h = d.getHours(), m = d.getMinutes(), s = d.getSeconds();
  const a = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${pad(h)}:${pad(m)}:${pad(s)} ${a}`;
}
function fmt12s(d) {
  let h = d.getHours(), m = d.getMinutes();
  const a = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${pad(h)}:${pad(m)} ${a}`;
}
function tod(h) {
  if (h >= 5  && h < 12) return { l:'Morning',   c:'tp-morn',  i:'🌅' };
  if (h >= 12 && h < 17) return { l:'Afternoon', c:'tp-day',   i:'☀️' };
  if (h >= 17 && h < 21) return { l:'Evening',   c:'tp-eve',   i:'🌆' };
  return                         { l:'Night',     c:'tp-night', i:'🌙' };
}
function fmtDate(d) {
  return d.toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' });
}
function offsetLabel(off) {
  const sign = off >= 0 ? '+' : '-';
  const abs = Math.abs(off);
  const h = Math.floor(abs);
  const m = Math.round((abs - h) * 60);
  return m > 0 ? `UTC${sign}${h}:${pad(m)}` : `UTC${sign}${h}`;
}

// ── Sky phase ─────────────────────────────────────────────────
function skyPhase(h) {
  if (h >= 0  && h < 5)  return 'night';
  if (h >= 5  && h < 7)  return 'dawn';
  if (h >= 7  && h < 11) return 'morning';
  if (h >= 11 && h < 14) return 'noon';
  if (h >= 14 && h < 18) return 'afternoon';
  if (h >= 18 && h < 21) return 'evening';
  return 'night';
}

// ── Sun position ──────────────────────────────────────────────
function sunPosition(h) {
  if (h < 5 || h >= 20) return { top: 240, left: -60, opacity: 0 };
  const t = (h - 5) / 15;
  const top  = 140 - (140 - 18) * Math.sin(Math.PI * t);
  const left = 30 + t * 580;
  let opacity = 1;
  if (h < 6)  opacity = (h - 5);
  if (h >= 19) opacity = (20 - h);
  return { top: Math.round(top), left: Math.round(left), opacity: Math.max(0, Math.min(1, opacity)) };
}

// ── Dynamic sky updater ───────────────────────────────────────
function updateSky() {
  const active = getT(activeZone.off);
  const h = active.getHours();
  const phase = skyPhase(h);

  const sky      = document.getElementById('sky');
  const skyGrad  = document.getElementById('sky-grad');
  const stars    = document.getElementById('stars');
  const moonWrap = document.getElementById('moon-wrap');
  const moonlight= document.getElementById('moonlight');
  const sunWrap  = document.getElementById('sun-wrap');
  const clouds   = [
    document.getElementById('cloud1'),
    document.getElementById('cloud2'),
    document.getElementById('cloud3'),
  ];
  const locIcon  = document.getElementById('loc-icon');
  const winFrame = document.querySelector('.win-frame');
  const panes    = document.querySelectorAll('.pane');
  const wall     = document.querySelector('.wall');

  if (sky)     sky.className     = `sky sky-${phase}`;
  if (skyGrad) skyGrad.className = `sky-grad sky-${phase}-grad`;

  const showNight = (phase === 'night' || phase === 'dawn');
  if (stars)     stars.classList.toggle('hidden', !showNight);
  if (moonWrap)  moonWrap.classList.toggle('hidden', !showNight);
  if (moonlight) moonlight.classList.toggle('hidden', !showNight);

  const moonShadow = document.querySelector('.moon-shadow');
  if (moonShadow) moonShadow.style.background = phase === 'night' ? '#050810' : '#1a0a28';

  if (sunWrap) {
    const pos = sunPosition(h);
    sunWrap.style.top     = pos.top  + 'px';
    sunWrap.style.left    = pos.left + 'px';
    sunWrap.style.opacity = pos.opacity;
    sunWrap.classList.toggle('visible', pos.opacity > 0);
  }

  const cloudClass = { night:'night-cloud', dawn:'dawn-cloud', morning:'day-cloud', noon:'day-cloud', afternoon:'day-cloud', evening:'eve-cloud' }[phase] || 'night-cloud';
  clouds.forEach(c => { if (c) c.className = `cloud ${cloudClass}`; });

  const paneClass = { night:'', dawn:'dawn-pane', morning:'morn-pane', noon:'day-pane', afternoon:'day-pane', evening:'eve-pane' }[phase] || '';
  panes.forEach(p => {
    p.classList.remove('day-pane','morn-pane','eve-pane','dawn-pane');
    if (paneClass) p.classList.add(paneClass);
    p.querySelectorAll('.pane-star').forEach(s => { s.style.opacity = showNight ? '' : '0'; });
  });

  if (winFrame) winFrame.classList.toggle('day-window', phase !== 'night');
  if (wall)     wall.classList.toggle('day-wall', phase !== 'night');

  if (locIcon) {
    const icons = { night:'🌙', dawn:'🌅', morning:'🌤', noon:'☀️', afternoon:'⛅', evening:'🌆' };
    locIcon.textContent = icons[phase] || '🌙';
  }
}

// ── Switch active timezone ────────────────────────────────────
function switchTimezone(zone) {
  activeZone = zone;

  // Update sidebar hero
  const azCity = document.getElementById('az-city');
  const locCityName = document.getElementById('loc-city-name');
  const locOffset   = document.getElementById('loc-offset');
  if (azCity) azCity.textContent = `${zone.city}${zone.region ? ', ' + zone.region : ''}`;
  if (locCityName) locCityName.textContent = zone.city;
  if (locOffset) locOffset.textContent = offsetLabel(zone.off);

  // Highlight active card
  document.querySelectorAll('.cc').forEach(c => c.classList.remove('cc-active'));
  const activeCard = document.getElementById('cc-' + zone.id);
  if (activeCard) activeCard.classList.add('cc-active');

  updateSky();
  tick();
}

// ── Build star field ──────────────────────────────────────────
function buildStars() {
  const container = document.getElementById('stars');
  for (let i = 0; i < 90; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.cssText = `
      width:${(Math.random()*2+0.5).toFixed(1)}px;
      height:${(Math.random()*2+0.5).toFixed(1)}px;
      top:${(Math.random()*60).toFixed(2)}%;
      left:${(Math.random()*100).toFixed(2)}%;
      --d:${(Math.random()*3+2).toFixed(1)}s;
      --dl:-${(Math.random()*4).toFixed(1)}s;
      --o:${(Math.random()*0.55+0.15).toFixed(2)};
    `;
    container.appendChild(s);
  }
}

// ── Build sidebar clock cards ─────────────────────────────────
function buildSidebarClocks() {
  const grid = document.getElementById('clocks');
  ZONES.forEach(z => {
    const d = getT(z.off);
    const t = tod(d.getHours());
    const card = document.createElement('div');
    card.className = 'cc';
    card.id = 'cc-' + z.id;
    card.style.setProperty('--ac', z.color);
    card.title = `Switch to ${z.city} time`;
    card.innerHTML = `
      <div class="cc-top">
        <div>
          <div class="cc-city">${z.city}</div>
          <div class="cc-tz">${z.label || offsetLabel(z.off)}</div>
        </div>
        <span style="font-size:13px">${t.i}</span>
      </div>
      <div class="cc-time" id="ct-${z.id}">${fmt12s(d)}</div>
      <div class="cc-bot">
        <span class="cc-per" style="color:${z.color}">${t.l}</span>
        <div class="cc-dot" style="background:${z.color}"></div>
      </div>
    `;
    card.addEventListener('click', () => switchTimezone(z));
    grid.appendChild(card);
  });
}

// ── Build timezone drawer ─────────────────────────────────────
function buildDrawer() {
  const list = document.getElementById('tz-list');
  ALL_ZONES.forEach(z => {
    const d = getT(z.off);
    const t = tod(d.getHours());
    const card = document.createElement('div');
    card.className = 'tz-card';
    card.id = 'tzc-' + z.id;
    card.style.setProperty('--ac', z.color);
    card.title = `Switch to ${z.city}`;
    card.innerHTML = `
      <div class="tz-city">${z.city}<span class="tz-region"> · ${z.region}</span></div>
      <div class="tz-offset">${z.label || offsetLabel(z.off)}</div>
      <div class="tz-time" id="tzt-${z.id}">${fmt12s(d)}</div>
      <div class="tz-row">
        <span class="tz-per" style="color:${z.color}">${t.l}</span>
        <div class="tz-dot" style="background:${z.color}"></div>
      </div>
    `;
    card.addEventListener('click', () => {
      switchTimezone(z);
      closeDrawer();
    });
    list.appendChild(card);
  });
}

// ── Clock tick ────────────────────────────────────────────────
function tick() {
  const active = getT(activeZone.off);
  const t = tod(active.getHours());

  const heroT = document.getElementById('hero-t');
  const heroD = document.getElementById('hero-d');
  const pill  = document.getElementById('az-pill');

  if (heroT) heroT.textContent = fmt12(active);
  if (heroD) heroD.textContent = fmtDate(active);
  if (pill)  { pill.textContent = t.l; pill.className = 'tod-pill ' + t.c; }

  ALL_ZONES.forEach(z => {
    const d = getT(z.off);
    if (z.pill) {
      const el = document.getElementById(z.pill);
      if (el) el.textContent = fmt12s(d);
    }
    const ct = document.getElementById('ct-' + z.id);
    if (ct) ct.textContent = fmt12s(d);
    const tzt = document.getElementById('tzt-' + z.id);
    if (tzt) tzt.textContent = fmt12s(d);
  });

  updateSky();
}

// ══════════════════════════════════════════════════════════════
//  TIMEZONE SEARCH
// ══════════════════════════════════════════════════════════════
function initSearch() {
  const input   = document.getElementById('tz-search');
  const results = document.getElementById('search-results');
  const clearBtn= document.getElementById('search-clear');

  function renderResults(query) {
    const q = query.trim().toLowerCase();
    results.innerHTML = '';
    if (!q) { results.classList.remove('open'); return; }

    const matches = ALL_ZONES.filter(z =>
      z.city.toLowerCase().includes(q) ||
      z.region.toLowerCase().includes(q) ||
      (z.label || '').toLowerCase().includes(q) ||
      offsetLabel(z.off).toLowerCase().includes(q)
    ).slice(0, 8);

    if (!matches.length) {
      results.innerHTML = '<div class="sr-empty">No results for "' + escHtml(query) + '"</div>';
      results.classList.add('open');
      return;
    }

    matches.forEach(z => {
      const d  = getT(z.off);
      const t  = tod(d.getHours());
      const row = document.createElement('div');
      row.className = 'sr-row';
      row.innerHTML = `
        <div class="sr-dot" style="background:${z.color}"></div>
        <div class="sr-info">
          <span class="sr-city">${z.city}</span>
          <span class="sr-region">${z.region}</span>
        </div>
        <div class="sr-right">
          <span class="sr-time">${fmt12s(d)}</span>
          <span class="sr-offset">${offsetLabel(z.off)}</span>
        </div>
      `;
      row.addEventListener('click', () => {
        switchTimezone(z);
        input.value = '';
        results.classList.remove('open');
        clearBtn.classList.remove('visible');
      });
      results.appendChild(row);
    });
    results.classList.add('open');
  }

  input.addEventListener('input', () => {
    clearBtn.classList.toggle('visible', input.value.length > 0);
    renderResults(input.value);
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    results.classList.remove('open');
    clearBtn.classList.remove('visible');
    input.focus();
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('.tz-search-wrap')) {
      results.classList.remove('open');
    }
  });
}

// ══════════════════════════════════════════════════════════════
//  RAIN SYSTEM
// ══════════════════════════════════════════════════════════════
let rainActive  = false;
let rainAnimId  = null;
let rainDrops   = [];

// ── Rain sound (Web Audio API) ────────────────────────────────
let rainAudioCtx = null;
let rainNodes    = [];

function startRainSound() {
  if (rainAudioCtx) return;
  rainAudioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const master = rainAudioCtx.createGain();
  master.gain.setValueAtTime(0, rainAudioCtx.currentTime);
  master.gain.linearRampToValueAtTime(0.5, rainAudioCtx.currentTime + 1.5);
  master.connect(rainAudioCtx.destination);

  // White noise — rain hiss
  function makeNoise(gainVal, filterFreq, filterQ, filterType) {
    const bufSize = rainAudioCtx.sampleRate * 3;
    const buf  = rainAudioCtx.createBuffer(1, bufSize, rainAudioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const src    = rainAudioCtx.createBufferSource();
    src.buffer   = buf;
    src.loop     = true;
    const filter = rainAudioCtx.createBiquadFilter();
    filter.type           = filterType || 'lowpass';
    filter.frequency.value = filterFreq;
    filter.Q.value         = filterQ;
    const gain = rainAudioCtx.createGain();
    gain.gain.value = gainVal;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    src.start();
    rainNodes.push(src, filter, gain);
  }

  makeNoise(0.25, 5000, 1.5, 'bandpass'); // rain sizzle
  makeNoise(0.12, 300,  0.5, 'lowpass');  // rain rumble
  makeNoise(0.06, 80,   0.3, 'lowpass');  // distant thunder hum

  // Droplet pings on surfaces
  function scheduleDroplet() {
    if (!rainActive || !rainAudioCtx) return;
    const delay = 0.08 + Math.random() * 0.4;
    const freq  = [800, 1000, 1200, 1600, 2000][Math.floor(Math.random() * 5)];
    const t     = rainAudioCtx.currentTime + delay;

    const osc = rainAudioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, t + 0.15);

    const g = rainAudioCtx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.015 + Math.random() * 0.01, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);

    osc.connect(g);
    g.connect(master);
    osc.start(t);
    osc.stop(t + 0.25);

    setTimeout(scheduleDroplet, delay * 1000);
  }
  scheduleDroplet();

  rainNodes.push(master);
}

function stopRainSound() {
  if (!rainAudioCtx) return;
  const master = rainNodes[rainNodes.length - 1];
  if (master && master.gain) {
    master.gain.linearRampToValueAtTime(0, rainAudioCtx.currentTime + 1.5);
  }
  setTimeout(() => {
    rainNodes.forEach(n => { try { n.stop && n.stop(); n.disconnect && n.disconnect(); } catch(e){} });
    rainNodes = [];
    if (rainAudioCtx) { rainAudioCtx.close(); rainAudioCtx = null; }
  }, 1700);
}

function initRain() {
  const canvas = document.getElementById('rain-canvas');
  const scene  = document.querySelector('.scene');
  if (!canvas || !scene) return;

  function resize() {
    canvas.width  = scene.clientWidth;
    canvas.height = scene.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const ctx = canvas.getContext('2d');

  function spawnDrop() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height * 0.3,
      len: Math.random() * 14 + 8,
      speed: Math.random() * 6 + 10,
      opacity: Math.random() * 0.45 + 0.15,
      width: Math.random() * 0.6 + 0.3,
    };
  }

  function populateDrops() {
    rainDrops = [];
    const count = Math.floor((canvas.width * canvas.height) / 3800);
    for (let i = 0; i < count; i++) {
      const d = spawnDrop();
      d.y = Math.random() * canvas.height;
      rainDrops.push(d);
    }
  }

  function drawRain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rainDrops.forEach(d => {
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - d.len * 0.18, d.y + d.len);
      ctx.strokeStyle = `rgba(174, 214, 241, ${d.opacity})`;
      ctx.lineWidth   = d.width;
      ctx.stroke();
      d.y += d.speed;
      d.x -= d.speed * 0.18;
      if (d.y > canvas.height + d.len) Object.assign(d, spawnDrop());
    });
    rainAnimId = requestAnimationFrame(drawRain);
  }

  function startRain() {
    populateDrops();
    canvas.classList.add('raining');
    drawRain();
    startRainSound();
  }

  function stopRain() {
    canvas.classList.remove('raining');
    if (rainAnimId) { cancelAnimationFrame(rainAnimId); rainAnimId = null; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stopRainSound();
  }

  window._toggleRain = function() {
    rainActive = !rainActive;
    if (rainActive) startRain(); else stopRain();
    return rainActive;
  };
}

function initRainBtn() {
  const btn = document.getElementById('rain-toggle-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const on = window._toggleRain ? window._toggleRain() : false;
    btn.classList.toggle('active', on);
    btn.title = on ? 'Stop Rain' : 'Start Rain';

    const clouds = [
      document.getElementById('cloud1'),
      document.getElementById('cloud2'),
      document.getElementById('cloud3'),
    ];
    if (on) {
      clouds.forEach(c => {
        if (c) { c.style.background = 'rgba(80,90,110,.65)'; c.style.filter = 'blur(12px)'; c.style.boxShadow = 'none'; }
      });
      const sky = document.getElementById('sky');
      if (sky) sky.style.filter = 'brightness(0.75)';
    } else {
      clouds.forEach(c => {
        if (c) { c.style.background = ''; c.style.filter = ''; c.style.boxShadow = ''; }
      });
      const sky = document.getElementById('sky');
      if (sky) sky.style.filter = '';
    }
  });
}

// ══════════════════════════════════════════════════════════════
//  AMBIENT MUSIC
// ══════════════════════════════════════════════════════════════
let audioCtx    = null;
let musicActive = false;
const audioNodes = [];

function createAmbientAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.0, audioCtx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.55, audioCtx.currentTime + 3);
  masterGain.connect(audioCtx.destination);
  audioNodes.push(masterGain);

  function makeNoise(gainVal, filterFreq, filterQ, filterType) {
    const bufSize = audioCtx.sampleRate * 4;
    const buf  = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const src    = audioCtx.createBufferSource();
    src.buffer   = buf;
    src.loop     = true;
    const filter = audioCtx.createBiquadFilter();
    filter.type           = filterType || 'lowpass';
    filter.frequency.value = filterFreq;
    filter.Q.value         = filterQ;
    const gain = audioCtx.createGain();
    gain.gain.value = gainVal;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    src.start();
    audioNodes.push(src, filter, gain);
  }

  makeNoise(0.08, 280,  0.5, 'lowpass');
  makeNoise(0.05, 4000, 1.2, 'bandpass');
  makeNoise(0.04, 80,   0.3, 'lowpass');

  const DRONE_NOTES = [55, 82.5, 110, 146.8];
  DRONE_NOTES.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    osc.type  = 'sine';
    osc.frequency.value = freq;
    osc.detune.value = (Math.random() - 0.5) * 8;
    const g = audioCtx.createGain();
    g.gain.value = 0.018 - i * 0.003;
    const lfo = audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.04 + i * 0.012;
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 0.006;
    lfo.connect(lfoGain);
    lfoGain.connect(g.gain);
    lfo.start();
    osc.connect(g);
    g.connect(masterGain);
    osc.start();
    audioNodes.push(osc, g, lfo, lfoGain);
  });

  function schedulePing() {
    if (!musicActive) return;
    const delay = 1.2 + Math.random() * 4.8;
    const freq  = [523, 659, 784, 880, 1047, 1175][Math.floor(Math.random() * 6)];
    const t     = audioCtx.currentTime + delay;
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.6, t + 0.8);
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.04, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
    osc.connect(g);
    g.connect(masterGain);
    osc.start(t);
    osc.stop(t + 1.3);
    setTimeout(schedulePing, delay * 1000);
  }
  schedulePing();

  function scheduleChirp() {
    if (!musicActive) return;
    const h = getT(activeZone.off).getHours();
    const isDay = h >= 6 && h < 18;
    const delay = isDay ? (2 + Math.random() * 7) : (8 + Math.random() * 14);
    const t     = audioCtx.currentTime + delay;
    if (isDay) {
      const baseFreq = 1800 + Math.random() * 600;
      [0, 0.12].forEach((offset, i) => {
        const osc = audioCtx.createOscillator();
        osc.type  = 'sine';
        const f   = baseFreq * (i === 0 ? 1 : 1.25);
        osc.frequency.setValueAtTime(f, t + offset);
        osc.frequency.exponentialRampToValueAtTime(f * 1.12, t + offset + 0.07);
        const g = audioCtx.createGain();
        g.gain.setValueAtTime(0, t + offset);
        g.gain.linearRampToValueAtTime(0.025, t + offset + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + offset + 0.15);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(t + offset);
        osc.stop(t + offset + 0.18);
      });
    }
    setTimeout(scheduleChirp, delay * 1000);
  }
  scheduleChirp();
}

function stopAmbientAudio() {
  if (!audioCtx) return;
  const g = audioNodes[0];
  if (g && g.gain) g.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 2);
  setTimeout(() => {
    audioNodes.forEach(n => { try { n.stop && n.stop(); n.disconnect && n.disconnect(); } catch(e){} });
    audioNodes.length = 0;
    audioCtx.close();
    audioCtx = null;
  }, 2200);
}

function initMusicBtn() {
  const btn = document.getElementById('music-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    musicActive = !musicActive;
    btn.classList.toggle('active', musicActive);
    btn.textContent = musicActive ? '🔊' : '🔇';
    btn.title = musicActive ? 'Stop Ambient Music' : 'Play Ambient Music';
    if (musicActive) createAmbientAudio(); else stopAmbientAudio();
  });
}

// ── CRT code typer ────────────────────────────────────────────
let codeIdx = 0;
function colorCodeLine(txt) {
  if (txt === '') return '&nbsp;';
  if (txt === 'C:\\KRONOS> _') return `<span class="prompt-col">C:\\KRONOS&gt; </span><span class="crt-cursor"></span>`;
  if (txt.startsWith('C:\\')) return `<span class="prompt-col">${escHtml(txt)}</span>`;
  const KEYWORDS = ['int','struct','return','time_t','printf','localtime','main','include'];
  let html = escHtml(txt);
  KEYWORDS.forEach(kw => { html = html.replace(new RegExp(`\\b(${kw})\\b`, 'g'), `<span class="crt-kw">$1</span>`); });
  html = html.replace(/&quot;([^&]*)&quot;/g, (_, inner) => `<span class="crt-str">&quot;${inner}&quot;</span>`);
  html = html.replace(/^(#include)/, '<span class="crt-kw">#include</span>');
  return html;
}
function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function typeNextLine() {
  const area = document.getElementById('code-area');
  if (!area) return;
  while (area.children.length >= 11) area.removeChild(area.firstChild);
  const txt  = CODE_SNIPPETS[codeIdx % CODE_SNIPPETS.length];
  codeIdx++;
  const line = document.createElement('span');
  line.className = 'crt-line';
  line.innerHTML = colorCodeLine(txt);
  area.appendChild(line);
  const delay = txt === '' ? 300 : txt.startsWith('C:\\') ? 950 : 260;
  setTimeout(typeNextLine, delay);
}

// ── Timezone drawer ───────────────────────────────────────────
function closeDrawer() {
  document.getElementById('tz-drawer')?.classList.remove('open');
  document.getElementById('overlay')?.classList.remove('show');
}

function initDrawer() {
  const drawer  = document.getElementById('tz-drawer');
  const overlay = document.getElementById('overlay');
  const openBtn = document.getElementById('tz-toggle-btn');
  const closeBtn= document.getElementById('tz-close');

  openBtn.addEventListener('click', () => { drawer.classList.add('open'); overlay.classList.add('show'); });
  closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', () => {
    closeDrawer();
    document.getElementById('settings-modal')?.classList.remove('open');
  });
}

// ── Settings modal ────────────────────────────────────────────
function initSettings() {
  const btn   = document.getElementById('settings-btn');
  const modal = document.getElementById('settings-modal');
  const close = document.getElementById('settings-close');
  if (!btn || !modal) return;

  btn.addEventListener('click', () => {
    modal.classList.toggle('open');
  });
  close.addEventListener('click', () => {
    modal.classList.remove('open');
  });
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildStars();
  buildSidebarClocks();
  buildDrawer();
  initDrawer();
  initSearch();
  initRain();
  initRainBtn();
  initMusicBtn();
  initSettings();
  tick();
  setInterval(tick, 1000);
  setTimeout(typeNextLine, 500);
});
