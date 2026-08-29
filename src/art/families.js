/* ---- colour helpers ------------------------------------------ */
function shade(hex, amt) { // amt > 0 lighter, < 0 darker
  const h = hex.replace('#', '');
  const v = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const num = parseInt(v, 16);
  let r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
  const f = (c) => Math.max(0, Math.min(255, Math.round(amt > 0 ? c + (255 - c) * amt : c * (1 + amt))));
  return '#' + [f(r), f(g), f(b)].map(c => c.toString(16).padStart(2, '0')).join('');
}
const tint = (hex) => shade(hex, .72);

/* ================= ANIMAL ======================================
   A sitting creature portrait: big head, small body, cute face.
================================================================= */
function animal(p, seed) {
  const f = p.f || '#C8956C';
  const f2 = p.f2 || shade(f, .38);
  const dk = shade(f, -.22);
  const ink = p.ink || '#3B2C2A';
  const hx = 60, hy = p.hy || 50, hr = p.hr || 27;
  const out = [];

  /* --- tail (behind) --- */
  const t = p.tail;
  if (t === 'curl') out.push(S(`M${hx + 20} 92 q14 4 12 -8 q-2 -8 -8 -5`, dk, 6));
  else if (t === 'bush') out.push(G([E(0, 0, 9, 15, p.tc || f)], `translate(${hx + 24} 84) rotate(28)`) + E(hx + 26, 76, 6, 8, p.tc2 || f2));
  else if (t === 'thin') out.push(S(`M${hx + 18} 94 q18 0 16 -16`, dk, 4));
  else if (t === 'long') out.push(S(`M${hx + 18} 92 q22 2 18 -20`, f, 7));
  else if (t === 'stub') out.push(C(hx + 22, 90, 6, f2));
  else if (t === 'fan') out.push(G([P('M0 0 q18 -14 30 2 q-16 12 -30 -2 z', p.tc || f2)], `translate(${hx + 16} 86)`));

  /* --- body --- */
  if (p.body !== false) {
    out.push(E(hx, 90, p.bw || 23, p.bh || 20, p.bc || f));
    out.push(E(hx, 95, (p.bw || 23) * .58, (p.bh || 20) * .55, p.bc2 || f2));
    const px = (p.bw || 23) * .72;
    out.push(E(hx - px, 104, 8, 6, p.pawc || f2), E(hx + px, 104, 8, 6, p.pawc || f2));
  }

  /* --- ears (behind head) --- */
  const ec = p.earc || f, ei = p.eari || (p.f2 ? shade(f2, .1) : '#FFB3C0');
  const ear = p.ear || 'round';
  const eo = hr * .74, ey = hy - hr * .74;
  const mkEar = (sx) => {
    const x = hx + sx * eo;
    if (ear === 'round') return C(x, ey - 4, 10, ec) + C(x, ey - 4, 5, ei);
    if (ear === 'wide') return E(x + sx * 4, ey + 2, 11, 8, ec) + E(x + sx * 4, ey + 2, 6, 4, ei);
    if (ear === 'pointy') return PG(`${x - 10},${ey + 8} ${x + sx * 2},${ey - 16} ${x + 10},${ey + 8}`, ec) +
      PG(`${x - 5},${ey + 6} ${x + sx * 1},${ey - 8} ${x + 5},${ey + 6}`, ei);
    if (ear === 'long') return G([E(0, 0, 7, 20, ec), E(0, 2, 3.4, 13, ei)], `translate(${x} ${ey - 12}) rotate(${sx * 12})`);
    if (ear === 'floppy') return G([E(0, 0, 8, 15, ec)], `translate(${x + sx * 5} ${ey + 10}) rotate(${sx * 22})`);
    if (ear === 'tiny') return C(x, ey + 2, 6, ec);
    if (ear === 'horn') return C(x, ey + 2, 8, ec) + G([P('M0 0 q3 -12 9 -14 q-1 10 -5 15 z', p.hornc || '#E6D2A8')], `translate(${x + sx * 4} ${ey - 2}) scale(${sx} 1)`);
    if (ear === 'antler') return C(x, ey + 3, 6, ec) + G([S('M0 0 q-2 -12 2 -18 M1 -10 q-7 -3 -9 -9 M2 -14 q6 -3 8 -8', p.hornc || '#A67C52', 3)], `translate(${x} ${ey - 4}) scale(${sx} 1)`);
    if (ear === 'tuft') return G([P('M0 0 q-4 -14 4 -18 q4 8 0 18 z', ec)], `translate(${x} ${ey}) scale(${sx} 1)`);
    return '';
  };
  if (ear !== 'none') out.push(mkEar(-1), mkEar(1));

  /* --- mane (lion) --- */
  if (p.mane) {
    const m = [];
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; m.push(C(hx + Math.cos(a) * (hr + 4), hy + Math.sin(a) * (hr + 4), 9.5, p.mane)); }
    out.push(m.join(''));
  }

  /* --- head --- */
  out.push(p.headShape === 'square' ? R(hx - hr, hy - hr, hr * 2, hr * 2, hr * .5, f) : C(hx, hy, hr, f));

  /* --- pattern --- */
  const pat = p.pat;
  if (pat === 'stripes') {
    const sc = p.patc || dk;
    const pw = p.patw || 3.4;
    out.push(S(`M${hx - 14} ${hy - 24} q3 8 0 13`, sc, pw), S(`M${hx} ${hy - 27} q0 8 0 12`, sc, pw),
      S(`M${hx + 14} ${hy - 24} q-3 8 0 13`, sc, pw),
      S(`M${hx - 25} ${hy + 1} q7 3 12 0`, sc, pw * .9), S(`M${hx + 25} ${hy + 1} q-7 3 -12 0`, sc, pw * .9));
  } else if (pat === 'spots') {
    const sc = p.patc || dk;
    out.push(C(hx - 17, hy + 8, 4.5, sc), C(hx + 18, hy - 5, 3.8, sc), C(hx + 12, hy + 13, 3.2, sc), C(hx - 8, hy - 18, 3.4, sc));
  } else if (pat === 'patch') {
    out.push(G([E(0, 0, 11, 10, p.patc || dk)], `translate(${hx + 15} ${hy - 6}) rotate(-15)`));
  } else if (pat === 'panda') {
    out.push(G([E(0, 0, 10, 9, p.patc || '#2E2A2A')], `translate(${hx - 12} ${hy - 3}) rotate(20)`),
      G([E(0, 0, 10, 9, p.patc || '#2E2A2A')], `translate(${hx + 12} ${hy - 3}) rotate(-20)`));
  } else if (pat === 'mask') {
    out.push(P(`M${hx - 26} ${hy - 6} q26 -12 52 0 q-8 14 -26 14 q-18 0 -26 -14 z`, p.patc || shade(f, .5)));
  } else if (pat === 'cow') {
    out.push(G([E(0, 0, 11, 8, p.patc || '#3B3330')], `translate(${hx - 17} ${hy - 17}) rotate(28)`),
      G([E(0, 0, 9, 7, p.patc || '#3B3330')], `translate(${hx + 19} ${hy - 13}) rotate(-22)`));
  } else if (pat === 'belly') {
    out.push(E(hx, hy + 12, 16, 12, f2));
  }

  /* --- snout --- */
  const sn = p.sn || 'none';
  const ny = hy + (p.snY || 8);
  if (sn === 'oval') { out.push(E(hx, ny + 2, 13, 10, p.snc || f2)); }
  else if (sn === 'wide') { out.push(E(hx, ny + 3, 17, 11, p.snc || f2)); }
  else if (sn === 'pig') { out.push(E(hx, ny + 2, 12, 9, p.snc || shade(f, .18)), C(hx - 4, ny + 2, 2.2, shade(f, -.35)), C(hx + 4, ny + 2, 2.2, shade(f, -.35))); }
  else if (sn === 'long') { out.push(E(hx, ny + 6, 11, 13, p.snc || f2)); }
  else if (sn === 'trunk') { out.push(S(`M${hx} ${ny - 2} q2 16 -8 24 q-9 7 -3 14`, p.snc || f, 11)); out.push(C(hx - 11, ny + 36, 5.5, shade(p.snc || f, -.12))); }
  else if (sn === 'muzzle') { out.push(E(hx, ny + 4, 15, 12, p.snc || f2)); out.push(S(`M${hx} ${ny + 4} v7`, shade(p.snc || f2, -.3), 2.2)); }
  else if (sn === 'beak') { out.push(PG(`${hx - 7},${ny} ${hx + 7},${ny} ${hx},${ny + 10}`, p.snc || '#F5A623')); }

  /* --- nose + face --- */
  const fy = p.faceY != null ? p.faceY : hy - 2;
  if (p.nose !== false && sn !== 'beak') {
    const nc = p.nosec || ink;
    if (sn === 'pig') { /* nostrils already drawn */ }
    else out.push(P(`M${hx - 4.5} ${ny - 2} h9 q0 6 -4.5 6.5 q-4.5 -.5 -4.5 -6.5 z`, nc));
  }
  out.push(face(hx, fy, p.fs || 1, { eye: p.eye, mouth: p.mouth || (sn !== 'none' ? 'cat' : 'smile'), ink, cheek: p.cheek, gap: p.gap }));

  if (p.whisk) out.push(S(`M${hx - 16} ${ny} h-14 M${hx - 16} ${ny + 5} h-13 M${hx + 16} ${ny} h14 M${hx + 16} ${ny + 5} h13`, ink, 1.6, { opacity: .55 }));
  if (p.extra) out.push(p.extra);
  return out.join('');
}

