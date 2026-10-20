const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const A=require('../miniapp/ui/map-actors');
test('地图小人四向三帧，坐标不修改原路线；玩家与阿禾使用独立稳定图集',()=>{
 const point=[24,52],companion=[22,50],frames=[];
 for(const heading of ['down','up','right','left'])for(let i=0;i<3;i++)frames.push(A.frame(heading,i));
 assert.equal(new Set(frames).size,12);
 const cast=A.cast(point,'left',2,companion,'/assets');
 assert.equal(cast[0].name,'行商');assert.equal(cast[1].name,'阿禾');
 assert.deepEqual(cast.map(a=>a.point),[point,companion]);assert.deepEqual(point,[24,52]);
 assert.equal(cast[0].frameStyle,'left:-200%;top:-300%;');
 assert.notEqual(cast[0].image,cast[1].image);
 for(const actor of cast){const bytes=fs.readFileSync('miniapp'+actor.image);assert.equal(bytes.toString('hex',0,8),'89504e470d0a1a0a');}
});
