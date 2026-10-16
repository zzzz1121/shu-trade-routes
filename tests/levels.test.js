const test=require('node:test'),assert=require('node:assert/strict'),E=require('../miniapp/core/engine'),Levels=require('../miniapp/core/level');
const move=to=>({type:'move',to}),buy=(id,i,n,issuer='a')=>({type:'buy',transactionId:id,iron:i,notes:issuer?{[issuer]:n}:{}});
const routes={
 l02:[['grain_shop','medicine_shop','delivery'],['medicine_shop','grain_shop','side_street','delivery']],
 l03:[['east_market','delivery'],['exchange','west_market','delivery']],
 l04:[['tea_shop','toll_crossing','cloth_shop','delivery'],['tea_shop','street','back_alley','cloth_shop','delivery']],
 l05:[['east_market','delivery'],['xu_exchange','west_market','delivery']],
 l06:[['toll_bridge','cloth_shop','tea_shop','delivery'],['street','back_alley','cloth_shop','tea_shop','delivery']]
};
const expected={l02:[3,2],l03:[3,1],l04:[1,3],l05:[2,1],l06:[2,4]};
// Enumerate every integer payment/receipt/redemption on each prescribed route through the real engine.
function count(l,route){function walk(s,step){if(s.status==='won')return 1;if(s.status==='failed')return 0;let total=0;const actions=E.actions(s,l).filter(a=>a.type!=='move'||a.to===route[step]);for(const a of actions){const r=E.apply(s,a,l);if(r.ok)total+=walk(r.state,step+(a.type==='move'?1:0));}return total;}return walk(E.initial(l),0);}
for(const l of Levels.all.filter(l=>l.number>1)){
 test(l.title+'：限定路线所有合法组合与中间状态',()=>{assert.deepEqual(routes[l.id].map(r=>count(l,r)),expected[l.id]);});
 test(l.title+'：穷举可达状态无负数/超重，成功可完整撤销',()=>{const seen=new Set();function walk(s){const key=JSON.stringify([s.nodeId,s.iron,s.notesByIssuer,s.cargoById,s.stepsUsed,s.completedTransactions,s.status]);if(seen.has(key))return;seen.add(key);assert.ok(E.weight(s,l)<=l.capacity);assert.ok(s.stepsUsed<=l.maxSteps);for(const n of [s.iron,...Object.values(s.notesByIssuer),...Object.values(s.cargoById)])assert.ok(Number.isSafeInteger(n)&&n>=0);if(s.status!=='playing')return;for(const a of E.actions(s,l)){const before=JSON.stringify(s),r=E.apply(s,a,l);assert.equal(JSON.stringify(s),before);if(r.ok)walk(r.state);}}walk(E.initial(l));assert.ok(seen.size>5);});
}
function act(g,a){const r=g.act(a);assert.equal(r.ok,true,r.message);return r;}
test('第二关先用纯交子买药超重，拒绝后可改为混付',()=>{const l=Levels.get('l02'),g=E.createSession(l);act(g,move('medicine_shop'));const before=g.state,r=g.act(buy('buy-medicine',0,4));assert.equal(r.code,'OVERWEIGHT');assert.deepEqual(g.state,before);act(g,buy('buy-medicine',1,3));act(g,move('grain_shop'));act(g,buy('buy-grain',3,1));assert.equal(E.weight(g.state,l),5);act(g,move('side_street'));act(g,move('delivery'));act(g,{type:'deliver'});assert.equal(g.state.status,'won');});
test('第三关换票一次，甲票不能在西市支付，不能重复取得同一委托货物',()=>{const l=Levels.get('l03'),g=E.createSession(l);act(g,move('exchange'));act(g,{type:'swap',transactionId:'swap-notes'});assert.equal(g.act({type:'swap',transactionId:'swap-notes'}).code,'TRANSACTION_ALREADY_DONE');act(g,move('west_market'));const before=g.state;assert.equal(g.act(buy('buy-west',1,3)).code,'NOTE_ISSUER_NOT_ACCEPTED');assert.deepEqual(g.state,before);act(g,buy('buy-west',1,3,'b'));assert.equal(g.state.iron,3);});
module.exports={routes,count,buy,move,act};