/* ================= BIRD ======================================== */
function bird(p, seed) {
  const f = p.f || '#7EC8E3', f2 = p.f2 || shade(f, .4), bk = p.bk || '#F6A21D';
  const out = [];
  const bx = 58, by = 66;
  if (p.tail !== false) out.push(G([P('M0 0 q20 -8 26 4 q-14 10 -26 -4 z', p.tc || shade(f, -.14))], `translate(${bx + 16} ${by + 6}) rotate(${p.tailA || 8})`));
  if (p.legs !== false) out.push(S(`M${bx - 6} ${by + 24} v8 M${bx + 8} ${by + 24} v8`, p.legc || bk, 3.4),
    S(`M${bx - 11} ${by + 32} h10 M${bx + 3} ${by + 32} h10`, p.legc || bk, 3.4));
  out.push(E(bx, by, p.bw || 25, p.bh || 27, f));            // body
  out.push(E(bx, by + 6, (p.bw || 25) * .62, (p.bh || 27) * .6, f2)); // belly
  out.push(G([E(0, 0, 11, 8, p.wc || shade(f, -.12))], `translate(${bx + 15} ${by + 2}) rotate(${p.wingA || 20})`)); // wing
  const hy2 = by - (p.bh || 27) - 4;
  if (p.crest) out.push(G([P('M0 0 q-3 -13 5 -16 q3 9 1 16 z', p.crestc || '#EF5B3E')], `translate(${bx} ${hy2 - 14})`));
  out.push(C(bx, hy2, p.hr || 17, p.hc || f));
  if (p.disc) out.push(C(bx - 7, hy2 - 1, 9.5, p.disc), C(bx + 7, hy2 - 1, 9.5, p.disc));
  if (p.cap) out.push(P(`M${bx - 17} ${hy2 - 2} a17 17 0 0 1 34 0 z`, p.cap));
  if (p.beak === 'hook') out.push(P(`M${bx + 12} ${hy2} q10 0 9 6 q-2 7 -9 3 z`, bk));
  else if (p.beak === 'flat') out.push(E(bx + 17, hy2 + 3, 9, 4.5, bk));
  else if (p.beak === 'long') out.push(PG(`${bx + 12},${hy2 - 3} ${bx + 34},${hy2 + 3} ${bx + 12},${hy2 + 6}`, bk));
  else out.push(PG(`${bx + 11},${hy2 - 4} ${bx + 24},${hy2 + 2} ${bx + 11},${hy2 + 7}`, bk));
  out.push(face(bx - 2, hy2 - 2, p.fs || .8, { eye: p.eye || 'sparkle', mouth: 'none', gap: 7, cheek: p.cheek }));
  if (p.extra) out.push(p.extra);
  return out.join('');
}

/* ================= FISH / SEA ================================== */
function fish(p, seed) {
  const f = p.f || '#FF9E4A', f2 = p.f2 || shade(f, .42), dk = shade(f, -.2);
  const out = [];
  const bx = 56, by = 60, rx = p.rx || 30, ry = p.ry || 21;
  out.push(G([P(`M0 0 q16 -14 20 0 q-4 14 -20 0 z`, p.tc || dk)], `translate(${bx + rx - 2} ${by}) rotate(${p.tailA || 0})`));
  if (p.fin !== false) out.push(P(`M${bx - 4} ${by - ry + 3} q8 -14 18 -3 z`, dk));
  out.push(E(bx, by, rx, ry, f));
  out.push(E(bx - 6, by + 6, rx * .5, ry * .45, f2, { opacity: .8 }));
  if (p.pat === 'stripes') out.push(S(`M${bx - 4} ${by - 18} q4 18 0 36 M${bx + 8} ${by - 16} q4 16 0 32`, dk, 4, { opacity: .6 }));
  if (p.pat === 'spots') out.push(C(bx + 4, by - 6, 3.4, dk) + C(bx - 6, by + 4, 3, dk) + C(bx + 12, by + 6, 2.6, dk));
  out.push(E(bx - rx * .55, by + 2, 7, 6, p.finc || dk, { transform: rot(20, bx - rx * .55, by + 2) }));
  out.push(face(bx - rx * .5, by - 4, p.fs || .8, { eye: p.eye || 'sparkle', mouth: p.mouth || 'oh', gap: 0, cheek: p.cheek }));
  if (p.extra) out.push(p.extra);
  return out.join('');
}

/* ================= BUG ========================================= */
function bug(p, seed) {
  const f = p.f || '#F2C14E', f2 = p.f2 || shade(f, -.25);
  const out = [];
  const bx = 60, by = 64;
  if (p.legs !== false) out.push(S(`M${bx - 12} ${by} l-16 8 M${bx - 12} ${by + 6} l-15 12 M${bx + 12} ${by} l16 8 M${bx + 12} ${by + 6} l15 12`, p.legc || '#4A3B33', 2.6));
  if (p.wing === 'butterfly') {
    const wc = p.wc || '#F27EA9', wc2 = p.wc2 || shade(wc, .35);
    out.push(G([E(0, 0, 22, 17, wc), C(-4, -2, 6, wc2)], `translate(${bx - 22} ${by - 10}) rotate(-18)`));
    out.push(G([E(0, 0, 22, 17, wc), C(4, -2, 6, wc2)], `translate(${bx + 22} ${by - 10}) rotate(18)`));
    out.push(G([E(0, 0, 15, 12, wc), C(0, 0, 4, wc2)], `translate(${bx - 18} ${by + 12}) rotate(14)`));
    out.push(G([E(0, 0, 15, 12, wc), C(0, 0, 4, wc2)], `translate(${bx + 18} ${by + 12}) rotate(-14)`));
  } else if (p.wing === 'clear') {
    out.push(G([E(0, 0, 20, 8, '#CFE9F5', { opacity: .85 })], `translate(${bx - 16} ${by - 12}) rotate(-16)`));
    out.push(G([E(0, 0, 20, 8, '#CFE9F5', { opacity: .85 })], `translate(${bx + 16} ${by - 12}) rotate(16)`));
  } else if (p.wing === 'shell') {
    out.push(E(bx, by, 24, 23, f));
    out.push(P(`M${bx} ${by - 23} a24 23 0 0 1 0 46 z`, shade(f, -.08)));
    out.push(S(`M${bx} ${by - 22} v44`, p.linec || '#3B2C2A', 2.4));
  }
  if (p.wing !== 'shell') out.push(E(bx, by + 2, p.bw || 16, p.bh || 20, f));
  if (p.pat === 'dots') { const d = p.patc || '#3B2C2A'; out.push(C(bx - 11, by - 6, 4, d), C(bx + 11, by - 6, 4, d), C(bx - 9, by + 9, 3.4, d), C(bx + 9, by + 9, 3.4, d)); }
  if (p.pat === 'bands') { const d = p.patc || '#3B2C2A'; out.push(R(bx - 17, by - 6, 34, 5, 2.5, d), R(bx - 16, by + 5, 32, 5, 2.5, d)); }
  const hy = by - (p.wing === 'shell' ? 26 : (p.bh || 20)) - 8;
  out.push(S(`M${bx - 5} ${hy - 6} q-6 -10 -12 -12 M${bx + 5} ${hy - 6} q6 -10 12 -12`, p.antc || '#4A3B33', 2.4));
  out.push(C(bx - 17, hy - 18, 3.2, p.antc || '#4A3B33'), C(bx + 17, hy - 18, 3.2, p.antc || '#4A3B33'));
  out.push(C(bx, hy, 13, p.hc || shade(f, -.3)));
  out.push(face(bx, hy - 1, .72, { eye: p.eye || 'sparkle', mouth: p.mouth || 'smile', gap: 6, cheek: p.cheek }));
  if (p.extra) out.push(p.extra);
  return out.join('');
}

