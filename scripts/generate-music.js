// Original deterministic score prototypes. No samples or third-party recordings.
const fs=require('node:fs'),path=require('node:path');const R=22050,D=32,N=R*D,out=path.join(__dirname,'../miniapp/assets/audio');
function wav(name,a){const b=Buffer.alloc(44+a.length*2);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(R,24);b.writeUInt32LE(R*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(a.length*2,40);for(let i=0;i<a.length;i++)b.writeInt16LE(Math.round(Math.tanh(a[i])*.7*32767),44+i*2);fs.writeFileSync(path.join(out,name+'.wav'),b);}
function note(a,midi,start,duration,volume,breath=false){const f=440*2**((midi-69)/12),len=Math.floor(duration*R);for(let i=0;i<len;i++){const t=i/R,attack=Math.min(1,t/(breath?.18:.012)),end=Math.min(1,(duration-t)/.35);let x=breath?Math.sin(2*Math.PI*f*t+.025*Math.sin(t*25))+.15*Math.sin(4*Math.PI*f*t):Math.sin(2*Math.PI*f*t)+.32*Math.sin(4*Math.PI*f*t)*Math.exp(-t*2)+.1*Math.sin(6*Math.PI*f*t)*Math.exp(-t*5);x*=attack*end*Math.exp(-t/(breath?3.8:1.25))*volume;a[(Math.floor(start*R)+i)%a.length]+=x;}}
const themes={
 'music-market':{melody:[62,65,69,null,67,65,62,null,60,62,65,67,69,null,67,null,65,62,60,null,57,60,62,null,65,67,65,62,60,null,62,null],bass:[38,41,36,38]},
 'music-old-note':{melody:[62,null,null,69,null,67,null,null,65,null,62,null,null,60,null,null,62,null,65,null,69,null,67,null,65,null,60,null,57,null,62,null],bass:[38,36,34,38]},
 'music-homecoming':{melody:[65,null,67,69,72,null,69,null,67,65,62,null,65,null,67,null,69,72,74,null,72,69,67,null,65,67,69,65,62,null,65,null],bass:[41,36,38,41]}
};
for(const [name,t] of Object.entries(themes)){const a=new Float64Array(N);t.melody.forEach((m,i)=>{if(m!==null)note(a,m,i,2.6,.12);});t.bass.forEach((m,i)=>{note(a,m,i*8,6,.075);note(a,m+19,i*8+4,3,.04,true);});for(let i=0;i<N;i++)a[i]*=Math.min(1,i/(R*.1),(N-i)/(R*.12));wav(name,a);}
for(const [name,source] of [['prop-box','step-wood'],['prop-paper','pay-note'],['prop-cloth','delivery']])fs.copyFileSync(path.join(out,source+'.wav'),path.join(out,name+'.wav'));
console.log('Generated three 32-second original score prototypes and three prop cues');
