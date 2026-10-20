(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./scene'));else root.ShuExperience=factory(root.ShuScene);})(this,function(Scene){
'use strict';
// Only presentation is deferred. The existing controller owns the final atomic move.
function create(game,options={}){
 const sound=options.sound||{activate(){},play(){},sequence(){},scene(){},suspend(){},resume(){}},timer=options.setTimeout||setTimeout,clear=options.clearTimeout||clearTimeout;
 const duration=options.duration===undefined?480:options.duration,landing=options.landing===undefined?80:options.landing;
 const enabled=level=>!options.levels||options.levels.includes(level.id);
 let autoEnabled=false,autoHandle=null,autoKey='';
 function stopAuto(){if(autoHandle!==null)clear(autoHandle);autoHandle=null;autoKey='';}
 function scheduleAuto(){const v=game.view(),m=v.modal;const key=m&&m.source==='v4'&&v.screen==='play'&&!moving&&!suspended&&!destroyed&&!(m.cursor===m.lines.length-1&&m.choices.length)?m.scene+':'+m.cursor:'';if(!autoEnabled||!key){stopAuto();return;}if(key===autoKey)return;stopAuto();autoKey=key;autoHandle=timer(()=>{autoHandle=null;autoKey='';if(autoEnabled&&!suspended&&!destroyed)dispatch('dialogue-next');},options.autoDelay===undefined?Math.max(1800,Math.min(6000,900+m.body.length*65)):options.autoDelay);}
 let moving=null,handle=null,generation=0,destroyed=false,suspended=false,heading='down';
 function changed(){if(options.changed)options.changed();}
 function environment(v){const id=moving&&moving.progress>.7?moving.to:v.s.nodeId,node=v.level.nodes.find(n=>n.id===id),trade=v.level.transactions.find(t=>t.nodeId===id);const st=v.story,sceneId=st&&st.active&&st.active.id||'',music=['home','chapters'].includes(v.screen)?'market':st&&['record','ending','settled','stay'].includes(st.phase)?'homecoming':/^(old-note|note-|found-box|old-question|alley-note|privacy)/.test(sceneId)?'old-note':'market';sound.scene({music:enabled(v.level)||['home','chapters'].includes(v.screen)?music:null,map:enabled(v.level)&&v.screen==='play'&&v.s.status==='playing',bridge:!!(node&&node.toll),paper:!!(trade&&['exchange','swap','redeem'].includes(trade.type))||id==='exchange'||!!(v.level.exchange&&!v.s.departed&&id===v.level.start),dialogue:!moving&&!!(v.modal&&['story','lesson','hint','backlog'].includes(v.modal.kind)),modal:!moving&&!!v.modal});}
 let cacheEpoch=0;function sync(){const v=game.view();if(v.cacheEpoch!==cacheEpoch){cacheEpoch=v.cacheEpoch;if(sound.resetPreferences)sound.resetPreferences();}environment(v);scheduleAuto();}
 function react(before,after,id){
  if(!enabled(after.level)&&['play','intro'].includes(after.screen)){if(before.screen!==after.screen)sound.play('ui.page');return;}
  const event=after.s.events.length>before.s.events.length?after.s.events[after.s.events.length-1]:null;
  if(after.error&&(!before.error||after.message!==before.message)){sound.play('system.error');return;}
  if(after.story&&after.story.flags.endingSeen&&!(before.story&&before.story.flags.endingSeen)){sound.sequence(['system.win',...(after.chapters.some((c,i)=>before.chapters[i].locked&&!c.locked)?['system.unlock']:[])],240);return;}
  if(event){if(event.type==='depart'&&after.s.events.some(e=>e.type==='exchange')&&!before.s.departed)sound.play('trade.exchange');if(event.type==='exchange')sound.play('trade.exchange');
   else if(event.type==='buy')sound.sequence([...(event.iron?['trade.iron']:[]),...(Object.values(event.notes||{}).some(Boolean)?['trade.note']:[]),'trade.purchase']);
   else if(event.type==='sell')sound.sequence([event.receive==='iron'?'trade.iron':'trade.note','trade.purchase']);
   else if(event.type==='swap'||event.type==='redeem')sound.play('trade.exchange');
   else if(event.type==='move'&&event.fee)sound.play('trade.iron');
   else if(event.type==='deliver'&&after.story)sound.play('trade.delivery');
   else if(event.type==='deliver')sound.sequence(['trade.delivery','system.win',...(after.chapters.some((c,i)=>before.chapters[i].locked&&!c.locked)?['system.unlock']:[])],240);
  }
  if(after.s.status==='failed'&&before.s.status!=='failed')sound.play('system.error');
  if(before.screen!==after.screen){sound.play('ui.page');return;}
  if(id==='object:box'||id==='object:open-box'){sound.play('prop.box');return;}
  if(['object:note','object:order','object:account','object:ledger','ledger'].includes(id)||id==='close'&&before.modal&&['old-note','order'].includes(before.modal.asset)){sound.play('prop.paper');return;}
  if(id==='inspect-confirm'||id==='object:inspect-delivery'){sound.play('prop.cloth');return;}
  const old=before.modal,m=after.modal;
  if(m&&(!old||old.kind!==m.kind)){sound.play(['story','lesson','hint'].includes(m.kind)?'ui.dialogue':'ui.page');}
  else if(m&&['dialogue-next','lesson-next','hint-next'].includes(id)||id.startsWith('choice:')){if(!after.story)sound.play('ui.continue');}
  else if(id==='object:box'||id==='object:open-box')sound.play('prop.box');else if(['object:note','object:order','object:account','object:ledger','ledger'].includes(id))sound.play('prop.paper');else if(id==='inspect-confirm'||id==='object:inspect-delivery')sound.play('prop.cloth');else if(!event&&!['dialogue-next','story-skip-read','close'].includes(id))sound.play('ui.click');
 }
 function cancel(){generation++;if(handle!==null)clear(handle);handle=null;moving=null;if(sound.cancel)sound.cancel();}
 function finish(token,before){if(token!==generation||destroyed)return;moving=null;handle=null;game.dispatch('confirm-move');const after=game.view();react(before,after,'confirm-move');sync();changed();}
 function travel(){const before=game.view(),m=before.modal;if(!enabled(before.level)||!m||m.kind!=='move'||!m.canMove)return false;
  const points=Scene.routePoints(before.level,before.s.nodeId,m.nodeId);if(!points)return false;
  const destination=before.level.nodes.find(n=>n.id===m.nodeId),origin=before.level.nodes.find(n=>n.id===before.s.nodeId),bridge=!!(destination.toll||origin.toll),token=++generation;
  moving={from:before.s.nodeId,to:m.nodeId,edge:before.s.nodeId+'-'+m.nodeId,points,point:points[0].slice(),progress:0,phase:'walking',duration,heading};sync();changed();
  if(duration===0){finish(token,before);return true;}
  if(sound.cancel)sound.cancel();sound.play(bridge?'move.bridge':'move.step');let elapsed=0,nextStep=180,near=false;
  function tick(){if(token!==generation||destroyed)return;elapsed=Math.min(duration,elapsed+30);const progress=elapsed/duration,eased=(1-Math.cos(Math.PI*progress))/2,previous=moving.point;moving.progress=progress;moving.point=Scene.routeSample(points,eased);const dx=moving.point[0]-previous[0],dy=(moving.point[1]-previous[1])/(634/522);if(Math.abs(dx)+Math.abs(dy)>.001)heading=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';moving.heading=heading;moving.frame=progress===1?0:1+(Math.floor(elapsed/110)%2);moving.companion=Scene.routeSample(points,Math.max(0,eased-.07));
   if(elapsed>=nextStep&&elapsed<duration){sound.play(bridge?'move.bridge':'move.step');nextStep+=180;}
   if(progress===1){moving.phase='arriving';sound.play('move.arrive');}
   if(options.frame)options.frame(moving.point.slice(),moving.phase,{heading,frame:moving.frame,companion:moving.companion});if(progress>.7&&!near){near=true;sync();}
   if(progress<1)handle=timer(tick,Math.min(30,duration-elapsed));else handle=timer(()=>finish(token,before),landing);
  }handle=timer(tick,Math.min(30,duration));return true;
 }
 function dispatch(id){if(destroyed||suspended||typeof id!=='string')return false;sound.activate();
  if(id==='dialogue-auto'){autoEnabled=!autoEnabled;stopAuto();sync();changed();return true;}
  stopAuto();if(['home','chapters','retry','story-retry','undo'].includes(id))autoEnabled=false;
  if(['home','retry','next','chapters','start','resume'].includes(id)&&sound.cancel)sound.cancel();
  if(moving){if(['home','retry','undo','chapters'].includes(id)){cancel();game.dispatch('close');}else return false;}
  if(id==='confirm-move'&&travel())return true;
  if(id==='undo'||id==='retry'||id==='story-retry'||id.startsWith('enter:'))heading='down';const before=game.view();game.dispatch(id);const after=game.view();react(before,after,id);sync();changed();return true;
 }
 return {dispatch,enabled,selectNode(id){if(moving||destroyed||suspended)return false;sound.activate();const before=game.view();game.selectNode(id);react(before,game.view(),'select-node');sync();changed();return true;},sync,
  suspend(){if(suspended)return;suspended=true;stopAuto();cancel();sound.suspend();changed();},resume(){const wasSuspended=suspended;suspended=false;sound.resume();sync();if(wasSuspended)changed();},
  destroy(){stopAuto();cancel();destroyed=true;if(sound.destroy)sound.destroy();},
  get autoEnabled(){return autoEnabled;},get heading(){return heading;},get moving(){return moving?Object.assign({},moving,{point:moving.point.slice(),points:moving.points.map(p=>p.slice())}):null;},get busy(){return !!moving;},get suspended(){return suspended;}
 };
}
return {create};
});
