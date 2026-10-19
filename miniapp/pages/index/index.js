const Controller=require('../../core/controller');
const Scene=require('../../ui/scene');
const Narrative=require('../../ui/narrative');
const Sound=require('../../ui/sound');
const Backends=require('../../ui/sound-backends');
const Experience=require('../../ui/experience');
Page({
 data:{ready:false},
 onLoad:function(){
  this.game=Controller.create({read:key=>{const r=typeof xhs!=='undefined'?xhs.getStorageSync(key):null;return r&&r.version?r:r&&r.data;},write:(key,data)=>{if(typeof xhs==='undefined')throw new Error('Storage unavailable');xhs.setStorageSync(key,data);}});
  this.sound=Sound.create({base:'/assets/audio',backend:Backends.native(typeof xhs!=='undefined'?xhs:null),read:key=>{const r=typeof xhs!=='undefined'?xhs.getStorageSync(key):null;return r&&r.version?r:r&&r.data;},write:(key,data)=>{if(typeof xhs!=='undefined')xhs.setStorageSync(key,data);}});
  this.experience=Experience.create(this.game,Object.assign({},this.motionOptions||{},{sound:this.sound,levels:['l01'],changed:()=>this.refresh(),frame:(point,phase)=>this.setData({'traveler.style':'left:'+point[0]+'%;top:'+point[1]+'%;','traveler.phase':phase})}));
  this.refresh();
 },
 refresh:function(){
  const v=Narrative.decorate(Scene.decorate(this.game.view()),'/assets');
  const m=this.experience&&this.experience.moving,n=v.nodes.find(n=>n.current),point=m?m.point:[n.x,n.y];
  v.showTraveler=this.experience&&this.experience.enabled(v.level);v.moving=!!m;v.traveler={style:'left:'+point[0]+'%;top:'+point[1]+'%;',phase:m?m.phase:''};
  v.routeSegments.forEach(e=>{e.walking=!!m&&(e.edge===m.edge||e.edge===m.to+'-'+m.from);});
  if(m)v.modal=null;
  v.soundSettings=this.sound?this.sound.getSettings():{};v.volumePercent=Math.round((v.soundSettings.volume||0)*100);
  v.resources.concat(v.cargo).forEach(r=>{r.spriteStyle='left:'+(-(r.icon%2)*100)+'%;top:'+(-Math.floor(r.icon/2)*100)+'%;';});
  v.backdrop=v.modular?'/assets/v2/terrain.png':'/assets/approved/town-extended.png';
  v.atlas=v.modular?'/assets/v2/buildings.png':'/assets/approved/town-atlas.png';
  v.ready=true;this.setData(v);
 },
 onAction:function(e){if(this.experience.busy||this.experience.suspended)return;const id=e.currentTarget.dataset.action;if(typeof id!=='string')return;this.sound.activate();if(id.indexOf('sound:')===0){const c=this.sound.getSettings();if(id==='sound:effects')this.sound.configure({effectsEnabled:!c.effectsEnabled});else if(id==='sound:ambience')this.sound.configure({ambienceEnabled:!c.ambienceEnabled});else if(id==='sound:up'||id==='sound:down')this.sound.setVolume(Math.round((c.volume+(id==='sound:up' ? .1 : -.1))*100)/100);this.sound.play('ui.click');this.refresh();}else this.experience.dispatch(id);},
 onMove:function(e){this.experience.selectNode(e.currentTarget.dataset.node||e.currentTarget.dataset.building);},
 onHide:function(){if(this.experience)this.experience.suspend();},
 onShow:function(){if(this.experience)this.experience.resume();},
 onUnload:function(){if(this.experience)this.experience.destroy();}
});
