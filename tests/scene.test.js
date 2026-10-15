const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../miniapp/core/engine'),P=require('../miniapp/core/presenter'),S=require('../miniapp/ui/scene'),L=require('../miniapp/core/level');
test('视觉映射保持六条道路、六个地点及原始规则数据不变',()=>{const g=E.createSession(),before=JSON.stringify(L);const v=S.decorate(P.view(g,3,2));assert.deepEqual(v.edges.map(e=>e.key),L.edges.map(e=>e.join('-')));assert.deepEqual(v.nodes.map(n=>n.id),L.nodes.map(n=>n.id));assert.equal(JSON.stringify(L),before);assert.equal(v.nodes.find(n=>n.id==='delivery').name,'交付商行');});
test('钱袋显示区分货仓库存与出发后负重，货物占两格',()=>{const g=E.createSession();let v=S.decorate(P.view(g,5,2));assert.equal(v.bagWeight,0);assert.equal(v.weight,8);assert.equal(v.slots.length,5);g.act({type:'exchange',amount:5});g.act({type:'depart'});v=S.decorate(P.view(g,5,2));assert.equal(v.slots.filter(s=>s.kind==='iron').length,3);g.act({type:'move',to:'bridge'});g.act({type:'move',to:'shop'});g.act({type:'buy',iron:2,note:4});v=S.decorate(P.view(g,5,2));assert.equal(v.slots.filter(s=>s.kind==='cloth').length,2);assert.equal(v.bagWeight,2);});
test('图集分区完整覆盖画面，六建筑区互不重叠，道路仅来自关卡边',()=>{
 const rect=t=>{const n=[...t.style.matchAll(/(?:left|top|width|height):([\d.]+)%/g)].map(m=>Number(m[1]));return n;};
 const regions=[...Object.values(S.frames),...S.terrainTiles.map(rect)];
 assert.equal(regions.reduce((area,[x,y,w,h])=>area+w*h,0),10000);
 for(let i=0;i<regions.length;i++){const [x,y,w,h]=regions[i];assert.ok(x>=0&&y>=0&&w>0&&h>0&&x+w<=100&&y+h<=100);for(let j=i+1;j<regions.length;j++){const [a,b,c,d]=regions[j];assert.ok(Math.min(x+w,a+c)<=Math.max(x,a)||Math.min(y+h,b+d)<=Math.max(y,b),'分区重叠');}}
 const v=S.decorate(P.view(E.createSession(),5,2));assert.equal(v.artRegions.length,6);assert.deepEqual([...new Set(v.routeSegments.map(s=>s.edge))],L.edges.map(e=>e.join('-')));
});
