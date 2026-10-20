const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const C=require('../miniapp/core/controller'),Scene=require('../miniapp/ui/scene'),Experience=require('../miniapp/ui/experience'),Sound=require('../miniapp/ui/sound'),Catalog=require('../miniapp/ui/sound-catalog'),L=require('../miniapp/core/level');
function clock(){let time=0,id=0;const jobs=new Map();return {now:()=>time,setTimeout:(f,delay)=>{jobs.set(++id,{f,time:time+delay});return id;},clearTimeout:id=>jobs.delete(id),advance(delta){const target=time+delta;for(;;){const next=[...jobs].sort((a,b)=>a[1].time-b[1].time)[0];if(!next||next[1].time>target)break;jobs.delete(next[0]);time=next[1].time;next[1].f();}time=target;},get pending(){return jobs.size;}};}
function audio(){const calls=[],loops=[];return {calls,loops,activate(){calls.push(['activate']);},play:(...args)=>calls.push(args),stopEffects(){calls.push(['stop']);},environment:v=>loops.push(v)};}
function start(teaching=false){const g=C.create();g.dispatch('start');g.dispatch(teaching?'play':'skip-intro');g.dispatch('x+');g.dispatch('x+');g.dispatch('exchange');g.dispatch('depart');return g;}
test('六关双向路径匹配现有邻接；弯道首尾和按距离插值准确',()=>{
 for(const l of L.all)for(const [a,b] of l.edges){const p=Scene.routePoints(l,a,b);assert.deepEqual(p.slice().reverse(),Scene.routePoints(l,b,a));assert.deepEqual(Scene.routeSample(p,0),p[0]);assert.deepEqual(Scene.routeSample(p,1).map(v=>Math.round(v*1000)/1000),p[p.length-1]);assert.ok(Scene.routeSample(p,.5).every(Number.isFinite));}assert.equal(Scene.routePoints(L.all[0],'warehouse','delivery'),null);assert.ok(Scene.routePoints(L.all[0],'warehouse','bridge').length>2);
});
test('480ms 行走与 80ms 落点后才提交；途中连点不重复扣款计步',()=>{
 const g=start(),t=clock(),backend=audio(),sound=Sound.create(Object.assign({backend},t)),frames=[];const x=Experience.create(g,Object.assign({sound,frame:(p,phase)=>frames.push([p,phase])},t));g.selectNode('bridge');const before=g.session.state;x.dispatch('confirm-move');assert.equal(x.busy,true);assert.deepEqual(g.session.state,before);x.dispatch('confirm-move');x.selectNode('shop');x.dispatch('transact');t.advance(240);assert.notDeepEqual(x.moving.point,x.moving.points[0]);assert.deepEqual(g.session.state,before);t.advance(240);assert.equal(x.moving.phase,'arriving');assert.deepEqual(g.session.state,before);t.advance(79);assert.deepEqual(g.session.state,before);t.advance(1);assert.equal(x.busy,false);assert.equal(g.session.state.stepsUsed,1);assert.equal(g.session.state.iron,before.iron-1);assert.ok(frames.length>=16);assert.ok(backend.calls.some(c=>c[0]==='move.bridge'));
});
test('商铺剧情在落点后出现；进入后台取消未提交走动，恢复后可再次确认',()=>{
 const g=start(true),t=clock();g.selectNode('bridge');g.dispatch('confirm-move');g.dispatch('play');g.dispatch('close');g.selectNode('shop');const before=g.session.state;const x=Experience.create(g,t);x.dispatch('confirm-move');assert.equal(g.view().modal.kind,'move');t.advance(200);x.suspend();t.advance(1000);assert.equal(x.busy,false);assert.deepEqual(g.session.state,before);x.resume();x.dispatch('confirm-move');t.advance(560);assert.equal(g.session.state.nodeId,'shop');assert.equal(g.session.state.stepsUsed,before.stepsUsed+1);assert.equal(g.view().modal.kind,'lesson');assert.equal(g.view().modal.id,'shop');
});
test('取消走动、撤销与重试不会残留定时提交；行走不写入存档',()=>{
 const g=start(),t=clock(),x=Experience.create(g,t);g.selectNode('bridge');x.dispatch('confirm-move');x.dispatch('home');t.advance(1000);assert.equal(g.session.state.nodeId,'warehouse');g.dispatch('resume');g.selectNode('bridge');x.dispatch('confirm-move');x.dispatch('undo');t.advance(1000);assert.equal(g.session.state.departed,false);x.destroy();assert.equal(t.pending,0);
});
test('音效/环境独立、音量钳制与持久化；首次手势前和后台不播放',()=>{
 const backend=audio(),t=clock(),saved={},s=Sound.create(Object.assign({backend,read:k=>saved[k],write:(k,v)=>saved[k]=v},t));s.scene({map:true,bridge:true});assert.equal(s.play('move.arrive'),false);s.activate();s.play('move.arrive');assert.equal(backend.calls.filter(c=>c[0]==='move.arrive').length,1);s.configure({effectsEnabled:false});assert.equal(s.play('move.step'),false);assert.ok(backend.loops.at(-1)['ambience.water'].gain>0);s.configure({ambienceEnabled:false});assert.deepEqual(backend.loops.at(-1),{});s.setVolume(99);assert.equal(s.getSettings().volume,1);s.setVolume(-2,'ambience');assert.equal(s.getSettings().ambienceVolume,0);assert.equal(Sound.create({read:k=>saved[k]}).getSettings().effectsEnabled,false);s.configure({effectsEnabled:true});s.suspend();assert.equal(s.play('trade.iron'),false);s.resume();assert.equal(s.play('trade.iron'),true);
});
test('声音连点冷却、有限队列、关闭音效取消延迟声；关闭环境不关闭交互声',()=>{
 const backend=audio(),t=clock(),s=Sound.create(Object.assign({backend},t));s.activate();for(let i=0;i<100;i++)s.play('move.arrive');assert.equal(backend.calls.filter(c=>c[0]==='move.arrive').length,1);t.advance(200);assert.equal(s.play('move.arrive'),true);for(let i=0;i<30;i++)s.sequence(['trade.iron','trade.note','trade.purchase']);assert.ok(s.state.pending<=16);s.configure({effectsEnabled:false});assert.equal(t.pending,0);t.advance(1000);assert.equal(backend.calls.filter(c=>c[0]==='trade.note').length,0);s.configure({effectsEnabled:true,ambienceEnabled:false});assert.equal(s.play('trade.note'),true);s.destroy();assert.equal(s.play('ui.page'),false);
});
test('桥边水声与铺边纸声增强、对白压低环境；离开地图清空环境层',()=>{
 const backend=audio(),s=Sound.create({backend});s.activate();s.scene({map:true});const normal=backend.loops.at(-1);s.scene({map:true,bridge:true});assert.ok(backend.loops.at(-1)['ambience.water'].gain>normal['ambience.water'].gain);s.scene({map:true,paper:true});assert.ok(backend.loops.at(-1)['ambience.paper'].gain>0);s.scene({map:true,dialogue:true});assert.ok(backend.loops.at(-1)['ambience.market'].gain<normal['ambience.market'].gain);s.scene({map:false});assert.deepEqual(backend.loops.at(-1),{});
});
test('清单全部映射本地有效 PCM 音频，无第三方资源或空占位文件',()=>{
 assert.equal(Object.keys(Catalog.entries).length,24);for(const cue of Object.values(Catalog.entries)){const b=fs.readFileSync(path.join(__dirname,'../miniapp/assets/audio',cue.file));assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.toString('ascii',8,12),'WAVE');assert.equal(b.readUInt16LE(20),1);assert.equal(b.readUInt16LE(22),1);assert.equal(b.readUInt32LE(24),22050);assert.equal(b.readUInt32LE(40),b.length-44);let peak=0;for(let i=44;i<b.length;i+=2)peak=Math.max(peak,Math.abs(b.readInt16LE(i)));assert.ok(peak>0&&peak<30000);}
});
test('真实支付触发铁钱/交子/购买声；通关首次解锁，重玩不重复解锁声',()=>{
 const g=C.create(),t=clock(),backend=audio(),sound=Sound.create(Object.assign({backend},t)),x=Experience.create(g,Object.assign({sound,duration:0,landing:0},t));
 function act(id){x.dispatch(id);}function move(id){x.selectNode(id);act('confirm-move');}
 function win(){act('start');act('skip-intro');act('x+');act('x+');act('exchange');act('depart');move('bridge');move('shop');for(let i=0;i<4;i++)act('n+');act('transact');t.advance(400);move('delivery');act('deliver');t.advance(800);}
 win();for(const id of ['trade.exchange','trade.iron','trade.note','trade.purchase','trade.delivery','system.win','system.unlock'])assert.ok(backend.calls.some(c=>c[0]===id),id);assert.equal(g.session.state.status,'won');const unlocked=backend.calls.filter(c=>c[0]==='system.unlock').length;t.advance(1000);win();assert.equal(backend.calls.filter(c=>c[0]==='system.unlock').length,unlocked);
});
test('出售、换票、兑付走同一声音总线；非法超重交易只提示错误',()=>{
 for(const [id,node,command] of [['l04','tea_shop','transact'],['l03','exchange','transact'],['l05','xu_exchange','transact'],['l02','medicine_shop','transact']]){
  const g=C.create({read:key=>key===C.KEY?{version:2,last:id,completed:L.all.map(l=>l.id),tutorialDone:L.all.map(l=>l.id)}:null}),t=clock(),backend=audio(),sound=Sound.create(Object.assign({backend},t)),x=Experience.create(g,Object.assign({sound,duration:0,landing:0},t));x.dispatch('start');x.selectNode(node);x.dispatch('confirm-move');
  if(id==='l04')x.dispatch('receive-note');if(id==='l02')for(let i=0;i<4;i++)x.dispatch('n+');const before=g.session.state;x.dispatch(command);t.advance(500);
  const expected=id==='l04'?'trade.note':id==='l02'?'system.error':'trade.exchange';assert.ok(backend.calls.some(c=>c[0]===expected),id+' '+expected);if(id==='l02'){assert.deepEqual(g.session.state,before);assert.ok(!backend.calls.some(c=>c[0]==='trade.purchase'));}
 }
});
test('原生音频适配器限制声部并释放结束/错误/后台资源；无 API 时静默降级',async()=>{
 const B=require('../miniapp/ui/sound-backends'),all=[];
 const backend=B.native({createInnerAudioContext(){const a={play(){this.played=true;},stop(){},destroy(){this.disposed=true;},onEnded(f){this.ended=f;},onError(f){this.failed=f;}};all.push(a);return a;}});
 for(let i=0;i<20;i++)backend.play('move.arrive','/assets/audio/ui-click.wav',.3);assert.equal(all.filter(a=>!a.disposed).length,4);assert.ok(all.every(a=>a.obeyMuteSwitch));all.at(-1).ended();assert.equal(all.filter(a=>!a.disposed).length,3);
 backend.environment({water:{url:'/assets/audio/ambience-water.wav',gain:.2}});const water=all.at(-1);assert.equal(water.loop,true);water.failed();assert.equal(water.disposed,true);backend.environment({water:{url:'/assets/audio/ambience-water.wav',gain:.1}});assert.equal(all.at(-1).volume,0);await new Promise(r=>setTimeout(r,380));assert.equal(all.at(-1).volume,.1);backend.suspend();assert.ok(all.every(a=>a.disposed));backend.destroy();assert.doesNotThrow(()=>B.native(null).play('a','b',1));
});
test('本轮只开放第一关演出，其他关保留即时移动且不启动环境音',()=>{
 const g=C.create({read:key=>key===C.KEY?{version:2,last:'l02',completed:['l01'],tutorialDone:['l02']}:null}),t=clock(),backend=audio(),sound=Sound.create(Object.assign({backend},t)),x=Experience.create(g,Object.assign({sound,levels:['l01']},t));x.dispatch('start');x.selectNode('grain_shop');x.dispatch('confirm-move');assert.equal(x.busy,false);assert.equal(g.session.state.nodeId,'grain_shop');assert.equal(g.session.state.stepsUsed,1);assert.deepEqual(backend.loops.at(-1),{});assert.ok(!backend.calls.some(c=>String(c[0]).startsWith('move.')));assert.equal(t.pending,0);
});

 test('普通点击、页面切换与对白操作保持安静，交易反馈仍可播放',()=>{const backend=audio(),s=Sound.create({backend});s.activate();for(const id of ['ui.click','ui.page','ui.dialogue','ui.continue'])assert.equal(s.play(id),false);assert.equal(backend.calls.filter(c=>String(c[0]).startsWith('ui.')).length,0);assert.equal(s.play('trade.iron'),true);});
