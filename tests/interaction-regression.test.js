const test=require('node:test'),assert=require('node:assert/strict');
const C=require('../miniapp/core/controller'),E=require('../miniapp/core/engine'),L=require('../miniapp/core/level'),P=require('../miniapp/core/presenter');
function game(id){return C.create({read:()=>({version:2,completed:L.all.map(l=>l.id),tutorialDone:L.all.map(l=>l.id),last:id})});}
test('购买选择不能超过各自余额；上限和下限重复点击不改变状态',()=>{
 for(const l of L.all){const g=game(l.id);g.dispatch('start');for(const t of l.transactions.filter(t=>t.type==='buy')){const s=E.initial(l);s.departed=true;s.nodeId=t.nodeId;s.iron=1;s.notesByIssuer[t.issuer]=2;const v=P.view({state:s,level:l,canUndo:false},{payIron:1,payNote:2});for(const c of v.panel.steppers)assert.equal(c.maxDisabled,true);}
 }
 const g=game('l01');g.dispatch('start');g.dispatch('x+');g.dispatch('x+');g.dispatch('exchange');g.dispatch('depart');g.selectNode('bridge');g.dispatch('confirm-move');g.selectNode('shop');g.dispatch('confirm-move');for(let i=0;i<100;i++){g.dispatch('p+');g.dispatch('n+');}assert.deepEqual(g.view().panel.steppers.map(s=>s.value),[2,4]);for(let i=0;i<100;i++){g.dispatch('p-');g.dispatch('n-');}assert.deepEqual(g.view().panel.steppers.map(s=>s.value),[0,0]);
});
test('进阶六关均有可行解，所有成功局面满足额外目标',()=>{
 for(const base of L.all){const g=game(base.id);g.dispatch('advanced');const l=g.session.level;assert.equal(l.maxSteps,base.challenge.steps);assert.equal(l.minimumReserve,base.challenge.reserve);let wins=0;const seen=new Set();function walk(s){const key=JSON.stringify([s.nodeId,s.stepsUsed,s.iron,s.notesByIssuer,s.cargoById,s.completedTransactions,s.departed,s.exchanged,s.preparation,s.status]);if(seen.has(key))return;seen.add(key);if(s.status==='won'){wins++;assert.ok(s.iron+Object.values(s.notesByIssuer).reduce((a,b)=>a+b,0)>=l.minimumReserve);return;}if(s.status!=='playing')return;for(const a of E.actions(s,l)){const r=E.apply(s,a,l);if(r.ok)walk(r.state);}}walk(E.initial(l));assert.ok(wins>0,base.id+' has challenge solution');}
});
test('无历史撤销不伪造反馈；非游戏金额动作安全忽略',()=>{const g=C.create();g.dispatch('undo');assert.equal(g.view().message,'');g.dispatch(undefined);g.dispatch('amount+');assert.equal(g.view().screen,'home');});
