(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./engine'),require('./level'),require('./presenter'));else root.ShuController=factory(root.ShuEngine,root.ShuLevel,root.ShuPresenter);})(this,function(E,Levels,P){
'use strict';
const KEY='shu-trade-progress-v2';
const greetings={
 '阿禾':['你来啦！钱袋带好了？这趟商路，我们一起走。','别急着出发，先看看下一家收什么钱。我陪你算。','有拿不准的地方，就来问我。咱们一笔一笔做。'],
 '罗掌柜':['来了？这笔委托，就拜托你了。我在商行等你回来。','货物重要，你也要平安回来。出发前，再看看钱袋。','这一程你自己拿主意，我信得过你。'],
 '许掌柜':['你来得正好。把票拿近些，我帮你看看。','你想兑多少？先留好下一笔买卖要用的钱。','纸上的商号，你可看清了？下一家认不认，也得问问。']
};
function normalize(data){if(!data||data.version!==2)return {version:2,completed:[],tutorialDone:[],last:'l01'};const valid=id=>Levels.all.some(l=>l.id===id);return {version:2,completed:Array.isArray(data.completed)?data.completed.filter(valid):[],tutorialDone:Array.isArray(data.tutorialDone)?data.tutorialDone.filter(valid):[],last:valid(data.last)?data.last:'l01'};}
function create(storage={}){
 let progress;try{progress=normalize(storage.read&&storage.read(KEY));}catch{progress=normalize(null);}
 const last=Levels.get(progress.last);if(last.number>1&&!progress.completed.includes(Levels.all[last.number-2].id))progress.last='l01';
 let session=E.createSession(Levels.get(progress.last));
 const ui={screen:'home',x:3,payIron:0,payNote:0,amount:1,receive:'iron',message:'',error:false,modal:null,hint:0,skip:false,tradeId:null,advanced:false};
 const save=()=>{try{if(storage.write)storage.write(KEY,progress);}catch{ui.message='本机进度未能保存，本次仍可继续。';ui.error=true;}};
 const unlocked=l=>l.number===1||progress.completed.includes(Levels.all[l.number-2].id);
 function defaults(){const t=session.level.transactions.find(t=>t.nodeId===session.state.nodeId&&!session.state.completedTransactions.includes(t.id));ui.tradeId=t?t.id:null;ui.payIron=t&&t.type==='buy'?Math.min(t.minIron,session.state.iron):0;ui.payNote=0;ui.receive='iron';ui.amount=1;}
 function lesson(id){const l=session.level;if(ui.skip||progress.tutorialDone.includes(l.id)||session.state.tutorialFlags[id]||!l.lessons[id])return;ui.modal={kind:'lesson',id,title:l.lessons[id][0],body:l.lessons[id][1]};}
 function begin(id){const l=Levels.get(id);if(!unlocked(l))return;session=E.createSession(ui.advanced?Object.assign({},l,{maxSteps:l.challenge.steps,minimumReserve:l.challenge.reserve}):l);Object.assign(ui,{screen:'intro',x:3,message:'',error:false,modal:null,hint:0,skip:progress.tutorialDone.includes(l.id)});defaults();progress.last=l.id;save();if(ui.skip)ui.screen='play';}
 function act(a){const lessonId=ui.modal&&ui.modal.kind==='lesson'?ui.modal.id:null;const r=session.act(a);ui.error=!r.ok;ui.message=r.ok?P.eventText(r.event,session.level):r.message;if(!r.ok)return;
  if(lessonId)session.markTutorial(lessonId);ui.modal=null;defaults();
  if(r.state.status==='won'){if(!progress.completed.includes(session.level.id))progress.completed.push(session.level.id);if(!progress.tutorialDone.includes(session.level.id))progress.tutorialDone.push(session.level.id);save();}
  else if(r.state.status==='playing'){if(a.type==='depart')lesson('route');else if(a.type==='move')lesson(r.state.nodeId);}
 }
 function selectNode(id){if(ui.modal&&ui.modal.kind!=='lesson')return;const l=session.level,n=l.nodes.find(n=>n.id===id);if(!n)return;
  const s=session.state,r=id===s.nodeId?null:E.transition(s,{type:'move',to:id},l),trades=l.transactions.filter(t=>t.nodeId===id).map(t=>P.tradeRule(t,l));
  ui.modal={kind:'move',nodeId:id,title:n.name,body:[id===s.nodeId?'当前所在地':'移动 1 步'+(n.toll?' · 每次进入付 '+n.toll+' 铁钱':' · 无通行费'),...trades,...(r&&!r.ok?[r.message]:[])].join('\n'),canMove:!!(r&&r.ok)};
 }
 function dispatch(id){if(typeof id!=="string")return;const l=session.level,s=session.state;
  // Returning to the entry screen is also used for browser page restoration.
  if(id==='home'){ui.screen='home';ui.modal=null;return;}
  // Confirmation dialogs own input; teaching cards leave gameplay available.
  if(ui.modal&&ui.modal.kind==='menu'&&['rules','chapters','replay','retry'].includes(id))ui.modal=null;
  const modalActions=['close','confirm-move','lesson-next','skip-tutorial','hint-next','rule-prev','rule-next','talk-next','talk-accept'];
  if(ui.modal&&ui.modal.kind!=='lesson'&&!modalActions.includes(id))return;
  if(id.startsWith('talk:')){const name=id.slice(5);if(!greetings[name])return;ui.modal={kind:'encounter',title:name,body:s.status==='won'?'你这趟生意做得漂亮！歇一歇，再一起走下一程。':s.status==='failed'?'别灰心，我在这儿。我们退回去，一起重新算。':greetings[name][0],turn:0,reply:ui.screen==='home'?'start':ui.screen==='intro'?'play':s.status==='won'?'next':'close',replyLabel:ui.screen==='home'?'一起出发':ui.screen==='intro'?'交给我吧':s.status==='won'?'再走一程':'我再想想'};return;}
  if(id==='talk-next'){if(ui.modal&&ui.modal.kind==='encounter'){ui.modal.turn=(ui.modal.turn+1)%greetings[ui.modal.title].length;ui.modal.body=greetings[ui.modal.title][ui.modal.turn];}return;}
  if(id==='talk-accept'){if(ui.modal&&ui.modal.kind==='encounter'){const reply=ui.modal.reply;ui.modal=null;dispatch(reply);}return;}
  if(id.startsWith('level:')){begin(id.slice(6));return;}
  if(id==='advanced'){ui.advanced=true;begin(progress.last);return;}
  if(id==='start'){ui.advanced=false;begin(progress.last);return;}
  if(id==='chapters'){ui.screen='chapters';ui.modal=null;return;}
  if(id==='play'||id==='skip-intro'){ui.screen='play';if(id==='skip-intro'){ui.skip=true;if(!progress.tutorialDone.includes(l.id))progress.tutorialDone.push(l.id);save();}else lesson('money');return;}
  if(id==='close'){if(ui.modal&&ui.modal.kind==='lesson')session.markTutorial(ui.modal.id);ui.modal=null;return;}
  if(id==='confirm-move'){const m=ui.modal;if(m&&m.kind==='move'&&m.canMove)act({type:'move',to:m.nodeId});return;}
  if(id==='lesson-next'){const m=ui.modal;if(!m||m.kind!=='lesson')return;session.markTutorial(m.id);ui.modal=null;if(m.id==='money'&&l.exchange)lesson('exchange');return;}
  if(id==='skip-tutorial'){ui.skip=true;if(!progress.tutorialDone.includes(l.id))progress.tutorialDone.push(l.id);save();ui.modal=null;return;}
  if(id==='replay'){ui.modal={kind:'story',title:l.intro[0],body:l.intro[1]};return;}
  if(id==='menu'){ui.modal={kind:'menu',title:'行商手记'};return;}
  if(id==='rules'){ui.modal={kind:'rules',page:0};return;}
  if(id==='rule-next'||id==='rule-prev'){const max=P.view(session,ui).rules.length-1;ui.modal.page=Math.max(0,Math.min(max,ui.modal.page+(id==='rule-next'?1:-1)));return;}
  if(id==='hint'){ui.hint=0;ui.modal={kind:'hint',title:'行商提示',body:l.hints[0]};return;}
  if(id==='hint-next'){ui.hint=Math.min(2,ui.hint+1);ui.modal.body=ui.advanced&&ui.hint===2?'进阶委托：'+l.challenge.steps+' 步内送达'+(l.challenge.reserve?'，余钱至少 '+l.challenge.reserve:'')+'。比较两条商路的费用，并逐笔预留下一家要求的货款。':l.hints[ui.hint];return;}
  if(id==='retry'){session.reset();Object.assign(ui,{x:3,message:'',error:false,modal:null,skip:progress.tutorialDone.includes(l.id),hint:0});defaults();return;}
  if(id==='undo'){if(!session.canUndo)return;session.undo();ui.screen='play';ui.message='已撤销';ui.error=false;ui.modal=null;defaults();return;}
  if(id==='next'){const next=Levels.all[l.number];if(next)begin(next.id);else ui.screen='chapters';return;}
  if(id==='receive-iron'||id==='receive-note'){ui.receive=id==='receive-iron'?'iron':l.issuer;return;}
  const adjust=/^(x|p|n|amount)([+-])$/.exec(id);if(adjust){const control=P.view(session,ui).panel.steppers.find(c=>c.key===adjust[1]);if(!control)return;const plus=adjust[2]==='+';if(plus?control.maxDisabled:control.minDisabled)return;const key={x:'x',p:'payIron',n:'payNote',amount:'amount'}[adjust[1]];ui[key]+=plus?1:-1;ui.message='';return;}
  if(id==='transact'){const panel=P.view(session,ui).panel;if(panel.action)act(panel.action);return;}
  if(['exchange','depart','deliver'].includes(id))act(id==='exchange'?{type:id,amount:ui.x}:{type:id});
 }
 function view(){const v=P.view(session,ui),m=ui.modal?Object.assign({},ui.modal):null;
  if(m&&m.kind==='rules'){const rule=v.rules[m.page];m.title=rule[0];m.body=rule[1];m.count=v.rules.length;}
  return Object.assign(v,{screen:ui.screen,message:ui.message,error:ui.error,modal:m,hintLevel:ui.hint,chapters:Levels.all.map(l=>({id:l.id,title:l.title,number:l.number,mission:l.mission,locked:!unlocked(l),completed:progress.completed.includes(l.id)})),lastTitle:Levels.get(progress.last).title,hasProgress:progress.completed.length>0,nextLabel:lNext(v.level)});
 }
 function lNext(l){return l.number<Levels.all.length?'下一关':'查看全部章节';}
 return {view,dispatch,selectNode,get session(){return session;},get progress(){return JSON.parse(JSON.stringify(progress));}};
}
return {create,normalize,KEY};
});
