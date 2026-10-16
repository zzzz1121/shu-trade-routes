const Controller=require('../../core/controller');
const Scene=require('../../ui/scene');
Page({
 data:{ready:false},
 onLoad:function(){
  this.game=Controller.create({read:key=>{const r=typeof xhs!=='undefined'?xhs.getStorageSync(key):null;return r&&r.version?r:r&&r.data;},write:(key,data)=>{if(typeof xhs==='undefined')throw new Error('Storage unavailable');xhs.setStorageSync(key,data);}});
  this.refresh();
 },
 refresh:function(){
  const v=Scene.decorate(this.game.view());
  v.resources.concat(v.cargo).forEach(r=>{r.spriteStyle='left:'+(-(r.icon%2)*100)+'%;top:'+(-Math.floor(r.icon/2)*100)+'%;';});
  v.backdrop=v.modular?'/assets/v2/terrain.png':'/assets/approved/town-extended.png';
  v.atlas=v.modular?'/assets/v2/buildings.png':'/assets/approved/town-atlas.png';
  v.ready=true;this.setData(v);
 },
 onAction:function(e){this.game.dispatch(e.currentTarget.dataset.action);this.refresh();},
 onMove:function(e){this.game.selectNode(e.currentTarget.dataset.node||e.currentTarget.dataset.building);this.refresh();}
});