/* ================= FRUIT ======================================= */
function fruit(p, seed) {
  const f = p.f || '#E8402F', out = [];
  const cx = 60, cy = p.cy || 66;
  const sh = p.sh || 'round';
  if (sh === 'round') out.push(C(cx, cy, p.r || 28, f));
  else if (sh === 'apple') out.push(P(`M${cx} ${cy - 24} q-30 -10 -30 18 q0 24 15 30 q9 4 15 -2 q6 6 15 2 q15 -6 15 -30 q0 -28 -30 -18 z`, f));
  else if (sh === 'oval') out.push(E(cx, cy, p.rx || 22, p.ry || 29, f));
  else if (sh === 'wide') out.push(E(cx, cy, p.rx || 30, p.ry || 24, f));
  else if (sh === 'pear') out.push(P(`M${cx} ${cy - 30} q-13 2 -13 16 q0 8 -7 15 q-8 8 -8 18 q0 14 28 14 q28 0 28 -14 q0 -10 -8 -18 q-7 -7 -7 -15 q0 -14 -13 -16 z`, f));
  else if (sh === 'banana') out.push(P(`M32 42 q-6 30 14 46 q22 18 44 6 q-16 -2 -28 -14 q-14 -14 -12 -38 q-9 -6 -18 0 z`, f));
  else if (sh === 'berry') { const bc = p.f; for (const [x, y, r] of [[-13, 6, 12], [13, 6, 12], [0, -8, 13], [-9, -18, 9], [9, -18, 9]]) out.push(C(cx + x, cy + y, r, bc)); }
  else if (sh === 'bunch') { const bc = p.f; for (const [x, y] of [[0, -18], [-13, -6], [13, -6], [-22, 6], [0, 6], [22, 6], [-11, 18], [11, 18], [0, 30]]) out.push(C(cx + x, cy + y, 10, bc)); }
  else if (sh === 'star') out.push(PG(Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 12 : 30; return `${n(cx + Math.cos(a) * r)},${n(cy + Math.sin(a) * r)}`; }).join(' '), f));
  else if (sh === 'wedge') out.push(P(`M${cx - 32} ${cy + 18} a34 34 0 0 1 64 0 z`, p.rind || '#4FA84F') + P(`M${cx - 26} ${cy + 14} a28 28 0 0 1 52 0 z`, f));
  else if (sh === 'cluster') { for (const [x, y, r] of [[-16, 4, 14], [16, 4, 14], [0, -12, 15]]) out.push(C(cx + x, cy + y, r, f)); }

  if (p.rings) out.push(S(`M${cx - 20} ${cy - 8} q20 -8 40 0 M${cx - 22} ${cy + 4} q22 -6 44 0`, shade(f, -.2), 3, { opacity: .5 }));
  if (p.seeds) { const sc = p.seedc || '#4A3B33'; out.push(C(cx - 10, cy + 2, 2.6, sc), C(cx + 9, cy - 4, 2.6, sc), C(cx + 2, cy + 12, 2.6, sc), C(cx - 4, cy - 10, 2.6, sc)); }
  if (p.dots) { const sc = p.dotc || shade(f, .5); for (let i = 0; i < 7; i++) out.push(C(cx - 20 + rnd(seed, i) * 40, cy - 16 + rnd(seed, i + 30) * 34, 2, sc)); }
  if (p.crown) { for (let i = -2; i <= 2; i++) out.push(G([P('M0 0 q-5 -20 0 -26 q5 6 0 26 z', p.crownc || '#4FA84F')], `translate(${cx + i * 9} ${cy - (p.r || 28) + 4}) rotate(${i * 16})`)); }
  if (p.net) {
    const id = 'cl' + hash(seed || 'n').toString(36);
    const rx0 = p.rx || p.r || 28, ry0 = p.ry || p.r || 28;
    const lines = [];
    for (let i = -3; i <= 3; i++) lines.push(`M${n(cx - rx0 - 10 + i * 11)} ${n(cy - ry0 - 10)} L${n(cx + rx0 - 10 + i * 11)} ${n(cy + ry0 + 10)}`);
    for (let i = -3; i <= 3; i++) lines.push(`M${n(cx + rx0 + 10 - i * 11)} ${n(cy - ry0 - 10)} L${n(cx - rx0 + 10 - i * 11)} ${n(cy + ry0 + 10)}`);
    out.push(`<clipPath id="${id}"><ellipse cx="${cx}" cy="${cy}" rx="${n(rx0)}" ry="${n(ry0)}"/></clipPath>`);
    out.push(`<g clip-path="url(#${id})">${S(lines.join(' '), shade(f, -.28), 2.2, { opacity: .55 })}</g>`);
  }
  if (p.stem !== false) out.push(stemUp(cx + (p.stemX || 0), cy - (p.stemY || 26), p.stemH || 14, p.stemc || '#8A6244', p.stemW || 4.5));
  if (p.leaf !== false) out.push(leaf(cx + (p.leafX || 2), cy - (p.leafY || 34), p.leafS || 1, p.leafc || '#5FBF6A', p.leafA || -18));
  out.push(shine(cx - (p.rx || p.r || 28) * .45, cy - 12, 11));
  out.push(face(cx, cy + (p.faceY || 2), p.fs || .95, { eye: p.eye, mouth: p.mouth, cheek: p.cheek || '#FF8FA6' }));
  if (p.extra) out.push(p.extra);
  return out.join('');
}

/* ================= VEGETABLE =================================== */
function veg(p, seed) {
  const f = p.f || '#E8843C', out = [], cx = 60, cy = p.cy || 70;
  const sh = p.sh || 'root';
  if (sh === 'root') { out.push(P(`M${cx - 16} ${cy - 22} q16 -6 32 0 q-4 30 -16 46 q-12 -16 -16 -46 z`, f)); if (p.rings) out.push(S(`M${cx - 12} ${cy - 8} h24 M${cx - 9} ${cy + 6} h18`, shade(f, -.2), 2.4, { opacity: .5 })); }
  else if (sh === 'leafball') { out.push(C(cx, cy, 28, f)); out.push(S(`M${cx - 20} ${cy - 12} q20 22 40 -2 M${cx - 22} ${cy + 6} q22 16 44 -4`, shade(f, -.16), 3, { opacity: .6 })); }
  else if (sh === 'long') out.push(R(cx - 12, cy - 30, 24, 58, 12, f));
  else if (sh === 'pod') { out.push(G([P('M0 0 q22 -16 44 0 q-22 16 -44 0 z', f)], `translate(${cx - 22} ${cy}) rotate(-8)`)); if (p.seeds) for (let i = -1; i <= 1; i++) out.push(C(cx + i * 12, cy - 1, 5, shade(f, .35))); }
  else if (sh === 'bunchLeaf') { for (let i = -1; i <= 1; i++) out.push(G([E(0, 0, 11, 26, i === 0 ? f : shade(f, -.08))], `translate(${cx + i * 15} ${cy}) rotate(${i * 16})`)); }
  else if (sh === 'mushroom') { out.push(R(cx - 9, cy - 4, 18, 30, 8, p.stalk || '#F3E6CE')); out.push(P(`M${cx - 30} ${cy - 2} a30 26 0 0 1 60 0 z`, f)); if (p.dots) out.push(C(cx - 13, cy - 12, 5, '#FFF3E0') + C(cx + 12, cy - 14, 4, '#FFF3E0') + C(cx + 1, cy - 22, 4.5, '#FFF3E0')); }
  else if (sh === 'ball') out.push(C(cx, cy, p.r || 27, f));
  if (p.top === 'leaves') for (let i = -1; i <= 1; i++) out.push(G([P('M0 0 q-7 -22 1 -28 q8 8 1 28 z', p.topc || '#4FA84F')], `translate(${cx + i * 10} ${cy - (p.topY || 22)}) rotate(${i * 22})`));
  if (p.top === 'sprout') out.push(stemUp(cx, cy - (p.topY || 24), 12, '#4FA84F', 4) + leaf(cx + 1, cy - (p.topY || 24) - 12, .9, '#5FBF6A', -20) + leaf(cx - 1, cy - (p.topY || 24) - 10, .8, '#7ACD7F', 200));
  out.push(face(cx, cy + (p.faceY || 4), p.fs || .9, { eye: p.eye, mouth: p.mouth, cheek: p.cheek }));
  if (p.extra) out.push(p.extra);
  return out.join('');
}

