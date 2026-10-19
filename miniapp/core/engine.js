(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./level'));else root.ShuEngine=factory(root.ShuLevel);})(this,function(Levels){
'use strict';
const clone=s=>JSON.parse(JSON.stringify(s));
const notes=n=>Object.assign({a:0,b:0,official:0},n);
const integer=n=>Number.isSafeInteger(n)&&n>=0;
function initial(l=Levels){const i=l.initial;return {levelId:l.id,nodeId:l.start,warehouseIron:i.warehouseIron||0,preparation:l.exchange?{iron:i.warehouseIron,notesByIssuer:notes({})}:null,iron:i.iron,notesByIssuer:notes(i.notes),cargoById:clone(i.cargo),stepsUsed:0,completedTransactions:[],routeHistory:[l.start],redeemCount:0,exchanged:false,departed:!l.exchange,tutorialFlags:{},events:[],status:'playing',failureReason:'',delivery:null};}
function weight(s,l=Levels){return s.iron+Object.keys(s.cargoById).reduce((w,k)=>w+s.cargoById[k]*l.goods[k].weight,0);}
function adjacent(a,b,l=Levels){return l.edges.some(e=>e[0]===a&&e[1]===b||e[1]===a&&e[0]===b);}
function ready(s,l=Levels){return Object.keys(l.target.cargo).every(k=>(s.cargoById[k]||0)>=l.target.cargo[k])&&l.target.transactions.every(id=>s.completedTransactions.includes(id));}
// Raw transition is shared by player commands, previews and search. Search never calls itself.
function transition(state,action,l=Levels){
 const s=clone(state),bad=(code,message,details={})=>({ok:false,state,code,message,details});
 if(!action||typeof action.type!=='string')return bad('INVALID_ACTION','操作无效。');
 if(s.status!=='playing')return bad('FINISHED','本次挑战已结束，可以撤销或重试。');
 let event={type:action.type,nodeId:s.nodeId},t;
 const money=payment=>Object.keys(payment||{}).every(k=>['a','b','official'].includes(k)&&integer(payment[k]));
 switch(action.type){
 case 'exchange':{
  if(!l.exchange||s.departed||s.exchanged||s.nodeId!==l.start)return bad('EXCHANGE_UNAVAILABLE','只能在首次出发前兑换一次。');
  const n=action.amount;if(!integer(n)||n<l.exchange.min||n>s.warehouseIron)return bad('INVALID_AMOUNT','兑换数量须为 2 至 '+s.warehouseIron+' 的整数。');
  s.warehouseIron-=n;s.preparation.iron=s.warehouseIron;s.preparation.notesByIssuer[l.exchange.issuer]+=n-l.exchange.fee;s.exchanged=true;
  Object.assign(event,{amount:n,fee:l.exchange.fee,issuer:l.exchange.issuer,received:n-l.exchange.fee});break;
 }
 case 'depart':
  if(s.departed)return bad('ALREADY_DEPARTED','已经出发。');
  if(s.preparation.iron>l.capacity)return bad('OVERWEIGHT','超过负重上限 '+(s.preparation.iron-l.capacity)+' 格。',{delta:s.preparation.iron-l.capacity});
  s.iron=s.preparation.iron;s.notesByIssuer=clone(s.preparation.notesByIssuer);s.warehouseIron=0;s.preparation=null;s.departed=true;break;
 case 'move':{
  if(!s.departed)return bad('WAREHOUSE_NOT_READY','先整理好出发的钱袋。');
  if(!adjacent(s.nodeId,action.to,l))return bad('NOT_ADJACENT','只能前往相邻地点。');
  if(s.stepsUsed>=l.maxSteps)return bad('STEP_LIMIT','剩余步数不足以完成这次移动。');
  const node=l.nodes.find(n=>n.id===action.to);if(!node)return bad('UNKNOWN_NODE','地点不存在。');
  if(s.iron<node.toll)return bad('TOLL_IRON_MISSING','通行需要 '+node.toll+' 铁钱。',{fee:node.toll});
  s.iron-=node.toll;s.nodeId=node.id;s.stepsUsed++;s.routeHistory.push(node.id);Object.assign(event,{nodeId:node.id,fee:node.toll});break;
 }
 case 'buy':case 'sell':case 'swap':case 'redeem':{
  t=l.transactions.find(t=>t.id===action.transactionId);
  if(!t||t.type!==action.type)return bad('UNKNOWN_TRANSACTION','这笔交易不存在。');
  if(!s.departed||s.nodeId!==t.nodeId)return bad('WRONG_LOCATION','请到对应地点交易。');
  if(s.completedTransactions.includes(t.id)||(t.exclusive&&l.transactions.some(other=>other.exclusive===t.exclusive&&s.completedTransactions.includes(other.id))))return bad('TRANSACTION_ALREADY_DONE','这笔委托已经交易完成。');
  if(t.type==='buy'){
   const pay=action.notes||{};if(!integer(action.iron)||!money(pay))return bad('INVALID_AMOUNT','付款数量必须是非负整数。');
   if(Object.keys(pay).some(k=>pay[k]>0&&!t.accepts.includes(k)))return bad('NOTE_ISSUER_NOT_ACCEPTED','这家铺子不接受当前商号的交子。');
   const total=action.iron+Object.values(pay).reduce((a,b)=>a+b,0);
   if(total!==t.price)return bad('PAYMENT_TOTAL',total<t.price?'货款还差 '+(t.price-total)+' 单位。':'货款多付了 '+(total-t.price)+' 单位。',{delta:t.price-total});
   if(action.iron<t.minIron)return bad('IRON_REQUIRED','这家店至少需要 '+t.minIron+' 铁钱。',{minIron:t.minIron});
   if((pay[t.issuer]||0)<t.minNote)return bad('NOTE_REQUIRED','这家店至少需要 '+t.minNote+' '+Levels.issuerNames[t.issuer]+'。');
   const delta=Math.max(0,action.iron-s.iron)+Object.keys(pay).reduce((n,k)=>n+Math.max(0,pay[k]-s.notesByIssuer[k]),0);
   if(delta)return bad('INSUFFICIENT_FUNDS','所选货币还差 '+delta+' 单位。',{delta});
   s.iron-=action.iron;Object.keys(pay).forEach(k=>s.notesByIssuer[k]-=pay[k]);s.cargoById[t.cargo]=(s.cargoById[t.cargo]||0)+t.quantity;
   Object.assign(event,{iron:action.iron,notes:clone(pay),cargo:t.cargo,quantity:t.quantity});
  }else if(t.type==='sell'){
   if(!['iron',t.issuer].includes(action.receive))return bad('INVALID_CURRENCY','请选择收铁钱或交子。');
   if((s.cargoById[t.cargo]||0)<t.quantity)return bad('CARGO_MISSING','没有足够的待售货物。');
   s.cargoById[t.cargo]-=t.quantity;if(action.receive==='iron')s.iron+=t.price;else s.notesByIssuer[action.receive]+=t.price;
   Object.assign(event,{receive:action.receive,amount:t.price,cargo:t.cargo,quantity:t.quantity});
  }else if(t.type==='swap'){
   if(s.notesByIssuer[t.from]<t.amount)return bad('INSUFFICIENT_FUNDS','换票需要 '+t.amount+' '+Levels.issuerNames[t.from]+'。');
   s.notesByIssuer[t.from]-=t.amount;s.notesByIssuer[t.to]+=t.received;Object.assign(event,{from:t.from,to:t.to,amount:t.amount,received:t.received,fee:t.amount-t.received});
  }else{
   if(!integer(action.amount)||action.amount<1||action.amount>t.limit||s.redeemCount>=t.times)return bad('REDEEM_LIMIT','本关最多兑付一次、最多 '+t.limit+' 单位。',{limit:t.limit});
   if(s.notesByIssuer[t.issuer]<action.amount)return bad('INSUFFICIENT_FUNDS','用于兑付的交子不足。');
   s.notesByIssuer[t.issuer]-=action.amount;s.iron+=action.amount;s.redeemCount++;Object.assign(event,{amount:action.amount,issuer:t.issuer});
  }
  if(weight(s,l)>l.capacity)return bad('OVERWEIGHT','交易后超过负重上限 '+(weight(s,l)-l.capacity)+' 格。',{delta:weight(s,l)-l.capacity});
  s.completedTransactions.push(t.id);event.transactionId=t.id;break;
 }
 case 'deliver':
  if(s.nodeId!==l.goal||!ready(s,l))return bad('NOT_PURCHASED','还没有买齐委托货物并抵达商行。');
  s.delivery={cargo:clone(l.target.cargo),load:weight(s,l)};Object.keys(l.target.cargo).forEach(k=>s.cargoById[k]-=l.target.cargo[k]);s.status='won';break;
 default:return bad('INVALID_ACTION','未知操作。');
 }
 s.events.push(event);return {ok:true,state:s,code:'OK',message:'操作完成。',details:{},event};
}
function actions(s,l){
 if(!s.departed)return [...(!s.exchanged?Array.from({length:Math.max(0,s.warehouseIron-1)},(_,i)=>({type:'exchange',amount:i+2})):[]),{type:'depart'}];
 const a=[{type:'deliver'},...l.nodes.filter(n=>adjacent(s.nodeId,n.id,l)).map(n=>({type:'move',to:n.id}))];
 l.transactions.filter(t=>t.nodeId===s.nodeId&&!s.completedTransactions.includes(t.id)).forEach(t=>{
  if(t.type==='buy')for(let i=0;i<=t.price;i++)a.push({type:'buy',transactionId:t.id,iron:i,notes:t.issuer?{[t.issuer]:t.price-i}:{}});
  else if(t.type==='sell')['iron',t.issuer].forEach(receive=>a.push({type:'sell',transactionId:t.id,receive}));
  else if(t.type==='redeem')for(let n=1;n<=t.limit;n++)a.push({type:'redeem',transactionId:t.id,amount:n});
  else a.push({type:t.type,transactionId:t.id});
 });return a;
}
function canFinish(state,l=Levels){
 const seen=new Set();function walk(s){if(s.status==='won')return true;
  const key=JSON.stringify([s.nodeId,s.iron,s.notesByIssuer,s.cargoById,s.stepsUsed,s.completedTransactions.slice().sort(),s.departed,s.exchanged,s.preparation,s.redeemCount]);
  if(seen.has(key))return false;seen.add(key);
  for(const a of actions(s,l)){const r=transition(s,a,l);if(r.ok&&walk(r.state))return true;}return false;
 }return walk(Object.assign({},state,{status:state.status==='won'?'won':'playing'}));
}
function apply(state,action,l=Levels,options={}){
 const r=transition(state,action,l);if(r.ok&&options.detectDeadlock!==false&&r.state.departed&&r.state.status==='playing'&&!canFinish(r.state,l)){
  r.state.status='failed';r.state.failureReason=r.state.stepsUsed===l.maxSteps?'步数已用尽，委托尚未完成。':'当前资金、货物与剩余步数已无法完成委托。';r.message=r.state.failureReason;
 }return r;
}
function createSession(l=Levels){
 let s=initial(l),history=[],records=[];
 return {level:l,get state(){return clone(s);},get canUndo(){return history.length>0;},
 act(a){const r=apply(s,a,l);if(r.ok){history.push({state:clone(s),length:records.length});records.push({action:clone(a)});s=clone(r.state);}return r;},
 markTutorial(id){if(l.lessons[id]){s.tutorialFlags[id]=true;records.push({tutorial:id});}},
 undo(){if(!history.length)return false;const previous=history.pop();s=previous.state;records.length=previous.length;return true;},
 reset(){s=initial(l);history=[];records=[];},
 snapshot(){return {version:1,levelId:l.id,records:clone(records)};}
 };
}
// Rebuild through the real rules; stored balances/cargo are never trusted.
function restoreSession(data){
 if(!data||data.version!==1||!Array.isArray(data.records)||data.records.length>256)throw Error('Invalid saved run');
 const l=Levels.all.find(l=>l.id===data.levelId);if(!l)throw Error('Unknown saved chapter');
 const session=createSession(l);
 for(const record of data.records){if(record&&record.action){if(!session.act(record.action).ok)throw Error('Invalid saved action');}
 else if(record&&l.lessons[record.tutorial])session.markTutorial(record.tutorial);else throw Error('Invalid saved record');}
 return session;
}
return {initial,weight,adjacent,ready,apply,transition,actions,canFinish,createSession,restoreSession};
});
