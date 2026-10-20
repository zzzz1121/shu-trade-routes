(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./engine'),require('./chapter-one'));else root.ShuChapterFlow=factory(root.ShuEngine,root.ShuChapterOne);})(this,function(E,S){
'use strict';
const READ_KEY='shu-story-read-v1',clone=o=>JSON.parse(JSON.stringify(o));
function create(host,storage={}){
 let history=[],read={};try{const data=storage.read&&storage.read(READ_KEY);if(data&&data.version===1&&Array.isArray(data.ids))read=Object.fromEntries(data.ids.filter(x=>typeof x==='string').slice(-1500).map(x=>[x,true]));}catch{}
 const state=()=>host.ui.story,stats=()=>S.stats(host.session.state);
 function remember(line){const ui=host.ui,last=ui.backlog.at?ui.backlog.at(-1):ui.backlog[ui.backlog.length-1];if(!last||last.id!==line.id)ui.backlog.push(clone(line));if(ui.backlog.length>200)ui.backlog.shift();}
 function markRead(line){if(!line)return;read[line.id]=true;try{if(storage.write)storage.write(READ_KEY,{version:1,ids:Object.keys(read).slice(-1500)});}catch{}}
 function checkpoint(){history.push({session:host.session.snapshot(),ui:clone(host.ui)});if(history.length>100)history.shift();}
 function showLine(){const ui=host.ui,m=ui.modal,line=m.lines[m.cursor];m.line=clone(line);m.title=line.speaker;m.body=line.text;m.canSkipRead=!!read[line.id];state().active={id:m.scene,cursor:m.cursor};remember(line);}
 function open(id,cursor=0){host.ui.error=false;host.ui.message='';const ev=S.event(id,state(),stats());if(!ev)return;host.ui.modal={kind:'story',source:'v4',scene:id,lines:ev.lines,choices:ev.choices,cursor:Math.min(cursor,ev.lines.length-1)};state().bubble=null;showLine();}
 function effects(effect){if(effect.flags)Object.assign(state().flags,effect.flags);if(effect.phase)state().phase=effect.phase;}
 function complete(){const ui=host.ui,m=ui.modal,ev=S.event(m.scene,state(),stats());markRead(m.line);if(m.choices.length)return;const meaningful=ev.done.flags||ev.done.phase;if(meaningful)checkpoint();effects(ev.done);if(m.scene==='closing')host.completeLevel();state().seenEvents[m.scene]=true;state().active=null;ui.modal=null;if(ev.done.next)open(ev.done.next);}
 function advance(){const m=host.ui.modal;if(!m||m.source!=='v4')return;markRead(m.line);if(m.cursor<m.lines.length-1){m.cursor++;showLine();}else complete();}
 function prop(id,title,body,actions=[],asset=''){host.ui.error=false;host.ui.message='';host.ui.modal={kind:'prop',id,title,body,actions,asset};}
 function notice(text){state().bubble={id:'notice:'+text,text};host.ui.error=false;host.ui.message='';}
 function begin(id){host.begin(id);delete host.ui.feedbackMemory;if(host.session.level.id!=='l01'){host.ui.screen='intro';return;}history=[];host.ui.story=S.initial();host.ui.screen='play';host.ui.modal=null;host.ui.payIron=0;host.ui.payNote=0;host.ui.x=2;}
 function commit(action){const ui=host.ui,before={session:host.session.snapshot(),ui:clone(ui)},r=host.session.act(action);if(!r.ok){ui.message=r.message;ui.error=true;return false;}history.push(before);ui.error=false;ui.message=host.eventText(r.event);host.defaults();ui.payIron=0;ui.payNote=0;
  if(r.state.status==='failed'){state().phase='failed';state().active=null;ui.modal=null;return true;}
  if(action.type==='move'){state().tradeMap=false;state().phase=r.state.nodeId==='shop'?(state().flags.clothSelected?'payment':'cloth'):r.state.nodeId==='delivery'?'delivery':state().phase==='return'?'return':'road';if(!state().routeVisited.includes(r.state.nodeId))state().routeVisited.push(r.state.nodeId);const event={bridge:'bridge',shop:'shop'}[r.state.nodeId];if(event&&!state().seenEvents[event])open(event);else{ui.modal=null;if(r.state.nodeId==='street')notice('这头多走一段，不过有檐，雨天好走。');else if(r.state.nodeId==='alley')notice('前头左转就是布铺。');else if(r.state.nodeId==='delivery')notice('回来了。把布放到货台上，再核一遍。');}}
  if(action.type==='buy')open('paid');
  if(action.type==='deliver'){state().phase='record';open('record');}
  return true;
 }
 function object(id){const ui=host.ui,st=state(),s=host.session.state;if(!S.objects(st,s).some(o=>o.id===id&&!o.disabled)&&!['note','blue','grey','white','take-coin','open-box','select-blue','select-grey','select-white','order'].includes(id))return;
  if(id==='greeting'){if(st.flags.metAhe)notice('进来吧，罗掌柜在柜台后头。');else open('greeting');}
  else if(id==='enter'&&st.flags.metAhe)open('introduction');
  else if(id==='money')open('loose-coin');
  else if(id==='coin')prop('coin','柜底','铁钱就在外侧。木匣的一角露在后面。',[{id:'object:take-coin',label:'拾起铁钱'}],'iron');
  else if(id==='take-coin'&&st.phase==='coin'){checkpoint();open('found-box');}
  else if(id==='box')prop('box','柜底木匣','匣底已经松了。托住底板，再把它放到柜台。',[{id:'object:open-box',label:'托住匣底'}],'box');
  else if(id==='open-box'&&st.phase==='box')open('old-note');
  else if(id==='note')prop('note','旧交子的押记','票面上的押记已经模糊。这是一条虚构线索，不计入钱袋，也不能拿去付账。',[],'old-note');
  else if(id==='prepare'){if(!st.seenEvents.prepare)open('prepare');else ui.modal=null;}
  else if(['ledger','hook','water','old-question','bridge-water','cloth-rack','ahe-history','alley-note','stay-ahe','stay-luo'].includes(id)){if(st.seenEvents[id]&&['ledger','hook','water'].includes(id))notice({ledger:'账簿上，旧数划去，新数写在旁边。',hook:'挂钩空着，斗笠还没有还回来。',water:'水已经凉了。'}[id]);else open(id);}
  else if(['blue','grey','white'].includes(id)&&['cloth','payment'].includes(st.phase)){const item={blue:['青布 · 罗记','青色布样，标签写着「罗记」。'],grey:['灰布 · 陈记','灰色布样，标签写着「陈记」。'],white:['素布 · 吴记','素色布样，标签写着「吴记」。']}[id];prop(id,item[0],item[1],[{id:'object:select-'+id,label:'就是这包'}],'cloth-'+id);}
  else if(id.startsWith('select-')&&st.phase==='cloth'){const color=id.slice(7);if(color==='blue')open('cloth-blue');else{ui.feedbackMemory=ui.feedbackMemory||{};if(ui.feedbackMemory[color]){ui.message='标签与货单不符。罗记订的是青布。';ui.error=true;ui.modal=null;}else{ui.feedbackMemory[color]=true;open('wrong-'+color);}}}
  else if(id==='order')prop('order','罗记货单','青布一批 · 罗记\n货款 6 · 货重 2 格\n至少付 2 铁钱，其余可付交子。',[],'order');
  else if(id==='pay'){ui.modal=null;st.tradeMap=false;st.paymentOpen=true;if(!st.seenEvents.payment)open('payment');}
  else if(id==='why-iron')open('why-iron');
  else if(id==='repack'&&s.stepsUsed===0){checkpoint();host.session=E.createSession(host.session.level);st.phase='prepare';ui.modal=null;notice('货款重新放回柜台。只在备好出发时结算一次。');}
  else if(id==='delivery'){if(s.cargoById.cloth){if(st.flags.deliveryReady)notice('布已核好，可以确认交付。');else open('delivery');}else notice('还没有可交付的布。');}
  else if(id==='inspect-delivery'&&st.flags.needsInspection)prop('damp','展开布角','外角受潮，内层干燥。布仍在钱袋里，确认交付时才会收走。',[{id:'inspect-confirm',label:'展开检查'}],'damp');
  else if(id==='account')host.openLedger();
 }
 function handle(id){const ui=host.ui;
  if(id==='opening-start'&&ui.screen==='opening'){ui.screen='play';return true;}
  if(id.startsWith('chapter-open:')){const target=id.slice(13);if(!host.unlocked(target))return true;const saved=host.resume;handle('enter:'+target);if(target==='l01'&&!(saved&&saved.session.levelId===target)&&state())ui.screen='opening';return true;}
  if(id.startsWith('enter:')){const target=id.slice(6);if(!host.unlocked(target))return true;const saved=host.resume;if(saved&&saved.version===2&&saved.session.levelId===target){restore(saved);}else if(saved&&saved.version===1&&saved.session.levelId===target&&target==='l01'){ui.modal={kind:'legacy',title:'第一关已更新',body:'旧版中途记录无法接入新版剧情。已通关章节会保留；重新开始本关后进入新版剧情。'};}else begin(target);return true;}
  if(id==='legacy-restart'&&ui.modal&&ui.modal.kind==='legacy'){begin('l01');return true;}
  if(id==='resume'&&host.resume&&host.resume.version===2){restore(host.resume);return true;}
  if(!state()||ui.screen!=='play')return false;
  const m=ui.modal,st=state();
  if(id==='undo'){if(st.flags.endingSeen||ui.screen!=='play')return true;const current=JSON.stringify(host.session.snapshot());let index=history.length-1;while(index>=0&&JSON.stringify(history[index].session)===current)index--;if(index<0)index=history.length-1;const previous=index>=0?history[index]:null;if(previous){history.length=index;host.session=E.restoreSession(previous.session);Object.assign(ui,clone(previous.ui));ui.screen='play';ui.error=false;ui.message='已撤回上一项行动。';}return true;}
  if(id==='retry'||id==='story-retry'){begin('l01');return true;}
  if(m&&m.source==='v4'){
   if(id==='dialogue-next'||id==='close'){advance();return true;}
   if(id==='story-skip-read'){while(ui.modal&&ui.modal.source==='v4'&&ui.modal.canSkipRead&&!(ui.modal.cursor===ui.modal.lines.length-1&&ui.modal.choices.length)){advance();}return true;}
   if(id.startsWith('choice:')&&m.cursor===m.lines.length-1){const c=m.choices.find(c=>c.id===id.slice(7));if(c){checkpoint();markRead(m.line);Object.assign(st.flags,c.effects||{});st.seenEvents[m.scene]=true;st.active=null;ui.modal=null;if(c.next)open(c.next);}return true;}
   if(id==='sounds'){ui.modal={kind:'sound',returnStory:clone(st.active)};return true;}
   if(!['home','backlog','backlog-return'].includes(id))return true;
  }
  if(m&&m.kind==='sound'&&id==='close'&&m.returnStory){open(m.returnStory.id,m.returnStory.cursor);return true;}
  if(m&&m.kind==='prop'&&id==='close'){ui.modal=null;return true;}
  if(m&&m.kind==='prop'&&!id.startsWith('object:')&&id!=='inspect-confirm')return true;
  if(m&&!['lesson','prop','move'].includes(m.kind))return false;
  if(id.startsWith('object:')){object(id.slice(7));return true;}
  if(id==='inspect-confirm'&&st.flags.needsInspection){open('delivery-check');return true;}
  if(id==='wallet'){ui.modal={kind:'wallet',title:'随身钱袋'};return true;}
  if(id==='bubble-close'){st.bubble=null;return true;}
  if(id==='shop-enter'&&host.session.state.nodeId==='shop'){st.tradeMap=false;ui.modal=null;return true;}
  if(id==='trade-map'){st.tradeMap=true;ui.modal=null;return true;}
  if(id==='trade-close'){st.paymentOpen=false;ui.modal=null;return true;}
  if(id==='draft-enable'){st.draftEnabled=!st.draftEnabled;return true;}
  if(id==='exchange-info'){open('exchange-info');return true;}
  if(id==='prepare-depart'&&st.phase==='prepare'){
   let candidate=E.createSession(host.session.level),r={ok:true};if(st.draftEnabled)r=candidate.act({type:'exchange',amount:ui.x});if(r.ok)r=candidate.act({type:'depart'});if(!r.ok){ui.message=r.message;ui.error=true;return true;}checkpoint();host.session=candidate;ui.modal=null;st.phase=r.state.status==='failed'?'failed':'road';ui.message=r.state.status==='failed'?r.state.failureReason:'货款已备好。';ui.error=r.state.status==='failed';if(!ui.error)open('depart');return true;
  }
  if(id==='confirm-move'){const before=ui.modal;if(before&&before.kind==='move'&&before.canMove&&['road','return','delivery','payment'].includes(st.phase)){commit({type:'move',to:before.nodeId});}return true;}
  if(id==='transact'){if(st.phase!=='payment'||!st.flags.clothSelected){ui.error=true;ui.message='先对照货单核好罗记的青布。';return true;}commit({type:'buy',transactionId:'buy-cloth',iron:ui.payIron,notes:{a:ui.payNote}});return true;}
  if(id==='deliver'){if(!st.flags.deliveryReady){ui.message='先在货台核货，再确认交付。';ui.error=true;return true;}commit({type:'deliver'});return true;}
  if(id==='replay')return true;
  if(id==='stay'&&st.flags.endingSeen){st.phase='stay';ui.screen='play';ui.modal=null;return true;}
  if(['exchange','depart','play','skip-intro','next'].includes(id))return true;
  const adjust=/^(x|p|n)([+-])$/.exec(id);if(adjust){const s=host.session.state,key={x:'x',p:'payIron',n:'payNote'}[adjust[1]],delta=adjust[2]==='+'?1:-1,min=key==='x'?2:0,max=key==='x'?8:key==='payIron'?Math.min(s.iron,6-ui.payNote):Math.min(s.notesByIssuer.a,6-ui.payIron);if(key==='x'&&st.phase!=='prepare'||key!=='x'&&st.phase!=='payment')return true;ui[key]=Math.max(min,Math.min(max,ui[key]+delta));ui.message='';ui.error=false;return true;}
  return false;
 }
 function decorate(v){if(!state())return v;v.story=clone(state());v.storyObjects=S.objects(state(),host.session.state).map(o=>Object.assign(o,{action:'object:'+o.id}));v.storyGoal=S.goal(state(),host.session.state);v.storyStats=stats();v.canUndo=history.length>0&&!state().flags.endingSeen;v.storyPayIron=host.ui.payIron;v.storyPayNote=host.ui.payNote;v.storyDraftX=host.ui.x;v.level=Object.assign({},v.level,{nodes:v.level.nodes.map(n=>Object.assign({},n,{name:n.id==='warehouse'?'罗记后仓':n.id==='delivery'?'罗记前堂':n.name}))});v.nodes=v.nodes.map(n=>Object.assign({},n,{name:n.id==='warehouse'?'罗记后仓':n.id==='delivery'?'罗记前堂':n.name}));if(v.modal&&v.modal.kind==='move')v.modal.title=v.level.nodes.find(n=>n.id===v.modal.nodeId).name;v.pathText=host.session.state.routeHistory.map(id=>v.level.nodes.find(n=>n.id===id).name).join(' → ');
  if(state().phase==='prepare'){const x=state().draftEnabled?host.ui.x:0,iron=8-x,note=x?x-1:0;v.draft={x,iron,note,fee:x?1:0,load:iron,canDepart:iron<=5};}
  return v;
 }
 function snapshot(){return {version:2,session:host.session.snapshot(),ui:clone(host.ui),history:clone(history)};}
 function validate(data){try{const validUI=u=>u&&S.valid(u.story)&&['x','payIron','payNote','hint'].every(k=>Number.isInteger(u[k])&&u[k]>=0&&u[k]<=100)&&u.x>=2&&u.x<=8&&u.payIron+u.payNote<=6&&u.hint<=2&&Array.isArray(u.backlog)&&u.backlog.length<=200&&u.backlog.every(l=>l&&typeof l.text==='string'&&typeof l.speaker==='string')&&(!u.story.active||(typeof u.story.active.id==='string'&&Number.isInteger(u.story.active.cursor)&&u.story.active.cursor>=0&&S.event(u.story.active.id,u.story)&&u.story.active.cursor<S.event(u.story.active.id,u.story).lines.length));if(!data||data.version!==2||data.session.levelId!=='l01'||!data.ui||!validUI(data.ui)||!Array.isArray(data.history)||data.history.length>100)return false;E.restoreSession(data.session);for(const h of data.history){if(!h.session||h.session.levelId!=='l01'||!h.ui||!validUI(h.ui))return false;E.restoreSession(h.session);}return true;}catch{return false;}}
 function restore(data){if(!validate(data))return;host.session=E.restoreSession(data.session);Object.assign(host.ui,clone(data.ui));history=clone(data.history);host.ui.screen=data.ui.screen==='opening'?'opening':'play';if(state().active)open(state().active.id,state().active.cursor);else host.ui.modal=null;}
 return {handle,decorate,snapshot,validate,restore,reset(){history=[];delete host.ui.story;},resetRead(){read={};},get active(){return !!state();},get canResume(){return !!state()&&(host.session.state.status==='playing'||!state().flags.endingSeen||state().phase==='stay');}};
}
return {create,READ_KEY};
});
