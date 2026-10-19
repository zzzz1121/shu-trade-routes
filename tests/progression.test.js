const test=require('node:test'),assert=require('node:assert/strict'),C=require('../miniapp/core/controller'),Levels=require('../miniapp/core/level');
const routes=[
 [{node:'bridge'},{node:'shop',iron:2,note:4},{node:'delivery'}],
 [{node:'grain_shop',iron:3,note:1},{node:'medicine_shop',iron:1,note:3},{node:'delivery'}],
 [{node:'exchange',trade:true},{node:'west_market',iron:1,note:3},{node:'delivery'}],
 [{node:'tea_shop',receive:'note',trade:true},{node:'street'},{node:'back_alley'},{node:'cloth_shop',iron:2,note:4},{node:'delivery'}],
 [{node:'xu_exchange',amount:3,trade:true},{node:'west_market',iron:5,note:0},{node:'delivery'}],
 [{node:'toll_bridge'},{node:'cloth_shop',iron:3,note:1},{node:'tea_shop',iron:0,note:4},{node:'delivery'}]
];
function complete(g,route){
 if(g.view().screen==='intro')g.dispatch('play');if(g.view().modal)g.dispatch('skip-tutorial');
 if(g.session.level.id==='l01'){g.dispatch('x+');g.dispatch('x+');g.dispatch('exchange');g.dispatch('depart');if(g.view().modal)g.dispatch('skip-tutorial');}
 for(const step of route){g.selectNode(step.node);assert.equal(g.view().modal.canMove,true);g.dispatch('confirm-move');if(g.view().modal)g.dispatch('skip-tutorial');
  if(step.iron!==undefined){for(const [key,target] of [['p',step.iron],['n',step.note]]){const row=g.view().panel.steppers.find(r=>r.key===key);if(!row)continue;for(let n=0;n<Math.abs(target-row.value);n++)g.dispatch(key+(target>row.value?'+':'-'));}g.dispatch('transact');}
  if(step.receive)g.dispatch('receive-'+step.receive);if(step.amount)for(let n=1;n<step.amount;n++)g.dispatch('amount+');if(step.trade)g.dispatch('transact');
 }
 g.dispatch('deliver');assert.equal(g.session.state.status,'won');
}
test('从空进度顺序完成六关，不带入资金，最终解锁可重玩',()=>{let data;const storage={read:key=>key===C.KEY?data:null,write:(key,v)=>{if(key===C.KEY)data=JSON.parse(JSON.stringify(v));}};const g=C.create(storage);g.dispatch('start');for(let i=0;i<6;i++){assert.equal(g.session.level.id,Levels.all[i].id);complete(g,routes[i]);assert.equal(g.progress.completed.length,i+1);g.dispatch('next');}assert.equal(g.view().screen,'chapters');assert.ok(g.view().chapters.every(c=>c.completed&&!c.locked));const reloaded=C.create(storage);reloaded.dispatch('chapters');reloaded.dispatch('level:l02');assert.equal(reloaded.view().screen,'play');assert.equal(reloaded.session.state.iron,5);assert.equal(reloaded.session.state.notesByIssuer.a,4);assert.deepEqual(reloaded.session.state.cargoById,{});});
test('跳过与播放教学走相同合法操作得到相同资源、路线和结算',()=>{const a=C.create(),b=C.create();a.dispatch('start');b.dispatch('start');a.dispatch('play');a.dispatch('lesson-next');a.dispatch('lesson-next');b.dispatch('skip-intro');for(const g of [a,b])complete(g,routes[0]);const resource=g=>{const s=g.session.state;return [s.iron,s.notesByIssuer,s.cargoById,s.stepsUsed,s.routeHistory,s.events,s.delivery];};assert.deepEqual(resource(a),resource(b));});
