/* ---------------------------------------------------------------
   Cute vector engine. Everything draws inside a 120 x 120 box.
   Shapes are flat, chunky and rounded: no hairlines, no gradients
   except one soft ground blob, so the art stays readable at the
   size a five-year-old actually looks at it.
----------------------------------------------------------------*/
const A = {}; // art registry: word -> [family, params]

const n = (v) => (Math.round(v * 100) / 100);
const at = (o) => Object.keys(o).map(k => ` ${k}="${o[k]}"`).join('');

const C  = (x, y, r, f, o = {}) => `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="${f}"${at(o)}/>`;
const E  = (x, y, rx, ry, f, o = {}) => `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(rx)}" ry="${n(ry)}" fill="${f}"${at(o)}/>`;
const R  = (x, y, w, h, r, f, o = {}) => `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${n(r)}" fill="${f}"${at(o)}/>`;
const P  = (d, f, o = {}) => `<path d="${d}" fill="${f}"${at(o)}/>`;
const S  = (d, st, w, o = {}) => `<path d="${d}" fill="none" stroke="${st}" stroke-width="${n(w)}" stroke-linecap="round" stroke-linejoin="round"${at(o)}/>`;
const PG = (pts, f, o = {}) => `<polygon points="${pts}" fill="${f}"${at(o)}/>`;
const G  = (kids, tf) => `<g${tf ? ` transform="${tf}"` : ''}>${Array.isArray(kids) ? kids.join('') : kids}</g>`;
const rot = (a, x, y) => `rotate(${n(a)} ${n(x)} ${n(y)})`;

/* deterministic per-word jitter so no two cards sit at the same angle */
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0);
}
const rnd = (seed, i) => ((hash(seed + '#' + i) % 1000) / 1000);
const pick = (seed, i, arr) => arr[hash(seed + '#' + i) % arr.length];

/* ---- the cute face -------------------------------------------
   x,y = centre between the eyes. s = scale (1 ≈ 26px wide face).
   eye:  'dot' | 'happy' | 'sparkle' | 'wink' | 'sleep' | 'wide'
   mouth:'smile' | 'open' | 'cat' | 'flat' | 'oh' | 'grin' | 'none'
----------------------------------------------------------------*/
function face(x, y, s = 1, o = {}) {
  const eye = o.eye || 'sparkle';
  const mouth = o.mouth || 'smile';
  const ink = o.ink || '#3B2C2A';
  const gap = (o.gap || 9) * s;
  const out = [];

  const oneEye = (ex, flip) => {
    if (eye === 'happy') return S(`M${n(ex - 4 * s)} ${n(y + 1.5 * s)} q${n(4 * s)} ${n(-6 * s)} ${n(8 * s)} 0`, ink, 2.4 * s);
    if (eye === 'sleep') return S(`M${n(ex - 4 * s)} ${n(y)} q${n(4 * s)} ${n(5 * s)} ${n(8 * s)} 0`, ink, 2.4 * s);
    if (eye === 'wink' && flip) return S(`M${n(ex - 4 * s)} ${n(y + 1 * s)} q${n(4 * s)} ${n(-5 * s)} ${n(8 * s)} 0`, ink, 2.4 * s);
    const r = eye === 'wide' ? 5 * s : 4 * s;
    return C(ex, y, r, ink) + C(ex + 1.3 * s, y - 1.4 * s, r * 0.36, '#fff');
  };
  out.push(oneEye(x - gap, false), oneEye(x + gap, true));

  if (o.cheek !== false) {
    const ck = o.cheek || '#FF9DB0';
    out.push(E(x - gap - 6 * s, y + 6.5 * s, 4.2 * s, 2.8 * s, ck, { opacity: .75 }));
    out.push(E(x + gap + 6 * s, y + 6.5 * s, 4.2 * s, 2.8 * s, ck, { opacity: .75 }));
  }

  const my = y + 8.5 * s;
  if (mouth === 'smile') out.push(S(`M${n(x - 4.5 * s)} ${n(my - 1 * s)} q${n(4.5 * s)} ${n(4.5 * s)} ${n(9 * s)} 0`, ink, 2.2 * s));
  else if (mouth === 'grin') out.push(P(`M${n(x - 6 * s)} ${n(my - 1.5 * s)} q${n(6 * s)} ${n(8 * s)} ${n(12 * s)} 0 z`, ink));
  else if (mouth === 'open') out.push(E(x, my + 1 * s, 4 * s, 4.6 * s, ink) + E(x, my + 3 * s, 2.4 * s, 2 * s, '#FF7B8E'));
  else if (mouth === 'oh') out.push(E(x, my + 1 * s, 3 * s, 3.6 * s, ink));
  else if (mouth === 'cat') out.push(S(`M${n(x - 5 * s)} ${n(my - 1 * s)} q${n(2.5 * s)} ${n(3.2 * s)} ${n(5 * s)} 0 q${n(2.5 * s)} ${n(3.2 * s)} ${n(5 * s)} 0`, ink, 2.1 * s));
  else if (mouth === 'flat') out.push(S(`M${n(x - 4 * s)} ${n(my)} h${n(8 * s)}`, ink, 2.2 * s));
  return out.join('');
}

/* soft ground blob behind every subject */
function ground(seed, tint) {
  const a = -14 + rnd(seed, 7) * 28;
  const rx = 46 + rnd(seed, 8) * 6, ry = 44 + rnd(seed, 9) * 6;
  return G([E(60, 62, rx, ry, tint, { opacity: .92 })], rot(a, 60, 62));
}

/* a few reusable bits */
const shine = (x, y, r) => E(x, y, r * .55, r * .38, '#fff', { opacity: .45, transform: rot(-30, x, y) });
const leaf = (x, y, s, c = '#5FBF6A', a = -30) =>
  G([P(`M${x} ${y} q${8 * s} ${-9 * s} ${17 * s} ${-3 * s} q${-8 * s} ${9 * s} ${-17 * s} ${3 * s} z`, c)], rot(a, x, y));
const stemUp = (x, y, h, c = '#8A6244', w = 4) => S(`M${x} ${y} q${w * .3} ${-h / 2} 0 ${-h}`, c, w);
