/* Loads the art engine (core + families + registry) into a sandbox and
   returns its public surface. Used by the preview harness and the build. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const B = __dirname;
module.exports = function loadArt(withRegistry = true) {
  const files = ['core.js', 'families.js'].concat(withRegistry ? ['registry.js'] : []);
  const src = files.map(f => {
    const p = path.join(B, f);
    return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
  }).join('\n');
  const ctx = vm.createContext({ console, Math, Object, Array, String, Number, JSON, parseInt });
  const api = vm.runInContext(src + '\n;({A, drawArt, CAT_TINT, CAT_FALLBACK, shade})', ctx, { filename: 'art.js' });
  return { api, src };
};