/* ================= VEHICLE ===================================== */
function vehicle(p, seed) {
  const f = p.f || '#EF5B3E', out = [], cx = 60;
  const y = p.y || 68, w = p.w || 74, h = p.h || 30;
  const wheel = (x, yy, r) => C(x, yy, r, '#3B3330') + C(x, yy, r * .45, '#D9D3C8');
  if (p.kind === 'plane') {
    out.push(G([E(0, 0, 40, 13, f)], `translate(${cx} ${y})`));
    out.push(P(`M${cx - 6} ${y} l-16 -26 h12 l22 26 z`, shade(f, -.18)));
    out.push(P(`M${cx - 6} ${y} l-14 26 h12 l20 -26 z`, shade(f, -.28)));
    out.push(P(`M${cx + 30} ${y - 4} l12 -18 h6 l-4 22 z`, shade(f, -.18)));
    out.push(C(cx - 20, y - 2, 7, '#BFE6F5'), C(cx - 6, y - 2, 6, '#BFE6F5'), C(cx + 7, y - 2, 5.5, '#BFE6F5'));
    out.push(face(cx - 27, y - 1, .62, { eye: 'sparkle', mouth: 'smile', gap: 5.5 }));
  } else if (p.kind === 'boat') {
    if (p.sail) { out.push(S(`M${cx} ${y - 6} v-42`, '#8A6244', 4)); out.push(P(`M${cx + 3} ${y - 46} q26 20 0 38 z`, p.sailc || '#FFF3D6', { stroke: '#D9C7A4', 'stroke-width': 2 })); out.push(P(`M${cx - 3} ${y - 44} q-18 18 0 32 z`, p.sailc2 || '#F5B94F')); }
    out.push(P(`M${cx - 40} ${y - 4} h80 l-12 22 h-56 z`, f));
    out.push(R(cx - 40, y - 10, 80, 8, 4, shade(f, .3)));
    if (!p.sail) { out.push(R(cx - 16, y - 30, 32, 22, 6, p.cabin || '#FFF6EA')); out.push(C(cx - 7, y - 20, 5, '#BFE6F5'), C(cx + 7, y - 20, 5, '#BFE6F5')); }
    out.push(S(`M18 ${y + 26} q10 -7 20 0 q10 7 20 0 q10 -7 20 0 q10 7 20 0`, '#7FC7E8', 4));
  } else if (p.kind === 'rocket') {
    out.push(P(`M${cx} 16 q17 20 17 46 v20 h-34 v-20 q0 -26 17 -46 z`, p.body || '#FFF6EA'));
    out.push(P(`M${cx - 17} 62 l-14 24 h14 z`, f), P(`M${cx + 17} 62 l14 24 h-14 z`, f));
    out.push(P(`M${cx} 16 q10 12 13 26 h-26 q3 -14 13 -26 z`, f));
    out.push(C(cx, 58, 11, '#BFE6F5'), C(cx, 58, 7.5, '#8FD3EF'));
    out.push(P(`M${cx - 11} 82 q11 26 22 0 z`, '#FFB43D'), P(`M${cx - 6} 82 q6 17 12 0 z`, '#FF6B3D'));
  } else {
    /* wheeled */
    const bodyD = p.bodyD || `M${cx - w / 2} ${y + h / 2} v-${h - 6} q0 -6 8 -6 h${w - 16} q8 0 8 6 v${h - 6} z`;
    if (p.cab) out.push(R(cx - w / 2 + (p.cabX || 8), y - h / 2 - (p.cabH || 22), p.cabW || 34, (p.cabH || 22) + 4, 7, p.cabc || shade(f, -.1)));
    out.push(P(bodyD, f));
    if (p.win !== false) { const wx = cx - w / 2 + (p.winX || 12), wy = y - h / 2 - (p.cabH || 22) + 6; out.push(R(wx, p.cab ? wy : y - h / 2 + 5, p.winW || 22, 13, 4, '#BFE6F5')); }
    if (p.stripe) out.push(R(cx - w / 2, y + 2, w, 7, 3, p.stripe));
    if (p.siren) out.push(R(cx - 8, y - h / 2 - (p.cabH || 22) - 8, 16, 8, 3, p.siren));
    if (p.ladder) out.push(G([R(0, 0, 46, 7, 3, '#D9D3C8'), S('M6 0 v7 M16 0 v7 M26 0 v7 M36 0 v7', '#8C857A', 2)], `translate(${cx - 8} ${y - h / 2 - 14}) rotate(-12)`));
    if (p.blade) out.push(S(`M${cx - 34} ${y - h / 2 - 26} h68`, '#5C6670', 5) + R(cx - 3, y - h / 2 - 30, 6, 10, 2, '#5C6670'));
    if (p.arm) out.push(S(`M${cx + 6} ${y - 12} l26 -26`, '#F6C445', 8) + P(`M${cx + 30} ${y - 42} q14 6 10 20 l-16 -6 z`, '#E0A82E'));
    const r = p.wr || 12, wy2 = y + h / 2 + r - 5;
    out.push(wheel(cx - w / 2 + (p.w1 || 16), wy2, r), wheel(cx + w / 2 - (p.w2 || 16), wy2, p.wr2 || r));
    if (p.w3) out.push(wheel(cx + w / 2 - (p.w3), wy2, r));
    if (p.face !== false) out.push(face(cx - w / 2 + (p.faceX || 17), y + (p.faceY || 4), .62, { eye: 'sparkle', mouth: 'smile', gap: 6, cheek: '#FF9DB0' }));
  }
  if (p.extra) out.push(p.extra);
  return out.join('');
}

