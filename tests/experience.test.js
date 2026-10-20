const test=require('node:test'),assert=require('node:assert/strict');
const C=require('../miniapp/core/controller'),E=require('../miniapp/core/engine'),L=require('../miniapp/core/level'),D=require('../miniapp/core/dialogue'),N=require('../miniapp/ui/narrative');
const memory=()=>{const data={};return {data,read:k=>data[k],write:(k,v)=>{data[k]=JSON.parse(JSON.stringify(v));}};};
function move(c,id){c.selectNode(id);c.dispatch('confirm-move');}
function ready(){const store=memory(),c=C.create(store);c.dispatch('start');c.dispatch('skip-intro');c.dispatch('x+');c.dispatch('x+');c.dispatch('exchange');c.dispatch('depart');return {c,store};}
test('金额选择受实际余额限制；连续点击上限不变，余额与历史不变',()=>{
 const {c}=ready();move(c,'bridge');move(c,'shop');const before=c.session.state;
 for(let i=0;i<100;i++){c.dispatch('p+');c.dispatch('n+');}
 assert.deepEqual(c.view().panel.steppers.map(s=>s.value),[2,4]);assert.ok(c.view().panel.steppers.every(s=>s.maxDisabled));assert.deepEqual(c.session.state,before);
 c.dispatch('transact');const bought=c.session.state;c.dispatch('transact');assert.deepEqual(c.session.state,bought);assert.equal(bought.cargoById.cloth,1);
});
test('撤销交付恢复资金货物位置步数；同时恢复剧情分支、回看与付款选值',()=>{
 const {c}=ready();move(c,'bridge');move(c,'shop');for(let i=0;i<4;i++)c.dispatch('n+');c.dispatch('transact');move(c,'delivery');const before=c.session.state,log=c.view().backlog;
 c.dispatch('deliver');assert.equal(c.session.state.status,'won');c.dispatch('replay');while(c.view().modal.cursor<c.view().modal.lines.length-1)c.dispatch('dialogue-next');c.dispatch('choice:purse');c.dispatch('dialogue-skip');c.dispatch('undo');
 assert.deepEqual(c.session.state,before);assert.deepEqual(c.view().backlog,log);assert.deepEqual(c.view().storyChoices,{});assert.equal(c.view().screen,'play');assert.equal(c.progress.completed.includes('l01'),true);
});
test('连续对白按句切换固定人物表情；分支与回看不花钱不耗步，返回保留游标',()=>{
 const {c}=ready(),before=c.session.state;c.dispatch('replay');let v=N.decorate(c.view());assert.equal(v.modal.actor.name,'罗掌柜');assert.equal(v.modal.actor.expression,'neutral');
 while(c.view().modal.cursor<c.view().modal.lines.length-1)c.dispatch('dialogue-next');v=N.decorate(c.view());assert.equal(v.modal.actor.expression,'firm');
 c.dispatch('choice:purse');assert.equal(c.view().modal.line.speaker,'阿禾');const m=c.view().modal;c.dispatch('backlog');assert.equal(c.view().modal.kind,'backlog');c.dispatch('backlog-return');assert.deepEqual(c.view().modal,m);assert.ok(c.view().backlog.some(l=>l.speaker==='你'));c.dispatch('dialogue-skip');assert.deepEqual(c.session.state,before);
});
test('刷新后从首页继续实际局面、对白游标和分支，仍可完整撤销',()=>{
 const {c,store}=ready();move(c,'bridge');const before=c.session.state;c.dispatch('replay');c.dispatch('dialogue-next');const modal=c.view().modal;c.dispatch('backlog');
 const reload=C.create(store);assert.equal(reload.view().screen,'home');assert.equal(reload.view().canResume,true);reload.dispatch('resume');assert.deepEqual(reload.session.state,before);assert.deepEqual(reload.view().modal,modal);reload.dispatch('dialogue-skip');reload.dispatch('undo');assert.equal(reload.session.state.nodeId,'warehouse');assert.equal(reload.session.state.iron,3);
});
test('损坏操作记录或锁定章节存档不恢复，不影响旧进度',()=>{
 const {store}=ready();store.data[C.RUN_KEY].session.records[0].action.amount=999;let c=C.create(store);assert.equal(c.view().canResume,false);
 store.data[C.RUN_KEY].session={version:1,levelId:'l06',records:[]};c=C.create(store);assert.equal(c.view().canResume,false);c.dispatch('start');assert.equal(c.session.level.id,'l01');
});
test('空撤销与无效分页、失效按钮不会伪造反馈或抛错',()=>{
 const c=C.create();c.dispatch('start');c.dispatch('skip-intro');const before=c.session.state;for(const id of ['undo','rule-next','hint-next','amount+','p+','n+',null])assert.doesNotThrow(()=>c.dispatch(id));assert.deepEqual(c.session.state,before);assert.equal(c.view().message,'');
});
test('四角色六表情使用各自独立素材，姿态与逐条对白数据可被替换',()=>{
 for(const name of Object.keys(N.characters)){const frames=D.expressions.map(e=>N.actor(name,'/assets',e,'explain'));assert.equal(new Set(frames.map(a=>a.portrait)).size,6);assert.ok(frames.every(a=>a.pose==='explain'&&a.format==='single'));assert.deepEqual(frames.map(a=>a.expression),D.expressions);}
 for(const l of L.all){const c=C.create({read:k=>k===C.KEY?{version:2,last:l.id,completed:L.all.map(x=>x.id),tutorialDone:[]}:null});const scenes=D.scenes(l,c.view().rules);for(const scene of Object.values(scenes))for(const line of scene.lines)assert.ok(line.id&&line.speaker&&line.expression&&line.pose&&line.text);}
});
test('存档重放包含教学标记，恢复后逐步撤销与原会话一致',()=>{
 const a=E.createSession(L.all[0]);a.markTutorial('money');a.act({type:'exchange',amount:5});a.markTutorial('exchange');a.act({type:'depart'});a.act({type:'move',to:'bridge'});const b=E.restoreSession(a.snapshot());assert.deepEqual(b.state,a.state);while(a.canUndo){assert.equal(b.undo(),a.undo());assert.deepEqual(b.state,a.state);}assert.equal(b.canUndo,false);
});
test('可选打算不改变通关规则，快路与免费路有不同回应',()=>{
 const l=L.all[0],s=E.initial(l);s.status='won';s.stepsUsed=3;s.events=[{type:'move',fee:1}];assert.equal(D.approach(l,s,'speed').met,true);assert.equal(D.approach(l,s,'economy').met,false);s.stepsUsed=4;s.events=[];assert.equal(D.approach(l,s,'economy').met,true);assert.equal(D.approach(l,s,'speed').met,false);
 const c=C.create();c.dispatch('start');const before=c.session.state;c.dispatch('plan:economy');assert.equal(c.view().plan,'economy');assert.deepEqual(c.session.state,before);c.dispatch('plan:economy');assert.equal(c.view().plan,null);
});
