// Deterministic original synthesis; no downloaded, licensed or sampled material.
const fs=require('node:fs'),path=require('node:path');
const out=path.resolve(__dirname,'../miniapp/assets/audio'),rate=22050;fs.mkdirSync(out,{recursive:true});
let seed=4173;function noise(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2147483648-1;}
function make(seconds){return new Float64Array(Math.ceil(seconds*rate));}
function add(a,b,start=0,scale=1){const offset=Math.round(start*rate);for(let i=0;i<b.length&&i+offset<a.length;i++)a[i+offset]+=b[i]*scale;return a;}
function rustle(seconds=.18,level=.3){const a=make(seconds);let low=0;for(let i=0;i<a.length;i++){const n=noise();low+=.14*(n-low);const t=i/rate;const env=Math.pow(Math.sin(Math.PI*t/seconds),1.5);a[i]=(n-low)*env*level*(.7+.3*Math.sin(2*Math.PI*43*t));}return a;}
function tap(wood=false){const a=make(.14);let low=0;for(let i=0;i<a.length;i++){const t=i/rate,n=noise();low+=.1*(n-low);a[i]=(low*.8+Math.sin(2*Math.PI*(wood?260:125)*t)*.18)*Math.exp(-t*(wood?48:36))*Math.min(1,t/.003);}return a;}
function coin(seconds=.28){const a=make(seconds);for(let i=0;i<a.length;i++){const t=i/rate;let v=0;for(const f of [920,1435,2121])v+=Math.sin(2*Math.PI*f*t)*Math.exp(-t*(15+f/400));a[i]=v*.085*Math.min(1,t/.003);}return a;}
function softTone(freq,seconds=.22){const a=make(seconds);for(let i=0;i<a.length;i++){const t=i/rate;a[i]=(Math.sin(2*Math.PI*freq*t)+.12*Math.sin(2*Math.PI*freq*2*t))*.1*Math.pow(Math.sin(Math.PI*t/seconds),2);}return a;}
function env(kind){const a=make(8);let low=0,slow=0;for(let i=0;i<a.length;i++){const t=i/rate,n=noise();low+=.025*(n-low);slow+=.003*(n-slow);const fade=Math.min(1,t/.3,(8-t)/.3);a[i]=(kind==='water'?low*.35*(.7+.3*Math.sin(2*Math.PI*.7*t))+slow*.3:slow*.8+low*.1)*fade;}
 if(kind==='market'){for(const start of [1.4,4.8,6.6])add(a,tap(),start,.06);}if(kind==='paper'){for(const start of [1.1,4.7])add(a,rustle(.35),start,.13);for(let i=0;i<a.length;i++)a[i]*=.35;}return a;}
function wav(name,a){let peak=0;for(const v of a)peak=Math.max(peak,Math.abs(v));if(peak>.8)for(let i=0;i<a.length;i++)a[i]*=.8/peak;const b=Buffer.alloc(44+a.length*2);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(rate,24);b.writeUInt32LE(rate*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(a.length*2,40);for(let i=0;i<a.length;i++)b.writeInt16LE(Math.round(Math.max(-1,Math.min(1,a[i]))*32767),44+i*2);fs.writeFileSync(path.join(out,name+'.wav'),b);}
const sounds={
 'ambience-market':env('market'),'ambience-water':env('water'),'ambience-paper':env('paper'),
 'step-earth':tap(),'step-wood':tap(true),'arrive':add(make(.2),tap(),0,.55),
 'ui-click':add(make(.07),tap(),0,.32),'ui-page':rustle(.2,.17),'ui-dialogue':rustle(.14,.15),'ui-continue':rustle(.085,.13),
 'exchange':add(add(make(.48),coin(),0,.8),rustle(.2),.2,.55),'pay-iron':add(add(make(.36),coin(),0,.65),coin(),.08,.32),'pay-note':rustle(.23,.22),
 'purchase':add(add(make(.25),tap(),0,.5),rustle(.13),.08,.35),
 'delivery':add(add(make(.4),tap(true),0,.6),rustle(.25),.09,.45),
 'error':add(add(make(.23),tap(),0,.48),tap(),.09,.25),
 'win':add(add(add(make(.85),softTone(294,.35),0),softTone(392,.4),.18,.8),softTone(440,.4),.4,.6),
 'unlock':add(add(make(.45),rustle(.18),0,.4),softTone(392,.3),.1,.7)
};
for(const [name,a] of Object.entries(sounds))wav(name,a);
fs.writeFileSync(path.join(out,'README.md'),'# 临时音效\n\n本目录全部 WAV 由 scripts/generate-sounds.js 确定性生成，原创程序合成，无第三方采样。用于验证安静的纸张/钱币/脚步反馈，非正式录音素材。单声道、22050Hz、16-bit PCM；环境为 8 秒淡入淡出循环。统一映射见 ui/sound-catalog.js，替换文件无需改事件调用。\n');
console.log('Generated '+Object.keys(sounds).length+' original placeholder WAV files');
