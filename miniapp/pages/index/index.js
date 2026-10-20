const Controller=require('../../core/controller');
const Scene=require('../../ui/scene');
const Narrative=require('../../ui/narrative');
const Sound=require('../../ui/sound');
const Backends=require('../../ui/sound-backends');
const Experience=require('../../ui/experience');
const Actors=require('../../ui/map-actors');
const StoryView=require('../../ui/story-view');
Page({
 data:{ready:false,roomArtReady:false},
 onLoad:function(){
  this.game=Controller.create({read:key=>{const r=typeof xhs!=='undefined'?xhs.getStorageSync(key):null;return r&&r.version?r:r&&r.data;},write:(key,data)=>{if(typeof xhs==='undefined')throw new Error('Storage unavailable');xhs.setStorageSync(key,data);},remove:key=>{if(typeof xhs!=='undefined'&&xhs.removeStorageSync)xhs.removeStorageSync(key);else throw Error('Storage unavailable');}});
  this.sound=Sound.create({base:'/assets/audio',backend:Backends.native(typeof xhs!=='undefined'?xhs:null),read:key=>{const r=typeof xhs!=='undefined'?xhs.getStorageSync(key):null;return r&&r.version?r:r&&r.data;},write:(key,data)=>{if(typeof xhs!=='undefined')xhs.setStorageSync(key,data);}});
  this.experience=Experience.create(this.game,Object.assign({},this.motionOptions||{},{sound:this.sound,levels:['l01'],changed:()=>this.refresh(),frame:(point,phase,pose)=>this.setData({mapActors:Actors.cast(point,pose.heading,pose.frame,pose.companion,'/assets'), 'traveler.phase':phase})}));
  this.refresh();
 },
 refresh:function(){
  const v=StoryView.decorate(Narrative.decorate(Scene.decorate(this.game.view()),'/assets'));
  if(v.cacheEpoch!==(this.cacheEpoch||0)){this.cacheEpoch=v.cacheEpoch;this.sound.resetPreferences();}
  v.autoEnabled=this.experience.autoEnabled;v.openingActor=Narrative.actor('罗掌柜','/assets','neutral');v.shopActor=Narrative.actor('沈娘子','/assets',v.error?'puzzled':'neutral');v.resultActor=Narrative.actor(v.s.status==='won'?'罗掌柜':'阿禾','/assets',v.s.status==='won'?'smile':'thinking');v.storyPaymentText=v.story&&v.storyPayment.ok?'付款后 '+v.storyPayment.state.iron+' 铁钱、'+v.storyPayment.state.notesByIssuer.a+' 交子 · 负重 '+require('../../core/engine').weight(v.storyPayment.state,v.level)+'/5':v.story&&v.storyPayment.message;
  if(v.story&&v.modal&&v.modal.kind==='commission')v.modal.body='罗记青布一批，货款6、重2格；至少付2铁钱。4步内送达，负重上限5，每次进桥付1铁钱。';
  if(v.modal&&v.modal.kind==='ledger')v.modal.body=v.ledger.map(r=>r.text).join('\n')||'还没有提交钱货。';
  if(v.modal&&v.modal.kind==='wallet')v.modal.body='铁钱 '+v.storyMoney.iron+'，交子 '+v.storyMoney.note+'，青布 '+v.storyMoney.cloth+' 批。';
  const m=this.experience&&this.experience.moving,n=v.nodes.find(n=>n.current),point=m?m.point:[n.x,n.y];
  v.showTraveler=this.experience&&this.experience.enabled(v.level);v.moving=!!m;v.traveler={style:'left:'+point[0]+'%;top:'+point[1]+'%;',phase:m?m.phase:''};
  v.mapActors=Actors.cast(point,m?m.heading:this.experience.heading,m?m.frame||0:0,m&&m.companion,'/assets');
  v.routeSegments.forEach(e=>{e.walking=!!m&&(e.edge===m.edge||e.edge===m.to+'-'+m.from);});
  if(m)v.modal=null;
  v.soundSettings=this.sound?this.sound.getSettings():{};v.volumePercent=Math.round((v.soundSettings.volume||0)*100);v.musicVolumePercent=Math.round((v.soundSettings.musicVolume||0)*100);
  v.resources.concat(v.cargo).forEach(r=>{r.spriteStyle='left:'+(-(r.icon%2)*100)+'%;top:'+(-Math.floor(r.icon/2)*100)+'%;';});
  v.backdrop=v.modular?'/assets/v2/terrain.png':'/assets/approved/town-extended.png';
  v.atlas=v.modular?'/assets/v2/buildings.png':'/assets/approved/town-atlas.png';
  v.transactionCue=!!v.story&&v.s.events.length>(this.eventCount||0)&&['exchange','buy','depart','deliver'].includes(v.s.events[v.s.events.length-1].type);this.eventCount=v.s.events.length;v.ready=true;this.setData(v);
 },
 onAction:function(e){if(this.experience.busy||this.experience.suspended)return;const id=e.currentTarget.dataset.action;if(typeof id!=='string')return;this.sound.activate();if(id.indexOf('sound:')===0){const c=this.sound.getSettings();if(id==='sound:retry')this.sound.activate();else if(id==='sound:music')this.sound.configure({musicEnabled:!c.musicEnabled});else if(id==='sound:music-up'||id==='sound:music-down')this.sound.setVolume(c.musicVolume+(id==='sound:music-up'?.1:-.1),'music');else if(id==='sound:effects')this.sound.configure({effectsEnabled:!c.effectsEnabled});else if(id==='sound:ambience')this.sound.configure({ambienceEnabled:!c.ambienceEnabled});else if(id==='sound:up'||id==='sound:down')this.sound.setVolume(Math.round((c.volume+(id==='sound:up' ? .1 : -.1))*100)/100);this.sound.play('ui.click');this.refresh();}else this.experience.dispatch(id);},
 onMove:function(e){this.experience.selectNode(e.currentTarget.dataset.node||e.currentTarget.dataset.building);},
 onRoomArtLoad:function(){this.setData({roomArtReady:true});},
 onRoomArtError:function(){this.setData({roomArtReady:false});},
 onHide:function(){if(this.experience)this.experience.suspend();},
 onShow:function(){if(this.experience)this.experience.resume();},
 onUnload:function(){if(this.experience)this.experience.destroy();}
});
