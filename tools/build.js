/* Bundles the word list, art engine and app into one self-contained page. */
const fs = require('fs'), path = require('path');
const R = (...p) => path.join(__dirname, '..', ...p);
const { src: artSrc } = require('../src/art/load.js')();

const words = [];
for (const f of fs.readdirSync(R('src/data')).filter(f => f.endsWith('.tsv')).sort())
  for (const line of fs.readFileSync(R('src/data', f), 'utf8').split('\n')) {
    if (!line.trim()) continue;
    const c = line.split('\t');
    words.push([c[0], c[1], c[2], c[3], c[4], c[5]]);
  }

const seen = new Set();
for (const w of words) {
  if (w.length !== 6 || w.some(x => !x)) throw new Error('bad row: ' + JSON.stringify(w));
  if (seen.has(w[0])) throw new Error('duplicate word: ' + w[0]);
  seen.add(w[0]);
}

const html = fs.readFileSync(R('src/app.html'), 'utf8')
  .replace('/*__ART__*/', () => artSrc)
  .replace('/*__WORDS__*/', () => 'const WORDS=' + JSON.stringify(words) + ';')
  .replace('/*__APP__*/', () => fs.readFileSync(R('src/app.js'), 'utf8'));

fs.mkdirSync(R('docs'), { recursive: true });
fs.writeFileSync(R('docs/index.html'), html);
console.log('docs/index.html —', words.length, 'words,', (html.length / 1024).toFixed(0) + ' KB');
