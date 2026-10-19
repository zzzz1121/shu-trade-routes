(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./scene'));else root.ShuExperience=factory(root.ShuScene);})(this,function(Scene){
'use strict';
// Only presentation is deferred. The existing controller owns the final atomic move.
function create(game,options={}){
 const sound=options.sound||{activate(){},play(){},sequence(){},scene(){},suspend(){},resume(){}},timer=options.setTimeout||setTimeout,clear=options.clearTimeout||clearTimeout;
 const duration=options.duration===undefined?480:options.duration,landing=options.landing===undefined?80:options.landing;
 const enabled=level=>!options.levels||options.levels.includes(level.id);
 let moving=null,handle=null,generation=0,destroyed=false,suspended=false;
 function changed(){if(options.changed)options.changed();}
 function environment(v){const id=moving&&moving.progress>.7?moving.to:v.s.nodeId,node=v.level.nodes.find(n=>n.id===id),trade=v.level.transactions.find(t=>t.nodeId===id);sound.scene({map:enabled(v.level)&&v.screen==='play'&&v.s.status==='playing',bridge:!!(node&&node.toll),paper:!!(trade&&['exchange','swap','redeem'].includes(trade.type))||id==='exchange'||!!(v.level.exchange&&!v.s.departed&&id===v.level.start),dialogue:!moving&&!!(v.modal&&['story','lesson','hint','backlog'].includes(v.modal.kind)),modal:!moving&&!!v.modal});}
 function sync(){environment(game.view());}
 function react(before,after,id){
  if(!enabled(after.level)&&['play','intro'].includes(after.screen)){if(before.screen!==after.screen)sound.play('ui.page');return;}
  const event=after.s.events.length>before.s.events.length?after.s.events[after.s.events.length-1]:null;
  if(after.error&&(!before.error||after.message!==before.message)){sound.play('system.error');return;}
  if(event){if(event.type==='exchange')sound.play('trade.exchange');
   else if(event.type==='buy')sound.sequence([...(event.iron?['trade.iron']:[]),...(Object.values(event.notes||{}).some(Boolean)?['trade.note']:[]),'trade.purchase']);
   else if(event.type==='sell')sound.sequence([event.receive==='iron'?'trade.iron':'trade.note','trade.purchase']);
   else if(event.type==='swap'||event.type==='redeem')sound.play('trade.exchange');
   else if(event.type==='move'&&event.fee)sound.play('trade.iron');
   else if(event.type==='deliver')sound.sequence(['trade.delivery','system.win',...(after.chapters.some((c,i)=>before.chapters[i].locked&&!c.locked)?['system.unlock']:[])],240);
  }
  if(after.s.status==='failed'&&before.s.status!=='failed')sound.play('system.error');
  if(before.screen!==after.screen){sound.play('ui.page');return;}
  const old=before.modal,m=after.modal;
  if(m&&(!old||old.kind!==m.kind)){sound.play(['story','lesson','hint'].includes(m.kind)?'ui.dialogue':'ui.page');}
  else if(m&&['dialogue-next','lesson-next','hint-next'].includes(id)||id.startsWith('choice:'))sound.play('ui.continue');
  else if(!event)sound.play('ui.click');
 }
 function cancel(){generation++;if(handle!==null)clear(handle);handle=null;moving=null;if(sound.cancel)sound.cancel();}
 function finish(token,before){if(token!==generation||destroyed)return;moving=null;handle=null;game.dispatch('confirm-move');const after=game.view();react(before,after,'confirm-move');sync();changed();}
 function travel(){const before=game.view(),m=before.modal;if(!enabled(before.level)||!m||m.kind!=='move'||!m.canMove)return false;
  const points=Scene.routePoints(before.level,before.s.nodeId,m.nodeId);if(!points)return false;
  const destination=before.level.nodes.find(n=>n.id===m.nodeId),origin=before.level.nodes.find(n=>n.id===before.s.nodeId),bridge=!!(destination.toll||origin.toll),token=++generation;
  moving={from:before.s.nodeId,to:m.nodeId,edge:before.s.nodeId+'-'+m.nodeId,points,point:points[0].slice(),progress:0,phase:'walking',duration};sync();changed();
  if(duration===0){finish(token,before);return true;}
  if(sound.cancel)sound.cancel();sound.play(bridge?'move.bridge':'move.step');let elapsed=0,nextStep=180,near=false;
  function tick(){if(token!==generation||destroyed)return;elapsed=Math.min(duration,elapsed+30);const progress=elapsed/duration,eased=(1-Math.cos(Math.PI*progress))/2;moving.progress=progress;moving.point=Scene.routeSample(points,eased);
   if(elapsed>=nextStep&&elapsed<duration){sound.play(bridge?'move.bridge':'move.step');nextStep+=180;}
   if(progress===1){moving.phase='arriving';sound.play('move.arrive');}
   if(options.frame)options.frame(moving.point.slice(),moving.phase);if(progress>.7&&!near){near=true;sync();}
   if(progress<1)handle=timer(tick,Math.min(30,duration-elapsed));else handle=timer(()=>finish(token,before),landing);
  }handle=timer(tick,Math.min(30,duration));return true;
 }
 function dispatch(id){if(destroyed||suspended||typeof id!=='string')return false;sound.activate();
  if(['home','retry','next','chapters','start','resume'].includes(id)&&sound.cancel)sound.cancel();
  if(moving){if(['home','retry','undo','chapters'].includes(id)){cancel();game.dispatch('close');}else return false;}
  if(id==='confirm-move'&&travel())return true;
  const before=game.view();game.dispatch(id);const after=game.view();react(before,after,id);sync();changed();return true;
 }
 return {dispatch,enabled,selectNode(id){if(moving||destroyed||suspended)return false;sound.activate();const before=game.view();game.selectNode(id);react(before,game.view(),'select-node');sync();changed();return true;},sync,
  suspend(){if(suspended)return;suspended=true;cancel();sound.suspend();changed();},resume(){const wasSuspended=suspended;suspended=false;sound.resume();sync();if(wasSuspended)changed();},
  destroy(){cancel();destroyed=true;if(sound.destroy)sound.destroy();},
  get moving(){return moving?Object.assign({},moving,{point:moving.point.slice(),points:moving.points.map(p=>p.slice())}):null;},get busy(){return !!moving;},get suspended(){return suspended;}
 };
}
return {create};
});