/* ================= PERSON / POSE =============================== */
const SKIN = ['#F6D2B0', '#EFC199', '#E0A87C', '#C98A5E'];
function person(p, seed) {
  const sk = p.sk || SKIN[hash(seed || 'x') % SKIN.length];
  const hc = p.hc || '#3B2C2A', sh = p.sh || '#4FA3D9', pc = p.pc || '#3E5C76';
  const out = [], cx = 60;
  const lift = p.lift || 0;
  const hy = 34 - lift, sy = 60 - lift, by = 52 - lift, bh = 32, ft = 104 - lift;
  const limb = (d, c, w) => S(d, c, w || 7);

  /* legs */
  const pose = p.pose || 'stand';
  if (pose === 'sleep') {
    out.push(R(24, 66, 74, 26, 13, sh));
    out.push(C(30, 60, 18, sk), limb(`M96 78 h10`, sk));
    out.push(P('M22 92 q40 -10 80 0 q0 8 -8 8 h-64 q-8 0 -8 -8 z', p.blanket || '#F2A7B8'));
    out.push(C(30, 56, 18, hc, { opacity: 0 }));
    out.push(face(30, 58, .85, { eye: 'sleep', mouth: 'smile', gap: 7 }));
    out.push(S('M52 46 q6 -8 12 0 M62 36 q7 -9 14 0', '#9AA8B5', 3));
    return out.join('');
  }
  if (pose === 'sit') { out.push(limb(`M${cx - 8} ${by + bh} v10 h20`, sk, 8), limb(`M${cx + 8} ${by + bh} v10 h20`, sk, 8)); }
  else if (pose === 'run') { out.push(limb(`M${cx - 6} ${by + bh} l-14 16`, pc, 8), limb(`M${cx + 6} ${by + bh} l16 12`, pc, 8)); }
  else if (pose === 'jump') { out.push(limb(`M${cx - 6} ${by + bh} l-16 10`, pc, 8), limb(`M${cx + 6} ${by + bh} l16 10`, pc, 8)); }
  else { out.push(limb(`M${cx - 7} ${by + bh} v${ft - by - bh}`, pc, 8), limb(`M${cx + 7} ${by + bh} v${ft - by - bh}`, pc, 8)); }
  if (pose !== 'sit' && pose !== 'sleep') out.push(E(cx - 9, ft + 2, 8, 4.5, p.shoe || '#3B2C2A'), E(cx + 9, ft + 2, 8, 4.5, p.shoe || '#3B2C2A'));

  /* torso */
  if (p.skirt) out.push(P(`M${cx - 15} ${by + 10} h30 l10 ${bh} h-50 z`, sh));
  out.push(R(cx - 17, by, 34, bh, 12, sh));

  /* arms */
  const arm = (sx, hx2, hy2, bend) => limb(`M${cx + sx * 15} ${sy - 6} q${bend || 0} 6 ${hx2 - cx - sx * 15} ${hy2 - sy + 6}`, sk, 7) + C(hx2, hy2, 5, sk);
  if (pose === 'wave') out.push(arm(-1, cx - 26, sy + 12), arm(1, cx + 27, sy - 26));
  else if (pose === 'bothup') out.push(arm(-1, cx - 27, sy - 26), arm(1, cx + 27, sy - 26));
  else if (pose === 'run') out.push(arm(-1, cx - 26, sy - 8), arm(1, cx + 26, sy + 10));
  else if (pose === 'jump') out.push(arm(-1, cx - 28, sy - 22), arm(1, cx + 28, sy - 22));
  else if (pose === 'hold' || pose === 'carry') out.push(arm(-1, cx - 20, sy + 10), arm(1, cx + 20, sy + 10));
  else if (pose === 'point') out.push(arm(-1, cx - 24, sy + 12), arm(1, cx + 32, sy - 2));
  else if (pose === 'reach') out.push(arm(-1, cx - 20, sy - 18), arm(1, cx + 20, sy - 18));
  else if (pose === 'hug') out.push(arm(-1, cx - 6, sy + 12, 12), arm(1, cx + 6, sy + 12, -12));
  else out.push(arm(-1, cx - 24, sy + 14), arm(1, cx + 24, sy + 14));

  /* head */
  out.push(C(cx, hy, 19, sk));
  const hs = p.hs || 'bob';
  if (hs === 'bob') out.push(P(`M${cx - 19} ${hy} a19 19 0 0 1 38 0 q0 8 -6 6 q-13 -8 -26 0 q-6 2 -6 -6 z`, hc) + E(cx - 18, hy + 4, 5, 9, hc) + E(cx + 18, hy + 4, 5, 9, hc));
  else if (hs === 'short') out.push(P(`M${cx - 19} ${hy - 1} a19 19 0 0 1 38 0 q-6 -7 -19 -7 q-13 0 -19 7 z`, hc));
  else if (hs === 'spiky') out.push(P(`M${cx - 19} ${hy - 2} q3 -12 8 -6 q2 -13 8 -7 q4 -12 10 -5 q6 -6 10 4 q4 -2 3 14 q-19 -10 -39 0 z`, hc));
  else if (hs === 'pigtail') out.push(P(`M${cx - 19} ${hy} a19 19 0 0 1 38 0 q0 6 -5 5 q-14 -8 -28 0 q-5 1 -5 -5 z`, hc) + C(cx - 22, hy + 8, 7, hc) + C(cx + 22, hy + 8, 7, hc));
  else if (hs === 'bun') out.push(P(`M${cx - 19} ${hy} a19 19 0 0 1 38 0 q0 6 -5 5 q-14 -8 -28 0 q-5 1 -5 -5 z`, hc) + C(cx, hy - 22, 9, hc));
  else if (hs === 'long') out.push(P(`M${cx - 20} ${hy + 16} q-3 -36 20 -36 q23 0 20 36 q-6 -14 -8 -22 q-14 8 -24 0 q-2 8 -8 22 z`, hc));
  else if (hs === 'grey') out.push(P(`M${cx - 19} ${hy - 2} a19 19 0 0 1 38 0 q-8 -6 -19 -6 q-11 0 -19 6 z`, '#C9CBD2'));
  else if (hs === 'bald') { /* none */ }
  if (p.beard) out.push(P(`M${cx - 14} ${hy + 8} q14 22 28 0 q-4 16 -14 16 q-10 0 -14 -16 z`, p.beard));
  if (p.hat) out.push(p.hat === 'cap' ? P(`M${cx - 20} ${hy - 8} a20 16 0 0 1 40 0 z`, p.hatc || '#EF5B3E') + P(`M${cx + 4} ${hy - 8} h24 q0 6 -8 6 h-16 z`, shade(p.hatc || '#EF5B3E', -.15))
    : p.hat === 'chef' ? R(cx - 15, hy - 30, 30, 14, 6, '#FFFDF7') + R(cx - 17, hy - 18, 34, 8, 3, '#F1EDE2')
      : p.hat === 'cone' ? P(`M${cx} ${hy - 34} l20 16 h-40 z`, p.hatc || '#F6C445')
        : p.hat === 'straw' ? P(`M${cx - 26} ${hy - 10} q26 -22 52 0 q-26 8 -52 0 z`, p.hatc || '#E8C879')
          : p.hat === 'crown' ? P(`M${cx - 16} ${hy - 14} l5 -14 l5 8 l6 -12 l6 12 l5 -8 l5 14 z`, p.hatc || '#F6C445')
            : p.hat === 'helmet' ? P(`M${cx - 20} ${hy - 4} a20 19 0 0 1 40 0 z`, p.hatc || '#F6C445') + R(cx - 24, hy - 6, 48, 6, 3, shade(p.hatc || '#F6C445', -.2))
              : R(cx - 16, hy - 26, 32, 12, 5, p.hatc || '#4FA3D9'));
  if (p.glasses) out.push(C(cx - 7, hy - 1, 7, 'none', { stroke: '#3B2C2A', 'stroke-width': 2 }) + C(cx + 7, hy - 1, 7, 'none', { stroke: '#3B2C2A', 'stroke-width': 2 }) + S(`M${cx - 1} ${hy - 1} h2`, '#3B2C2A', 2));
  out.push(face(cx, hy - 1, p.fs || .82, { eye: p.eye, mouth: p.mouth, gap: p.gap || 7.5, cheek: p.cheek, ink: p.ink }));
  if (p.prop) out.push(p.prop);
  if (p.extra) out.push(p.extra);
  return out.join('');
}

/* ================= THING (free-form shape list) ================ */
function thing(p, seed) {
  const out = [];
  for (const s of (p.s || [])) {
    const k = s[0];
    if (k === 'c') out.push(C(s[1], s[2], s[3], s[4], s[5] || {}));
    else if (k === 'e') out.push(E(s[1], s[2], s[3], s[4], s[5], s[6] ? { transform: rot(s[6], s[1], s[2]) } : {}));
    else if (k === 'r') out.push(R(s[1], s[2], s[3], s[4], s[5], s[6], s[7] ? { transform: rot(s[7], s[1] + s[3] / 2, s[2] + s[4] / 2) } : {}));
    else if (k === 'p') out.push(P(s[1], s[2], s[3] || {}));
    else if (k === 's') out.push(S(s[1], s[2], s[3], s[4] || {}));
    else if (k === 'g') out.push(PG(s[1], s[2], s[3] || {}));
    else if (k === 'f') out.push(face(s[1], s[2], s[3] || 1, s[4] || {}));
    else if (k === 'x') out.push(s[1]);
  }
  if (p.face !== false && !(p.s || []).some(s => s[0] === 'f')) out.push(face(p.fx || 60, p.fy || 66, p.fs || .85, { eye: p.eye, mouth: p.mouth, cheek: p.cheek }));
  if (p.extra) out.push(p.extra);
  return out.join('');
}

/* ================= DISH ======================================== */
function dish(p, seed) {
  const out = [], cx = 60;
  const k = p.kind || 'bowl';
  if (k === 'bowl') {
    if (p.heap) out.push(p.heap);
    out.push(P(`M${cx - 34} 60 q4 32 34 32 q30 0 34 -32 z`, p.bowl || '#FFFDF7'));
    if (p.fill) out.push(P(`M${cx - 32} 60 q32 -20 64 0 q-6 9 -32 9 q-26 0 -32 -9 z`, p.fill));
    out.push(P(`M${cx - 34} 60 h68 q0 6 -34 6 q-34 0 -34 -6 z`, shade(p.bowl || '#FFFDF7', -.08), { opacity: .55 }));
    if (p.band) out.push(S(`M${cx - 28} 76 q28 8 56 0`, p.band, 4));
    out.push(face(cx, 78, .8, { eye: p.eye, mouth: p.mouth, cheek: p.cheek }));
  } else if (k === 'plate') {
    out.push(E(cx, 82, 42, 12, p.plate || '#FFFDF7'), E(cx, 79, 34, 9, shade(p.plate || '#FFFDF7', -.11)));
    if (p.heap) out.push(p.heap);
    out.push(face(cx, 96, .62, { eye: p.eye, mouth: p.mouth, cheek: p.cheek, gap: 7 }));
  } else if (k === 'cup') {
    out.push(P(`M${cx - 24} 46 h48 l-5 46 q-1 8 -19 8 q-18 0 -19 -8 z`, p.cup || '#FFFDF7'));
    out.push(P(`M${cx - 22} 52 h44 l-4 38 q-1 6 -18 6 q-17 0 -18 -6 z`, p.fill || '#C98A5E'));
    if (p.pearl) for (const [x, y] of [[-10, 84], [0, 88], [10, 84], [-4, 78], [6, 78]]) out.push(C(cx + x, y, 5, '#3B2C2A'));
    if (p.straw) out.push(S(`M${cx + 10} 96 l6 -62`, p.straw, 6));
    if (p.handle) out.push(S(`M${cx + 23} 58 q16 4 12 18 q-3 10 -14 10`, p.cup || '#FFFDF7', 6));
    if (p.steam) out.push(S(`M${cx - 8} 40 q-6 -10 2 -18 M${cx + 8} 40 q6 -10 -2 -18`, '#C9D6D0', 3.4, { opacity: .8 }));
    out.push(face(cx, 70, .78, { eye: p.eye, mouth: p.mouth, cheek: p.cheek }));
  } else if (k === 'box') {
    out.push(R(cx - 36, 54, 72, 46, 9, p.box || '#EF5B3E'));
    out.push(R(cx - 30, 60, 60, 24, 6, p.inner || '#FFF6EA'));
    if (p.heap) out.push(p.heap);
    out.push(R(cx - 36, 84, 72, 16, 7, shade(p.box || '#EF5B3E', -.12)));
    out.push(face(cx, 90, .5, { eye: p.eye, mouth: p.mouth, gap: 7, cheek: p.cheek }));
  }
  if (p.extra) out.push(p.extra);
  return out.join('');
}

