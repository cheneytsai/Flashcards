const fs=require('fs'),path=require('path');
const {api}=require('../src/art/load.js')();
const {words}=require('./check.js');
const start=+process.argv[2]||0, count=+process.argv[3]||200, out=process.argv[4];
const slice=words.slice(start,start+count);
const cards=slice.map(w=>`<figure><div class=b>${api.drawArt(w.en,w.cat)}</div><figcaption>${w.en}</figcaption></figure>`).join('');
fs.writeFileSync(out,`<!doctype html><meta charset=utf-8><style>body{background:#E9F2EC;font:10px system-ui;margin:0;padding:12px;display:grid;grid-template-columns:repeat(14,1fr);gap:7px}figure{margin:0;text-align:center}.b{background:#FFFDF7;border-radius:12px}svg{width:100%;display:block}figcaption{margin-top:2px;color:#333;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}</style>${cards}`);
console.log('wrote',slice.length);
