(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./engine'),require('./level'),require('./presenter'),require('./dialogue'));else root.ShuController=factory(root.ShuEngine,root.ShuLevel,root.ShuPresenter,root.ShuDialogue);})(this,function(E,Levels,P,D){
'use strict';
const KEY='shu-trade-progress-v2',RUN_KEY='shu-trade-run-v1',copy=o=>JSON.parse(JSON.stringify(o));
function normalize(data){if(!data||data.version!==2)return {version:2,completed:[],tutorialDone:[],last:'l01'};const valid=id=>Levels.all.some(l=>l.id===id);return {version:2,completed:Array.isArray(data.completed)?data.completed.filter(valid):[],tutorialDone:Array.isArray(data.tutorialDone)?data.tutorialDone.filter(valid):[],last:valid(data.last)?data.last:'l01'};}
function create(storage={}){
 let progress;try{progress=normalize(storage.read&&storage.read(KEY));}catch{progress=normalize(null);}
 const last=Levels.get(progress.last);if(last.number>1&&!progress.completed.includes(Levels.all[last.number-2].id))progress.last='l01';
 let session=E.createSession(Levels.get(progress.last)),uiHistory=[],resume=null,resumeState=null,returnModal=null;
 try{const data=storage.read&&storage.read(RUN_KEY);if(data&&data.version===1&&data.session&&data.session.levelId===progress.last){const restored=E.restoreSession(data.session);if((restored.level.number===1||progress.completed.includes(Levels.all[restored.level.number-2].id))&&restored.state.status==='playing'&&Array.isArray(data.history)&&data.history.length===data.session.records.filter(r=>r.action).length&&data.history.every(u=>validUI(u,restored.level))&&validUI(data.ui,restored.level)){resume=data;resumeState=restored.state;}}}catch{}
 const ui={screen:'home',x:3,payIron:0,payNote:0,amount:1,receive:'iron',message:'',error:false,modal:null,hint:0,skip:false,tradeId:null,plan:null,backlog:[],choices:{}};
 const save=()=>{try{if(storage.write)storage.write(KEY,progress);}catch{ui.message='本机进度未能保存，本次仍可继续。';ui.error=true;}};
 const unlocked=l=>l.number===1||progress.completed.includes(Levels.all[l.number-2].id);
 function defaults(){const t=session.level.transactions.find(t=>t.nodeId===session.state.nodeId&&!session.state.completedTransactions.includes(t.id));ui.tradeId=t?t.id:null;ui.payIron=t&&t.type==='buy'?Math.min(t.minIron,session.state.iron):0;ui.payNote=0;ui.receive='iron';ui.amount=1;}
 function lesson(id){const l=session.level;if(ui.skip||progress.tutorialDone.includes(l.id)||session.state.tutorialFlags[id]||!l.lessons[id])return;const line=D.teaching(l,id);ui.modal={kind:'lesson',id,title:line.speaker,body:line.text,line};remember(line);}
 function begin(id){const l=Levels.get(id);if(!unlocked(l))return;session=E.createSession(l);uiHistory=[];returnModal=null;Object.assign(ui,{screen:'intro',plan:null,backlog:[],choices:{},x:3,message:'',error:false,modal:null,hint:0,skip:progress.tutorialDone.includes(l.id)});defaults();progress.last=l.id;save();if(ui.skip)ui.screen='play';}
 function act(a){const before=copy(ui);if(before.modal&&before.modal.kind==='move')before.modal=null;const lessonId=ui.modal&&ui.modal.kind==='lesson'?ui.modal.id:null;const r=session.act(a);ui.error=!r.ok;ui.message=r.ok?P.eventText(r.event,session.level):r.message;if(!r.ok)return;uiHistory.push(before);
  if(lessonId)session.markTutorial(lessonId);ui.modal=null;defaults();
  if(r.state.status==='won'){if(!progress.completed.includes(session.level.id))progress.completed.push(session.level.id);if(!progress.tutorialDone.includes(session.level.id))progress.tutorialDone.push(session.level.id);save();}
  else if(r.state.status==='playing'){if(a.type==='depart')lesson('route');else if(a.type==='move')lesson(r.state.nodeId);}
 }
 function selectNode(id){if(ui.modal&&ui.modal.kind!=='lesson')return;const l=session.level,n=l.nodes.find(n=>n.id===id);if(!n)return;
  const s=session.state,r=id===s.nodeId?null:E.transition(s,{type:'move',to:id},l),trades=l.transactions.filter(t=>t.nodeId===id).map(t=>P.tradeRule(t,l));
  ui.modal={kind:'move',nodeId:id,title:n.name,body:[id===s.nodeId?'当前所在地':'移动 1 步'+(n.toll?' · 每次进入付 '+n.toll+' 铁钱':' · 无通行费'),...trades,...(r&&!r.ok?[r.message]:[])].join('\n'),canMove:!!(r&&r.ok)};
 }
 function dispatchInner(id){if(typeof id!=='string')return;const l=session.level,s=session.state;
  // Returning to the entry screen is also used for browser page restoration.
  if(id==='home'){ui.screen='home';ui.modal=null;return;}
  // Confirmation dialogs own input; teaching cards leave gameplay available.
  if(ui.modal&&ui.modal.kind==='menu'&&['rules','chapters','replay','retry','backlog','history','home'].includes(id))ui.modal=null;
  const modalActions=['close','confirm-move','lesson-next','skip-tutorial','hint-next','rule-prev','rule-next','history-prev','history-next','dialogue-next','dialogue-skip','backlog','backlog-return'];
  if(id.startsWith('choice:')&&ui.modal&&ui.modal.kind==='story')modalActions.push(id);
  if(ui.modal&&ui.modal.kind!=='lesson'&&!modalActions.includes(id))return;
  if(id.startsWith('level:')){begin(id.slice(6));return;}
  if(id==='resume'){if(resume){session=E.restoreSession(resume.session);Object.assign(ui,copy(resume.ui));uiHistory=copy(resume.history);clampControls();returnModal=null;}else begin(progress.last);return;}
  if(id==='start'){begin(progress.last);return;}
  if(id==='plan:speed'||id==='plan:economy'){ui.plan=ui.plan===id.slice(5)?null:id.slice(5);return;}
  if(id==='chapters'){ui.screen='chapters';ui.modal=null;return;}
  if(id==='play'||id==='skip-intro'){ui.screen='play';if(id==='skip-intro'){ui.skip=true;if(!progress.tutorialDone.includes(l.id))progress.tutorialDone.push(l.id);save();}else lesson('money');return;}
  if(id==='close'){if(ui.modal&&ui.modal.kind==='lesson')session.markTutorial(ui.modal.id);ui.modal=null;return;}
  if(id==='confirm-move'){const m=ui.modal;if(m&&m.kind==='move'&&m.canMove)act({type:'move',to:m.nodeId});return;}
  if(id==='lesson-next'){const m=ui.modal;if(!m||m.kind!=='lesson')return;session.markTutorial(m.id);ui.modal=null;if(m.id==='money'&&l.exchange)lesson('exchange');return;}
  if(id==='skip-tutorial'){ui.skip=true;if(!progress.tutorialDone.includes(l.id))progress.tutorialDone.push(l.id);save();ui.modal=null;return;}
  if(id==='replay'){openStory('opening');return;}
  if(id==='dialogue-next'){const m=ui.modal;if(m&&m.kind==='story'&&m.cursor<m.lines.length-1){m.cursor++;showLine();}return;}
  if(id==='dialogue-skip'){if(ui.modal&&ui.modal.kind==='story')ui.modal=null;return;}
  if(id.startsWith('choice:')){const m=ui.modal;if(!m||m.kind!=='story'||m.cursor!==m.lines.length-1)return;const choice=m.choices.find(c=>c.id===id.slice(7));if(!choice)return;ui.choices[m.scene+':'+choice.id]=true;remember(D.line(m.scene+':choice:'+choice.id,'你',choice.label,'neutral'));if(choice.next)openStory(choice.next);else ui.modal=null;return;}
  if(id==='backlog'){if(ui.modal&&ui.modal.kind==='backlog')return;returnModal=copy(ui.modal);ui.modal={kind:'backlog',title:'对话回看'};return;}
  if(id==='backlog-return'){if(ui.modal&&ui.modal.kind==='backlog'){ui.modal=returnModal;returnModal=null;}return;}
  if(id==='menu'){ui.modal={kind:'menu',title:'行商手记'};return;}
  if(id==='history'){ui.modal={kind:'history',page:0};return;}
  if(id==='history-prev'||id==='history-next'){if(ui.modal&&ui.modal.kind==='history')ui.modal.page=Math.max(0,Math.min(5,ui.modal.page+(id==='history-next'?1:-1)));return;}
  if(id==='rules'){ui.modal={kind:'rules',page:0};return;}
  if((id==='rule-next'||id==='rule-prev')&&ui.modal&&ui.modal.kind==='rules'){const max=P.view(session,ui).rules.length-1;ui.modal.page=Math.max(0,Math.min(max,ui.modal.page+(id==='rule-next'?1:-1)));return;}
  if(id==='hint'){ui.hint=0;hint();return;}
  if(id==='hint-next'){if(ui.modal&&ui.modal.kind==='hint'){ui.hint=Math.min(2,ui.hint+1);hint();}return;}
  if(id==='retry'){session.reset();uiHistory=[];returnModal=null;Object.assign(ui,{screen:'play',plan:null,backlog:[],choices:{},x:3,message:'',error:false,modal:null,skip:progress.tutorialDone.includes(l.id),hint:0});defaults();return;}
  if(id==='undo'){if(!session.undo())return;const before=uiHistory.pop();if(before)Object.assign(ui,before);ui.screen='play';ui.message='已返回上一步';ui.error=false;returnModal=null;return;}
  if(id==='next'){const next=Levels.all[l.number];if(next)begin(next.id);else ui.screen='chapters';return;}
  if(id==='receive-iron'||id==='receive-note'){ui.receive=id==='receive-iron'?'iron':l.issuer;return;}
  const adjust=/^(x|p|n|amount)([+-])$/.exec(id);if(adjust){
   const key={x:'x',p:'payIron',n:'payNote',amount:'amount'}[adjust[1]],t=l.transactions.find(t=>t.id===ui.tradeId);
   if(s.status!=='playing'||(key==='x'?(s.departed||s.exchanged||!l.exchange):!s.departed||!t||!['buy','redeem'].includes(t.type)))return;
   const min=key==='x'?l.exchange.min:key==='amount'?1:0,max=key==='x'?s.warehouseIron:key==='amount'?Math.min(t.limit,s.notesByIssuer[t.issuer]||0):key==='payIron'?Math.min(t.price,s.iron):Math.min(t.price,t.issuer?s.notesByIssuer[t.issuer]||0:0);
   if(!Number.isFinite(max)||max<min)return;ui[key]=Math.max(min,Math.min(max,ui[key]+(adjust[2]==='+'?1:-1)));ui.message='';return;
  }
  if(id==='transact'){const panel=P.view(session,ui).panel;if(panel.action)act(panel.action);return;}
  if(['exchange','depart','deliver'].includes(id))act(id==='exchange'?{type:id,amount:ui.x}:{type:id});
 }
 function remember(line){if(!line)return;const last=ui.backlog[ui.backlog.length-1];if(!last||last.id!==line.id)ui.backlog.push(copy(line));if(ui.backlog.length>200)ui.backlog.shift();}
 function clampControls(){const s=session.state,t=session.level.transactions.find(t=>t.nodeId===s.nodeId&&!s.completedTransactions.includes(t.id));ui.tradeId=t?t.id:null;ui.payIron=Math.min(ui.payIron,s.iron,t&&t.price||0);ui.payNote=Math.min(ui.payNote,t&&t.issuer?s.notesByIssuer[t.issuer]||0:0,t&&t.price||0);if(t&&t.type==='redeem')ui.amount=Math.max(1,Math.min(ui.amount,t.limit,s.notesByIssuer[t.issuer]||0));ui.x=Math.max(2,Math.min(ui.x,s.warehouseIron||2));}
 function openStory(key){const scene=D.scenes(session.level,P.view(session,ui).rules)[key];if(!scene)return;ui.modal={kind:'story',scene:scene.id,lines:scene.lines,choices:scene.choices,cursor:0};showLine();}
 function showLine(){const m=ui.modal,line=m.lines[m.cursor];m.title=line.speaker;m.body=line.text;m.line=line;remember(line);}
 function hint(){const line=D.line(session.level.id+':hint:'+ui.hint,'阿禾',session.level.hints[ui.hint],['thinking','firm','smile'][ui.hint],'explain');ui.modal={kind:'hint',title:'行商提示',body:line.text,line};remember(line);}
 function dispatch(id){dispatchInner(id);persist();}
 function persist(){if(ui.screen==='home'||ui.screen==='chapters')return;
  const snapshot={version:1,session:session.snapshot(),ui:copy(ui),history:copy(uiHistory)};
  if(snapshot.ui.modal&&['menu','move','backlog'].includes(snapshot.ui.modal.kind))snapshot.ui.modal=snapshot.ui.modal.kind==='backlog'?copy(returnModal):null;
  resume=session.state.status==='playing'?snapshot:null;resumeState=resume?session.state:null;
  try{if(storage.write)storage.write(RUN_KEY,resume);}catch{ui.message='本次进度未能保存，仍可继续游玩。';ui.error=true;}
 }
 function view(){const v=P.view(session,ui),m=ui.modal?copy(ui.modal):null;
  if(m&&m.kind==='rules'){const rule=v.rules[m.page];m.title=rule[0];m.body=rule[1];m.count=v.rules.length;}
  return Object.assign(v,{screen:ui.screen,canResume:!!resume,resumeSummary:resumeState&&resumeState.departed?'行至'+session.level.nodes.find(n=>n.id===resumeState.nodeId).name+' · 已走 '+resumeState.stepsUsed+' / '+session.level.maxSteps+' 步':'',plan:ui.plan,approach:D.approach(session.level,session.state,ui.plan),backlog:copy(ui.backlog),storyChoices:copy(ui.choices),message:ui.message,error:ui.error,modal:m,hintLevel:ui.hint,chapters:Levels.all.map(l=>({id:l.id,title:l.title,number:l.number,mission:l.mission,locked:!unlocked(l),completed:progress.completed.includes(l.id)})),lastTitle:Levels.get(progress.last).title,hasProgress:progress.completed.length>0,nextLabel:lNext(v.level)});
 }
 function lNext(l){return l.number<Levels.all.length?'下一关':'查看全部章节';}
 return {view,dispatch,selectNode,get session(){return session;},get progress(){return JSON.parse(JSON.stringify(progress));}};
}
function validUI(u,l){
 const text=s=>typeof s==='string'&&s.length<3000,line=l=>l&&text(l.id)&&text(l.speaker)&&text(l.text)&&D.expressions.includes(l.expression)&&text(l.pose);
 if(!u||!['intro','play'].includes(u.screen)||!['x','payIron','payNote','amount','hint'].every(k=>Number.isInteger(u[k])&&u[k]>=0&&u[k]<=100)||u.hint>2||!Array.isArray(u.backlog)||u.backlog.length>200||!u.backlog.every(line)||!u.choices||typeof u.choices!=='object'||![null,'speed','economy'].includes(u.plan))return false;
 const m=u.modal;if(!m)return true;
 if(m.kind==='story')return text(m.scene)&&Array.isArray(m.lines)&&m.lines.length>0&&m.lines.length<=100&&m.lines.every(line)&&Number.isInteger(m.cursor)&&m.cursor>=0&&m.cursor<m.lines.length&&line(m.line)&&Array.isArray(m.choices)&&m.choices.length<=20&&m.choices.every(c=>c&&text(c.id)&&text(c.label)&&[null,'purse','shops','opening'].includes(c.next));
 if(m.kind==='rules'||m.kind==='history')return Number.isInteger(m.page)&&m.page>=0&&m.page<(m.kind==='history'?6:(l.exchange?1:0)+2+l.transactions.length);
 return ['hint','lesson'].includes(m.kind)&&text(m.title)&&text(m.body)&&line(m.line);
}
return {create,normalize,KEY,RUN_KEY};
});