/* ================= BUILDING ==================================== */
function building(p, seed) {
  const out = [], cx = 60, f = p.f || '#F5E1C0';
  const bw = p.bw || 62, bh = p.bh || 46, by = 100 - bh;
  if (p.roof === 'temple') {
    const eave = (yy, half, h, c) => P(`M${cx - half} ${yy} q6 -10 ${half * .5} -12 q${half * .5} -${h} ${half} 0 q${half * .5} 2 ${half * .5} 12 q-14 -9 -${half} -9 q-${half} 0 -${half} 9 z`, c);
    out.push(eave(by + 2, 48, 22, p.roofc || '#B8392A'));
    out.push(eave(by - 12, 34, 18, p.roofc2 || '#D9553F'));
    out.push(R(cx - 3, by - 44, 6, 12, 3, '#E8B54A'));
  } else if (p.roof === 'flat') out.push(R(cx - bw / 2 - 4, by - 8, bw + 8, 10, 3, p.roofc || '#8C857A'));
  else if (p.roof === 'dome') out.push(P(`M${cx - bw / 2} ${by} a${bw / 2} ${bw / 2} 0 0 1 ${bw} 0 z`, p.roofc || '#7FB6D9'));
  else if (p.roof !== 'none') out.push(P(`M${cx - bw / 2 - 8} ${by} l${bw / 2 + 8} -${p.roofH || 26} l${bw / 2 + 8} ${p.roofH || 26} z`, p.roofc || '#D95F4A'));
  out.push(R(cx - bw / 2, by, bw, bh, p.br || 5, f));
  if (p.door !== false) out.push(R(cx - 10, 100 - (p.doorH || 24), 20, p.doorH || 24, p.doorR || 9, p.doorc || '#A2664A') + C(cx + 5, 100 - (p.doorH || 24) / 2, 2.2, '#F6C445'));
  if (p.win !== false) { out.push(R(cx - bw / 2 + 6, by + 8, 15, 14, 4, p.winc || '#BFE6F5'), R(cx + bw / 2 - 21, by + 8, 15, 14, 4, p.winc || '#BFE6F5')); }
  if (p.sign) out.push(R(cx - 22, by + 6, 44, 13, 4, p.signc || '#EF5B3E') + S(`M${cx - 14} ${by + 12.5} h28`, '#FFF6EA', 3, { opacity: .9 }));
  if (p.chimney) out.push(R(cx + 16, by - (p.roofH || 26) + 2, 11, 18, 3, p.chimc || '#B9553F'));
  if (p.cross) out.push(S(`M${cx} ${by - (p.roofH || 26)} v-14 M${cx - 5} ${by - (p.roofH || 26) - 9} h10`, '#F0D68A', 3.4));
  if (p.lantern) out.push(E(cx - 26, by + 16, 6, 8, '#E0453A') + E(cx + 26, by + 16, 6, 8, '#E0453A'));
  out.push(face(cx, p.fy || (by + 15), .58, { eye: p.eye, mouth: p.mouth, gap: 11, cheek: p.cheek }));
  if (p.extra) out.push(p.extra);
  return out.join('');
}

/* ================= GARMENT ===================================== */
function garment(p, seed) {
  const out = [], cx = 60, f = p.f || '#4FA3D9';
  const k = p.kind || 'shirt';
  if (k === 'shirt') out.push(P(`M${cx - 30} 44 l14 -8 q16 10 32 0 l14 8 l-8 14 l-6 -3 v34 q-16 5 -32 0 v-34 l-6 3 z`, f));
  else if (k === 'long') out.push(P(`M${cx - 32} 46 l14 -10 q18 10 36 0 l14 10 l-4 30 l-10 -2 v28 q-18 5 -36 0 v-28 l-10 2 z`, f));
  else if (k === 'dress') out.push(P(`M${cx - 24} 42 l10 -6 q14 8 28 0 l10 6 l-8 12 l-4 -2 l12 44 q-24 8 -48 0 l12 -44 l-4 2 z`, f));
  else if (k === 'pants') out.push(P(`M${cx - 22} 40 h44 l4 20 l-6 40 h-14 l-6 -34 l-6 34 h-14 l-6 -40 z`, f));
  else if (k === 'shorts') out.push(P(`M${cx - 22} 44 h44 l3 14 l-4 24 h-15 l-6 -18 l-6 18 h-15 l-4 -24 z`, f));
  else if (k === 'skirt') out.push(P(`M${cx - 20} 46 h40 l14 46 q-34 10 -68 0 z`, f));
  else if (k === 'sock') out.push(P(`M${cx - 12} 34 h22 v40 q0 12 -14 14 q-16 2 -18 -10 q-2 -10 10 -12 z`, f));
  else if (k === 'shoe') out.push(P(`M${cx - 34} 78 q0 -26 16 -26 q10 0 12 12 q4 12 22 14 q14 2 14 12 q0 8 -12 8 h-40 q-12 0 -12 -20 z`, f) + R(cx - 36, 92, 74, 8, 4, shade(f, -.3)));
  else if (k === 'boot') out.push(P(`M${cx - 16} 30 h26 v42 q14 4 18 14 q3 8 -8 8 h-36 z`, f) + R(cx - 18, 92, 60, 8, 4, shade(f, -.3)));
  else if (k === 'hat') out.push(P(`M${cx - 22} 62 a22 24 0 0 1 44 0 z`, f) + E(cx, 64, 36, 8, shade(f, -.12)));
  else if (k === 'cap') out.push(P(`M${cx - 24} 62 a24 22 0 0 1 48 0 z`, f) + P(`M${cx + 8} 62 h30 q0 8 -12 8 h-18 z`, shade(f, -.15)));
  else if (k === 'glove') out.push(P(`M${cx - 16} 44 q0 -10 8 -10 q8 0 8 10 v4 q4 -14 10 -2 q6 -12 10 2 v22 q0 16 -18 16 q-18 0 -18 -16 z`, f));
  else if (k === 'scarf') out.push(P(`M${cx - 34} 44 q34 22 68 0 l6 14 q-40 24 -80 0 z`, f) + P(`M${cx - 10} 66 h18 l-2 30 h-14 z`, shade(f, -.1)));
  else if (k === 'bag') out.push(R(cx - 26, 52, 52, 46, 10, f) + S(`M${cx - 14} 54 q14 -22 28 0`, shade(f, -.25), 5) + R(cx - 26, 68, 52, 8, 3, shade(f, -.18)));
  else if (k === 'glasses') out.push(C(cx - 18, 62, 15, 'none', { stroke: f, 'stroke-width': 5 }) + C(cx + 18, 62, 15, 'none', { stroke: f, 'stroke-width': 5 }) + S(`M${cx - 4} 62 h8 M${cx - 33} 58 l-12 -6 M${cx + 33} 58 l12 -6`, f, 5));
  else if (k === 'mask') out.push(P(`M${cx - 26} 50 h52 v20 q0 16 -26 20 q-26 -4 -26 -20 z`, f) + S(`M${cx - 26} 54 q-14 4 -10 16 M${cx + 26} 54 q14 4 10 16`, shade(f, -.2), 4));
  if (p.stripes) out.push(S(`M${cx - 22} 62 h44 M${cx - 22} 74 h44`, p.stripec || '#FFF6EA', 5, { opacity: .9 }));
  if (p.dots) for (const [x, y] of [[-14, 58], [10, 66], [-6, 78], [16, 52]]) out.push(C(cx + x, y, 4, p.dotc || '#FFF6EA'));
  if (p.pocket) out.push(R(cx + 6, 68, 14, 12, 3, shade(f, -.15)));
  out.push(face(cx, p.fy || 66, p.fs || .72, { eye: p.eye, mouth: p.mouth, gap: 7, cheek: p.cheek }));
  if (p.extra) out.push(p.extra);
  return out.join('');
}

