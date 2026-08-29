const fs=require('fs'),path=require('path');
const {api}=require('../src/art/load.js')();
const dir=path.join(__dirname,'../src/data');
const words=[];
for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.tsv')).sort())
  for(const line of fs.readFileSync(path.join(dir,f),'utf8').split('\n'))
    if(line.trim()) { const c=line.split('\t'); words.push({en:c[0],zh:c[1],py:c[2],twh:c[3],twt:c[4],cat:c[5]}); }
const keys=new Set(Object.keys(api.A));
const missing=words.filter(w=>!keys.has(w.en));
const orphan=[...keys].filter(k=>!words.some(w=>w.en===k));
console.log('words:',words.length,'art:',keys.size,'missing art:',missing.length,'orphan art:',orphan.length);
if(missing.length) console.log('MISSING:',missing.slice(0,40).map(w=>w.en).join(', '));
if(orphan.length) console.log('ORPHAN:',orphan.slice(0,40).join(', '));
let err=0;
for(const w of words){ try{ const s=api.drawArt(w.en,w.cat); if(!s||s.length<200) {console.log('THIN',w.en,s.length);err++;} }catch(e){ console.log('ERR',w.en,e.message); err++; } }
console.log('render errors:',err);
module.exports={words};
