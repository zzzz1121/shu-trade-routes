const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),N=require('../miniapp/ui/narrative');
const emotions=['neutral','smile','thinking','puzzled','worried','firm'];
test('四位角色各自拥有六张独立透明立绘，实际图片比例与渲染一致',()=>{
 const files=new Set();
 for(const name of Object.keys(N.characters))for(const emotion of emotions){
  const a=N.actor(name,'/miniapp/assets',emotion),b=fs.readFileSync(path.join(__dirname,'..',a.portrait));
  assert.equal(b.toString('ascii',1,4),'PNG');
  const [w,h]=a.aspectStyle.match(/[\d.]+/g).map(Number);assert.ok(Math.abs(w/h-b.readUInt32BE(16)/b.readUInt32BE(20))<.001,name+' image ratio');
  assert.equal(b[25],6,'transparent RGBA asset');assert.equal(a.expression,emotion);assert.equal(a.format,'single');files.add(a.portrait);
 }
 assert.equal(files.size,24);
});
test('立绘不再依赖相邻格裁切；未知表情安全回落普通表情',()=>{
 for(const name of Object.keys(N.characters)){
  for(const emotion of emotions){const a=N.actor(name,'/assets',emotion);assert.equal(a.frameStyle,'left:0%;top:0%;');assert.equal(a.cellStyle,'top:0%;');assert.ok(a.portrait.endsWith('/'+emotion+'.png'));}
  assert.equal(N.actor(name,'/assets','missing').expression,'neutral');
 }
 assert.equal(N.actor('旁白','/assets').visible,false);
});
