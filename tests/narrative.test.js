const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const C=require('../miniapp/core/controller'),N=require('../miniapp/ui/narrative'),L=require('../miniapp/core/level');
function game(id){return C.create({read:()=>({version:2,completed:L.all.filter(l=>l.id<id).map(l=>l.id),tutorialDone:[],last:id})});}
test('六章开幕与进度均取当前章，叙事装饰不修改游戏状态或关卡',()=>{
 for(const l of L.all){const c=game(l.id),before=JSON.stringify(c.session.state),rules=JSON.stringify(l);const v=N.decorate(c.view());assert.ok(v.narrative.line&&v.narrative.opening);assert.equal(v.currentChapter.id,l.id);assert.equal(v.completedCount,l.number-1);assert.ok(fs.existsSync('.'+v.narrative.speaker.portrait));assert.equal(JSON.stringify(c.session.state),before);assert.equal(JSON.stringify(l),rules);}
});
test('三位角色独立资源可替换，小程序使用自身素材路径',()=>{
 const speakers=new Set();for(const l of L.all){const v=N.decorate(game(l.id).view(),'/assets');speakers.add(v.narrative.speaker.name);assert.match(v.narrative.speaker.portrait,/^\/assets\/characters\//);}assert.deepEqual([...speakers].sort(),['罗掌柜','许掌柜','阿禾'].sort());
});
test('常规与重播对白拥有角色；非核心商人由阿禾转述，不冒用掌柜身份',()=>{
 const c=game('l01');c.dispatch('start');c.dispatch('play');let v=N.decorate(c.view());assert.equal(v.modal.actor.name,'阿禾');assert.equal(v.modal.important,false);c.dispatch('skip-tutorial');c.dispatch('replay');v=N.decorate(c.view());assert.equal(v.modal.actor.name,'罗掌柜');assert.equal(v.modal.important,true);
 const base=c.view();base.modal={kind:'lesson',title:'布商',body:'至少给我两份铁钱。'};v=N.decorate(base);assert.equal(v.modal.actor.name,'阿禾');assert.match(v.modal.body,/布商说/);
});
test('地点氛围文案不替代实时费用条件，查看与取消不改变状态',()=>{
 const c=game('l01');c.dispatch('start');c.dispatch('skip-intro');const before=c.session.state;c.selectNode('bridge');const v=N.decorate(c.view());assert.ok(v.modal.flavor);assert.match(v.modal.body,/1 铁钱/);c.dispatch('close');assert.deepEqual(c.session.state,before);
});
test('失败回应明确可撤销，不伪造通关回应',()=>{
 const v=game('l05').view();v.s.status='failed';N.decorate(v);assert.equal(v.outroActor.name,'阿禾');assert.match(v.outroText,/退回上一步/);
});

test('六关史话融入成功回应；失败和未交付不出现，不改变状态',()=>{
 const texts=new Set();for(const l of L.all){const c=game(l.id);const before=c.session.state;let v=N.decorate(c.view());assert.equal(v.historyLine,'');v=c.view();v.s.status='failed';assert.equal(N.decorate(v).historyLine,'');v=c.view();v.s.status='won';v=N.decorate(v);assert.ok(v.historyLine.length>20);texts.add(v.historyLine);assert.deepEqual(c.session.state,before);}assert.equal(texts.size,6);
});
test('章节有六个独立插画单元且不改游戏拓扑',()=>{
 const c=game('l06'),before=JSON.stringify(c.session.level);const v=N.decorate(c.view());assert.equal(new Set(v.chapters.map(x=>x.artStyle)).size,6);assert.equal(new Set(v.chapters.map(x=>x.positionStyle)).size,6);assert.ok(v.chapters.every(x=>x.scene.endsWith('/chapters/chapter-scenes.png')));assert.equal(v.chapterRoads.length,5);assert.equal(JSON.stringify(c.session.level),before);
});