/* ================= PLANT ======================================= */
function plant(p, seed) {
  const out = [], cx = 60;
  const k = p.kind || 'tree';
  if (k === 'tree') {
    out.push(R(cx - 7, 62, 14, 38, 4, p.trunk || '#8A6244'));
    const lc = p.f || '#5FBF6A';
    out.push(C(cx, 46, 26, lc), C(cx - 20, 56, 17, shade(lc, -.08)), C(cx + 20, 56, 17, shade(lc, .08)));
    if (p.fruitc) for (const [x, y] of [[-14, 44], [12, 40], [0, 58], [20, 54]]) out.push(C(cx + x, y, 5, p.fruitc));
    out.push(face(cx, 48, .8, { eye: p.eye, mouth: p.mouth, cheek: p.cheek }));
  } else if (k === 'palm') {
    out.push(S(`M${cx} 100 q-6 -30 4 -52`, p.trunk || '#A6784F', 9));
    for (let i = 0; i < 5; i++) out.push(G([P('M0 0 q22 -12 34 2 q-18 8 -34 -2 z', p.f || '#4FA84F')], `translate(${cx + 4} 48) rotate(${-140 + i * 55})`));
    if (p.fruitc) out.push(C(cx - 2, 52, 6, p.fruitc) + C(cx + 10, 54, 5, p.fruitc));
    out.push(face(cx + 2, 70, .7, { eye: p.eye, mouth: p.mouth, cheek: p.cheek }));
  } else if (k === 'flower') {
    out.push(S(`M${cx} 104 q-4 -26 0 -40`, p.stem || '#4FA84F', 6));
    out.push(leaf(cx + 2, 82, 1, '#5FBF6A', -25), leaf(cx - 2, 74, .9, '#7ACD7F', 205));
    const pc = p.f || '#F27EA9', np = p.petals || 6;
    for (let i = 0; i < np; i++) { const a = (i / np) * Math.PI * 2; out.push(E(cx + Math.cos(a) * 20, 52 + Math.sin(a) * 20, 12, 12, pc)); }
    out.push(C(cx, 52, p.cr || 13, p.center || '#F6C445'));
    out.push(face(cx, 52, .82, { eye: p.eye, mouth: p.mouth, cheek: p.cheek }));
  } else if (k === 'blossom') {
    out.push(S(`M20 104 q22 -22 34 -34 M54 70 q10 -12 26 -16`, p.branch || '#7A5C46', 6));
    const pc = p.f || '#F9B8CE';
    for (const [bx, by, s] of [[54, 68, 1], [80, 52, .85], [34, 88, .8]]) {
      for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2 - 1.2; out.push(C(bx + Math.cos(a) * 10 * s, by + Math.sin(a) * 10 * s, 7 * s, pc)); }
      out.push(C(bx, by, 4.5 * s, '#F6C445'));
    }
    out.push(face(54, 68, .6, { eye: p.eye, mouth: p.mouth, gap: 6, cheek: p.cheek }));
  } else if (k === 'grass') {
    for (let i = -2; i <= 2; i++) out.push(S(`M${cx + i * 13} 100 q${i * 3} -20 ${i * 6} -34`, p.f || '#5FBF6A', 7));
    out.push(face(cx, 78, .75, { eye: p.eye, mouth: p.mouth, cheek: p.cheek }));
  } else if (k === 'bamboo') {
    for (const bx of [46, 62, 76]) { out.push(R(bx - 6, 26 + (bx % 7), 12, 76, 5, p.f || '#63B860')); out.push(S(`M${bx - 6} 52 h12 M${bx - 6} 74 h12`, shade(p.f || '#63B860', -.24), 3)); }
    out.push(leaf(84, 40, 1.1, '#4FA84F', -40), leaf(38, 46, 1, '#4FA84F', 210));
    out.push(face(62, 64, .7, { eye: p.eye, mouth: p.mouth, cheek: p.cheek }));
  } else if (k === 'cactus') {
    out.push(R(cx - 13, 44, 26, 56, 13, p.f || '#5AAE63'));
    out.push(R(cx - 34, 58, 14, 30, 7, p.f || '#5AAE63'), R(cx + 20, 50, 14, 34, 7, p.f || '#5AAE63'));
    out.push(S(`M${cx - 8} 56 h-3 M${cx + 8} 66 h3 M${cx - 8} 78 h-3 M${cx + 8} 88 h3`, '#3E7D46', 2.4));
    out.push(C(cx, 40, 6, '#F27EA9'));
    out.push(face(cx, 66, .8, { eye: p.eye, mouth: p.mouth, cheek: p.cheek }));
  } else if (k === 'sprout') {
    out.push(P(`M${cx - 26} 84 q26 -10 52 0 l-6 20 h-40 z`, p.pot || '#D98A5E'));
    out.push(R(cx - 30, 76, 60, 12, 6, shade(p.pot || '#D98A5E', .12)));
    out.push(S(`M${cx} 78 v-26`, '#4FA84F', 6), leaf(cx + 2, 56, 1.1, '#5FBF6A', -25), leaf(cx - 2, 62, 1, '#7ACD7F', 205));
    out.push(face(cx, 92, .62, { eye: p.eye, mouth: p.mouth, gap: 7, cheek: p.cheek }));
  }
  if (p.extra) out.push(p.extra);
  return out.join('');
}

/* ================= SKY / WEATHER =============================== */
function sky(p, seed) {
  const out = [], cx = 60;
  const k = p.kind || 'sun';
  const cloud = (x, y, s, c) => C(x - 16 * s, y, 13 * s, c) + C(x + 16 * s, y + 2 * s, 12 * s, c) + C(x, y - 8 * s, 18 * s, c) + R(x - 22 * s, y - 2 * s, 44 * s, 16 * s, 8 * s, c);
  if (k === 'sun') {
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; out.push(S(`M${n(cx + Math.cos(a) * 30)} ${n(60 + Math.sin(a) * 30)} L${n(cx + Math.cos(a) * 40)} ${n(60 + Math.sin(a) * 40)}`, p.rayc || '#F9A825', 5)); }
    out.push(C(cx, 60, 27, p.f || '#FFC24B'));
    out.push(face(cx, 58, .95, { eye: p.eye, mouth: p.mouth || 'smile', cheek: '#FF8FA6' }));
  } else if (k === 'moon') {
    out.push(P(`M${cx + 16} 26 a34 34 0 1 0 12 56 a28 28 0 1 1 -12 -56 z`, p.f || '#F7E08A'));
    out.push(face(cx + 2, 56, .8, { eye: p.eye || 'happy', mouth: p.mouth, gap: 7, cheek: '#F2B6A0' }));
  } else if (k === 'star') {
    out.push(PG(Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 15 : 38; return `${n(cx + Math.cos(a) * r)},${n(62 + Math.sin(a) * r)}`; }).join(' '), p.f || '#FFD24B'));
    out.push(face(cx, 62, .8, { eye: p.eye, mouth: p.mouth, cheek: '#FF9DB0' }));
  } else if (k === 'cloud') {
    out.push(cloud(cx, 58, 1.15, p.f || '#EAF2F7'));
    out.push(face(cx, 58, .85, { eye: p.eye, mouth: p.mouth, cheek: '#BFD6E4' }));
  } else if (k === 'rain' || k === 'snow' || k === 'storm') {
    out.push(cloud(cx, 46, 1.05, p.f || (k === 'storm' ? '#9FB3C0' : '#DCE8F0')));
    for (let i = -1; i <= 1; i++) {
      const x = cx + i * 20;
      if (k === 'snow') out.push(S(`M${x} 76 v14 M${x - 6} 79 l12 8 M${x + 6} 79 l-12 8`, '#BFE0F0', 3.4));
      else if (k === 'storm') out.push(PG(`${x - 5},74 ${x + 7},74 ${x + 1},86 ${x + 9},86 ${x - 7},102 ${x - 1},88 ${x - 8},88`, '#FFC24B'));
      else out.push(P(`M${x} 74 q6 10 0 14 q-6 -4 0 -14 z`, '#7FC7E8'));
    }
    out.push(face(cx, 46, .8, { eye: p.eye, mouth: p.mouth, cheek: '#BFD6E4' }));
  } else if (k === 'rainbow') {
    const cols = ['#EF5B3E', '#F79833', '#FFD24B', '#6FC46F', '#4FA3D9', '#8C7BD9'];
    cols.forEach((c, i) => out.push(S(`M${18 + i * 6} 96 a${42 - i * 6} ${42 - i * 6} 0 0 1 ${(42 - i * 6) * 2} 0`, c, 6.5)));
    out.push(cloud(24, 96, .7, '#FFFDF7'), cloud(96, 96, .7, '#FFFDF7'));
    out.push(face(60, 74, .7, { eye: p.eye, mouth: p.mouth, gap: 7, cheek: '#FF9DB0' }));
  } else if (k === 'wind') {
    out.push(S('M16 46 q34 -14 52 -2 q10 7 0 13 q-8 4 -12 -4', '#9FC7DC', 6));
    out.push(S('M20 68 q40 -12 62 0 q10 7 -1 13 q-9 4 -13 -5', '#B9D8E8', 6));
    out.push(S('M26 90 q28 -8 44 0', '#CFE4EF', 6));
    out.push(face(74, 56, .7, { eye: p.eye, mouth: p.mouth || 'oh', cheek: '#BFD6E4' }));
  } else if (k === 'mountain') {
    out.push(P('M6 98 l32 -52 l20 30 l14 -20 l42 42 z', p.f || '#7C9E86'));
    out.push(P('M38 46 l12 20 h-24 z', '#FFFDF7'));
    out.push(face(56, 78, .7, { eye: p.eye, mouth: p.mouth, cheek: p.cheek }));
  } else if (k === 'water') {
    out.push(P(`M10 ${p.top || 56} q12 -10 25 0 q13 10 25 0 q12 -10 25 0 q13 10 25 0 v46 h-100 z`, p.f || '#5BB3E0'));
    out.push(S(`M22 ${(p.top || 56) + 20} q10 -6 20 0 M64 ${(p.top || 56) + 30} q10 -6 20 0`, '#FFFFFF', 3.4, { opacity: .55 }));
    out.push(face(58, (p.top || 56) + 26, .8, { eye: p.eye, mouth: p.mouth, cheek: p.cheek }));
  } else if (k === 'fire') {
    out.push(P('M60 20 q22 24 20 44 q-2 24 -20 30 q-18 -6 -20 -30 q-2 -20 20 -44 z', p.f || '#F26B2A'));
    out.push(P('M60 46 q13 16 12 28 q-1 14 -12 18 q-11 -4 -12 -18 q-1 -12 12 -28 z', '#FFC24B'));
    out.push(face(60, 74, .72, { eye: p.eye, mouth: p.mouth, ink: '#7A3312', cheek: false }));
  }
  if (p.extra) out.push(p.extra);
  return out.join('');
}

