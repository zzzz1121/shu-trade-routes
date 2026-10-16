(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./engine'),require('./level'),require('./presenter'));else root.ShuController=factory(root.ShuEngine,root.ShuLevel,root.ShuPresenter);})(this,function(E,Levels,P){
'use strict';
const KEY='shu-trade-progress-v2';
function normalize(data){if(!data||data.version!==2)return {version:2,completed:[],tutorialDone:[],last:'l01'};const valid=id=>Levels.all.some(l=>l.id===id);return {version:2,completed:Array.isArray(data.completed)?data.completed.filter(valid):[],tutorialDone:Array.isArray(data.tutorialDone)?data.tutorialDone.filter(valid):[],last:valid(data.last)?data.last:'l01'};}
function create(storage={}){
 let progress;try{progress=normalize(storage.read&&storage.read(KEY));}catch{progress=normalize(null);}
 let session=E.createSession(Levels.get(progress.last));
 const ui={screen:'home',x:3,payIron:0,payNote:0,amount:1,receive:'iron',message:'',error:false,modal:null,hint:0,skip:false,tradeId:null};
 const save=()=>{try{if(storage.write)storage.write(KEY,progress);}catch{ui.message='本机进度未能保存，本次仍可继续。';ui.error=true;}};
 const unlocked=l=>l.number===1||progress.completed.includes(Levels.all[l.number-2].id);
 function defaults(){const t=session.level.transactions.find(t=>t.nodeId===session.state.nodeId&&!session.state.completedTransactions.includes(t.id));ui.tradeId=t?t.id:null;ui.payIron=t&&t.type==='buy'?t.minIron:0;ui.payNote=0;ui.receive='iron';ui.amount=1;}
 function lesson(id){const l=session.level;if(ui.skip||progress.tutorialDone.includes(l.id)||session.state.tutorialFlags[id]||!l.lessons[id])return;ui.modal={kind:'lesson',id,title:l.lessons[id][0],body:l.lessons[id][1]};}
 function begin(id){const l=Levels.get(id);if(!unlocked(l))return;session=E.createSession(l);Object.assign(ui,{screen:'intro',x:3,message:'',error:false,modal:null,hint:0,skip:progress.tutorialDone.includes(l.id)});defaults();progress.last=l.id;save();if(ui.skip)ui.screen='play';}
 function act(a){const r=session.act(a);ui.error=!r.ok;ui.message=r.ok?P.eventText(r.event,session.level):r.message;if(!r.ok)return;
  ui.modal=null;defaults();
  if(r.state.status==='won'){if(!progress.completed.includes(session.level.id))progress.completed.push(session.level.id);if(!progress.tutorialDone.includes(session.level.id))progress.tutorialDone.push(session.level.id);save();}
  else if(r.state.status==='playing'){if(a.type==='depart')lesson('route');else if(a.type==='move')lesson(r.state.nodeId);}
 }
 function selectNode(id){if(ui.modal)return;const l=session.level,n=l.nodes.find(n=>n.id===id);if(!n)return;
  const s=session.state,r=id===s.nodeId?null:E.transition(s,{type:'move',to:id},l),trades=l.transactions.filter(t=>t.nodeId===id).map(t=>P.tradeRule(t,l));
  ui.modal={kind:'move',nodeId:id,title:n.name,body:[id===s.nodeId?'当前所在地':'移动 1 步'+(n.toll?' · 每次进入付 '+n.toll+' 铁钱':' · 无通行费'),...trades,...(r&&!r.ok?[r.message]:[])].join('\n'),canMove:!!(r&&r.ok)};
 }
 function dispatch(id){const l=session.level,s=session.state;
  // A modal owns input; background clicks and stale double-click events cannot execute actions.
  const modalActions=['close','confirm-move','lesson-next','skip-tutorial','hint-next','rule-prev','rule-next','history-prev','history-next'];
  if(ui.modal&&!modalActions.includes(id))return;
  if(id.startsWith('level:')){begin(id.slice(6));return;}
  if(id==='start'){begin(progress.last);return;}
  if(id==='chapters'){ui.screen='chapters';ui.modal=null;return;}
  if(id==='home'){ui.screen='home';return;}
  if(id==='play'||id==='skip-intro'){ui.screen='play';if(id==='skip-intro'){ui.skip=true;if(!progress.tutorialDone.includes(l.id))progress.tutorialDone.push(l.id);save();}else lesson('money');return;}
  if(id==='close'){if(ui.modal&&ui.modal.kind==='lesson')session.markTutorial(ui.modal.id);ui.modal=null;return;}
  if(id==='confirm-move'){const m=ui.modal;if(m&&m.kind==='move'&&m.canMove)act({type:'move',to:m.nodeId});return;}
  if(id==='lesson-next'){const m=ui.modal;if(!m||m.kind!=='lesson')return;session.markTutorial(m.id);ui.modal=null;if(m.id==='money'&&l.exchange)lesson('exchange');return;}
  if(id==='skip-tutorial'){ui.skip=true;if(!progress.tutorialDone.includes(l.id))progress.tutorialDone.push(l.id);save();ui.modal=null;return;}
  if(id==='replay'){ui.modal={kind:'story',title:l.intro[0],body:l.intro[1]};return;}
  if(id==='rules'){ui.modal={kind:'rules',page:0};return;}
  if(id==='rule-next'||id==='rule-prev'){const max=P.view(session,ui).rules.length-1;ui.modal.page=Math.max(0,Math.min(max,ui.modal.page+(id==='rule-next'?1:-1)));return;}
  if(id==='hint'){ui.hint=0;ui.modal={kind:'hint',title:'行商提示',body:l.hints[0]};return;}
  if(id==='hint-next'){ui.hint=Math.min(2,ui.hint+1);ui.modal.body=l.hints[ui.hint];return;}
  if(id==='history'){ui.modal={kind:'history',page:0};return;}
  if(id==='history-next'||id==='history-prev'){ui.modal.page=Math.max(0,Math.min(1,ui.modal.page+(id==='history-next'?1:-1)));return;}
  if(id==='retry'){session.reset();Object.assign(ui,{x:3,message:'',error:false,modal:null,skip:progress.tutorialDone.includes(l.id),hint:0});defaults();return;}
  if(id==='undo'){session.undo();ui.message='已撤销';ui.error=false;ui.modal=null;defaults();return;}
  if(id==='next'){const next=Levels.all[l.number];if(next)begin(next.id);else ui.screen='chapters';return;}
  if(id==='receive-iron'||id==='receive-note'){ui.receive=id==='receive-iron'?'iron':l.issuer;return;}
  const adjust=/^(x|p|n|amount)([+-])$/.exec(id);if(adjust){const key={x:'x',p:'payIron',n:'payNote',amount:'amount'}[adjust[1]],t=l.transactions.find(t=>t.id===ui.tradeId),min=key==='x'?2:key==='amount'?1:0,max=key==='x'?s.warehouseIron:key==='amount'?t.limit:t.price;ui[key]=Math.max(min,Math.min(max,ui[key]+(adjust[2]==='+'?1:-1)));ui.message='';return;}
  if(id==='transact'){const panel=P.view(session,ui).panel;if(panel.action)act(panel.action);return;}
  if(['exchange','depart','deliver'].includes(id))act(id==='exchange'?{type:id,amount:ui.x}:{type:id});
 }
 function view(){const v=P.view(session,ui),m=ui.modal?Object.assign({},ui.modal):null;
  if(m&&m.kind==='rules'){const rule=v.rules[m.page];m.title=rule[0];m.body=rule[1];m.count=v.rules.length;}
  if(m&&m.kind==='history'){const pages=[['交子的来路','北宋蜀地铁钱沉重，携带不便。民间票据的发展与商号信用和兑现能力相连。'],['从民间到官办','天圣元年设益州交子务，次年发行官交子。\n资料：成都博物馆；全国哲学社会科学工作办公室，何平（2023）。']];m.title=pages[m.page][0];m.body=pages[m.page][1];m.count=2;}
  return Object.assign(v,{screen:ui.screen,message:ui.message,error:ui.error,modal:m,hintLevel:ui.hint,chapters:Levels.all.map(l=>({id:l.id,title:l.title,number:l.number,mission:l.mission,locked:!unlocked(l),completed:progress.completed.includes(l.id)})),lastTitle:Levels.get(progress.last).title,hasProgress:progress.completed.length>0,nextLabel:lNext(v.level)});
 }
 function lNext(l){return l.number<Levels.all.length?'下一关':'查看全部章节';}
 return {view,dispatch,selectNode,get session(){return session;},get progress(){return JSON.parse(JSON.stringify(progress));}};
}
return {create,normalize,KEY};
});
