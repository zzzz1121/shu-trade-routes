(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ShuScene=factory();})(this,function(){
// Presentation coordinates only: no adjacency, cost or game state is stored here.
const ratio=634/522;
const positions={warehouse:[22,47],bridge:[43,24],street:[27,75],alley:[49,82],shop:[77,50],delivery:[80,86]};
// Independent art frames in one atlas, never used to determine gameplay.
const frames={warehouse:[0,31,27,37],bridge:[27,9,34,34],shop:[64,22,36,36],street:[29,50,13,23],alley:[42,58,17,22],delivery:[61,62,39,34]};
const paths={
 'warehouse-bridge':[[22,47],[28,42],[30,34],[43,24]],
 'bridge-shop':[[43,24],[54,26],[62,35],[77,50]],
 'warehouse-street':[[22,47],[19,55],[22,63],[27,75]],
 'street-alley':[[27,75],[33,75],[42,81],[49,82]],
 'alley-shop':[[49,82],[58,81],[65,70],[72,59],[77,50]],
 'shop-delivery':[[77,50],[85,58],[88,70],[80,86]]
};
function tile(id,r){const [x,y,w,h]=r;return {id,style:'left:'+x+'%;top:'+y+'%;width:'+w+'%;height:'+h+'%;',imageStyle:'width:'+(10000/w)+'%;height:'+(10000/h)+'%;left:'+(-x/w*100)+'%;top:'+(-y/h*100)+'%;'};}
function subtract(a,b){const [x,y,w,h]=a,[bx,by,bw,bh]=b,l=Math.max(x,bx),t=Math.max(y,by),r=Math.min(x+w,bx+bw),d=Math.min(y+h,by+bh);if(l>=r||t>=d)return [a];return [[x,y,w,t-y],[x,d,w,y+h-d],[x,t,l-x,d-t],[r,t,x+w-r,d-t]].filter(r=>r[2]>0&&r[3]>0);}
let remaining=[[0,0,100,100]];Object.values(frames).forEach(frame=>{remaining=remaining.flatMap(r=>subtract(r,frame));});
const terrainTiles=remaining.map((r,i)=>tile('terrain-'+i,r));
function decorate(v){
 if(v.level.id!=='l01')return modular(v);
 v.terrainTiles=terrainTiles;
 v.artRegions=v.nodes.map(n=>Object.assign(tile(n.id,frames[n.id]),{name:n.name}));
 v.nodes=v.nodes.map(n=>{const pos=positions[n.id];return Object.assign({},n,{name:n.id==='delivery'?'交付商行':n.name,style:'left:'+pos[0]+'%;top:'+pos[1]+'%;',asset:'/assets/approved/town-atlas.png',goal:n.id===v.level.goal,tag:n.current?'所在':n.reachable?'可达':''});});
 v.edges=v.level.edges.map(e=>({key:e.join('-')}));
 v.routeSegments=[];
 v.edges.forEach(e=>{const points=paths[e.key];if(!points)return;for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],dx=b[0]-a[0],dy=(b[1]-a[1])/ratio;v.routeSegments.push({id:e.key+'-'+i,edge:e.key,style:'left:'+a[0]+'%;top:'+a[1]+'%;width:'+Math.sqrt(dx*dx+dy*dy)+'%;transform:rotate('+Math.atan2(dy,dx)*180/Math.PI+'deg);'});}});
 v.bagWeight=v.s.departed?v.weight:0;
 v.slots=Array.from({length:v.level.capacity},(_,i)=>({id:i,kind:i<v.bagWeight?(i<v.s.iron?'iron':'cloth'):'empty'}));
 v.locationName=v.nodes.find(n=>n.current).name;
 v.modular=false;
 return v;
}
function modular(v){
 v.modular=true;v.terrainTiles=[];v.artRegions=[];v.routeSegments=[];
 const ratio=634/522,size=v.nodes.length>6?28:34,height=v.nodes.length>6?26:32;
 v.nodes.forEach(n=>{v.artRegions.push({id:n.id,name:n.name,market:n.art===1,style:'left:'+(n.x-size/2)+'%;top:'+(n.y-height+3)+'%;width:'+size+'%;height:'+height+'%;',imageStyle:'width:300%;height:200%;left:'+(-(n.art%3)*100)+'%;top:'+(-Math.floor(n.art/3)*100)+'%;'});});
 v.level.edges.forEach(e=>{const a=v.nodes.find(n=>n.id===e[0]),b=v.nodes.find(n=>n.id===e[1]),dx=b.x-a.x,dy=(b.y-a.y)/ratio;v.routeSegments.push({id:e.join('-'),edge:e.join('-'),style:'left:'+a.x+'%;top:'+a.y+'%;width:'+Math.sqrt(dx*dx+dy*dy)+'%;transform:rotate('+Math.atan2(dy,dx)*180/Math.PI+'deg);'});});
 return v;
}
function routePoints(level,from,to){
 if(!level.edges.some(e=>e[0]===from&&e[1]===to||e[1]===from&&e[0]===to))return null;
 if(level.id==='l01'){const key=from+'-'+to,reverse=to+'-'+from;return (paths[key]||paths[reverse].slice().reverse()).map(p=>p.slice());}
 return [from,to].map(id=>{const n=level.nodes.find(n=>n.id===id);return [n.x,n.y];});
}
function routeSample(points,t){const lengths=points.slice(1).map((b,i)=>Math.hypot(b[0]-points[i][0],(b[1]-points[i][1])/ratio)),total=lengths.reduce((a,b)=>a+b,0);let distance=Math.max(0,Math.min(1,t))*total;
 for(let i=0;i<lengths.length;i++){if(distance<=lengths[i]||i===lengths.length-1){const f=lengths[i]?distance/lengths[i]:0,a=points[i],b=points[i+1];return [a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f];}distance-=lengths[i];}return points[0].slice();
}
return {decorate:decorate,frames:frames,terrainTiles:terrainTiles,routePoints,routeSample};
});