/* ================= SHAPE / NUMBER ============================== */
function shapeArt(p, seed) {
  const out = [], cx = 60, cy = 62, f = p.f || '#4FA3D9';
  const k = p.kind;
  if (k === 'circle') out.push(C(cx, cy, 34, f));
  else if (k === 'square') out.push(R(cx - 32, cy - 32, 64, 64, 8, f));
  else if (k === 'rect') out.push(R(cx - 38, cy - 24, 76, 48, 8, f));
  else if (k === 'triangle') out.push(P(`M${cx} ${cy - 34} l36 60 h-72 z`, f));
  else if (k === 'star') out.push(PG(Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 15 : 36; return `${n(cx + Math.cos(a) * r)},${n(cy + Math.sin(a) * r)}`; }).join(' '), f));
  else if (k === 'heart') out.push(P(`M${cx} ${cy + 30} q-38 -22 -30 -42 q6 -15 22 -6 q5 3 8 8 q3 -5 8 -8 q16 -9 22 6 q8 20 -30 42 z`, f));
  else if (k === 'diamond') out.push(PG(`${cx},${cy - 36} ${cx + 28},${cy} ${cx},${cy + 36} ${cx - 28},${cy}`, f));
  else if (k === 'oval') out.push(E(cx, cy, 36, 26, f));
  else if (k === 'cross') out.push(R(cx - 11, cy - 34, 22, 68, 5, f) + R(cx - 34, cy - 11, 68, 22, 5, f));
  else if (k === 'line') out.push(S(`M20 ${cy} h80`, f, 10));
  else if (k === 'dot') out.push(C(cx, cy, 16, f));
  else if (k === 'cube') { out.push(PG(`${cx - 28},${cy - 8} ${cx},${cy - 24} ${cx + 28},${cy - 8} ${cx},${cy + 8}`, shade(f, .25))); out.push(PG(`${cx - 28},${cy - 8} ${cx},${cy + 8} ${cx},${cy + 38} ${cx - 28},${cy + 22}`, f)); out.push(PG(`${cx + 28},${cy - 8} ${cx},${cy + 8} ${cx},${cy + 38} ${cx + 28},${cy + 22}`, shade(f, -.2))); }
  out.push(face(cx, cy + (p.faceY || 4), p.fs || .9, { eye: p.eye, mouth: p.mouth, cheek: p.cheek }));
  if (p.extra) out.push(p.extra);
  return out.join('');
}

function numArt(p, seed) {
  const out = [], cnt = p.n, cols = p.cols || Math.min(5, Math.max(1, cnt));
  if (p.big) {
    out.push(`<text x="60" y="82" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="${p.size || 74}" fill="${p.f || '#EF5B3E'}">${p.big}</text>`);
    out.push(face(60, 60, .55, { eye: p.eye, mouth: p.mouth, gap: 6, cheek: false, ink: '#FFF6EA' }));
    return out.join('');
  }
  const rows = Math.ceil(cnt / cols);
  const cw = Math.min(22, 76 / cols), ch = Math.min(22, 62 / rows);
  const cols_ = ['#EF5B3E', '#FFC24B', '#4FA3D9', '#6FC46F', '#B98CD9'];
  for (let i = 0; i < cnt; i++) {
    const r = Math.floor(i / cols), c = i % cols;
    const rowCount = Math.min(cols, cnt - r * cols);
    const x = 60 + (c - (rowCount - 1) / 2) * cw;
    const y = 62 + (r - (rows - 1) / 2) * ch;
    out.push(C(x, y, Math.min(9, cw * .42), cols_[i % 5]));
  }
  return out.join('');
}

/* ================= DISPATCH ==================================== */
const FAM = { animal, bird, fish, bug, fruit, veg, vehicle, person, thing, dish, building, garment, plant, sky, shape: shapeArt, num: numArt };
const CAT_TINT = {
  animals: '#FCE3C6', food: '#FBDCD3', family: '#E4DCF5', jobs: '#E4DCF5', body: '#FBD9DE',
  feelings: '#FBE0C9', home: '#DDEBE0', clothes: '#DCE9F5', school: '#E7E2D2', toys: '#F7DCE9',
  music: '#EADDF3', sports: '#D7EBE3', transport: '#DCE7F2', nature: '#DCEEDC', places: '#E9E3D5',
  colors: '#F3E3D0', shapes: '#DFE9F5', numbers: '#F6E2C8', time: '#E3E6F2', culture: '#F7DAD2',
  phrases: '#E5EDE0', describing: '#EFE3D6', position: '#DEE9EE', misc: '#E8E4DA'
};
const CAT_FALLBACK = {
  animals: ['animal', { f: '#C9A47C', ear: 'round', body: true, sn: 'oval' }],
  food: ['dish', { kind: 'bowl', fill: '#F6C445' }],
  family: ['person', { pose: 'stand' }], jobs: ['person', { pose: 'stand' }],
  body: ['person', { pose: 'stand' }], feelings: ['person', { pose: 'stand' }],
  home: ['thing', { s: [['r', 34, 46, 52, 46, 8, '#D9C5A8']] }],
  clothes: ['garment', { kind: 'shirt' }],
  school: ['thing', { s: [['r', 34, 40, 52, 58, 6, '#E8C879']] }],
  toys: ['thing', { s: [['c', 60, 64, 30, '#F27EA9']] }],
  music: ['thing', { s: [['c', 60, 64, 28, '#B98CD9']] }],
  sports: ['person', { pose: 'run' }],
  transport: ['vehicle', {}], nature: ['plant', { kind: 'tree' }],
  places: ['building', {}], colors: ['shape', { kind: 'circle' }], shapes: ['shape', { kind: 'circle' }],
  numbers: ['num', { n: 3 }], time: ['thing', { s: [['c', 60, 62, 32, '#FFF6EA'], ['c', 60, 62, 27, '#EADFCB'], ['s', 'M60 62 v-16 M60 62 l12 8', '#3B2C2A', 4]] }],
  culture: ['thing', { s: [['c', 60, 62, 28, '#EF5B3E']] }],
  phrases: ['person', { pose: 'wave' }],
  describing: ['shape', { kind: 'circle', f: '#F0A868' }],
  position: ['thing', { s: [['r', 34, 60, 52, 34, 6, '#D9C5A8'], ['c', 60, 44, 12, '#EF5B3E']] }],
  misc: ['thing', { s: [['c', 60, 64, 28, '#9FB8C9']] }]
};

function drawArt(key, cat) {
  const spec = A[key] || CAT_FALLBACK[cat] || CAT_FALLBACK.misc;
  const fam = FAM[spec[0]] || thing;
  const body = fam(spec[1] || {}, key);
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">${ground(key, CAT_TINT[cat] || '#E8E4DA')}${body}</svg>`;
}
