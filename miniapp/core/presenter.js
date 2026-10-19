(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./engine'),require('./level'));else root.ShuPresenter=factory(root.ShuEngine,root.ShuLevel);})(this,function(E,Levels){
'use strict';
const currency=k=>k==='iron'?'铁钱':Levels.issuerNames[k];
const button=(id,label,secondary=false,disabled=false)=>({id,label,kind:secondary?'secondary':'primary',disabled});
function paymentText(iron,notes){return [iron?iron+' 铁钱':'',...Object.keys(notes||{}).filter(k=>notes[k]).map(k=>notes[k]+' '+currency(k))].filter(Boolean).join(' + ')||'0';}
function tradeRule(t,l){if(t.type==='buy')return '价 '+t.price+' · 重 '+l.goods[t.cargo].weight+'；'+(t.minIron?'至少 '+t.minIron+' 铁钱':'')+(t.minIron&&t.minNote?'，':'')+(t.minNote?'至少 '+t.minNote+' '+currency(t.issuer):'')+(t.issuer?'；接受'+currency(t.issuer):'；只收铁钱');if(t.type==='sell')return '售价 '+t.price+'，整笔收铁钱或'+currency(t.issuer);if(t.type==='swap')return t.amount+' '+currency(t.from)+' → '+t.received+' '+currency(t.to)+'，仅一次';return '1:1 兑铁钱，1—'+t.limit+' 单位，仅一次';}
function eventText(e,l){const name=id=>l.nodes.find(n=>n.id===id).name;
 if(e.type==='exchange')return '兑换 '+e.amount+' 铁钱 → '+e.received+' 交子；手续费 '+e.fee;
 if(e.type==='buy')return '买'+l.goods[e.cargo].name+'：'+paymentText(e.iron,e.notes);
 if(e.type==='sell')return '卖'+l.goods[e.cargo].name+'：收 '+e.amount+' '+currency(e.receive);
 if(e.type==='swap')return '换票：'+e.amount+' 甲票 → '+e.received+' 乙票';
 if(e.type==='redeem')return '兑付：'+e.amount+' 交子 → '+e.amount+' 铁钱';
 if(e.type==='move')return name(e.nodeId)+(e.fee?' · 通行 −'+e.fee+' 铁钱':' · 行动 +1');
 return e.type==='depart'?'已出发':'委托完成';
}
function view(session,ui){
 const s=session.state,l=session.level,t=l.transactions.find(t=>t.nodeId===s.nodeId&&!s.completedTransactions.includes(t.id));
 const resources=[{id:'iron',name:s.departed?'铁钱':'仓库铁钱',value:s.departed?s.iron:s.warehouseIron,asset:'iron',icon:8}];
 const n=s.departed?s.notesByIssuer:s.preparation.notesByIssuer;
 const issuers=[...new Set([l.issuer,...Object.keys(n).filter(k=>n[k])])];issuers.forEach(k=>resources.push({id:k,name:l.number<3?'交子':currency(k),value:n[k],asset:'note',seal:l.number<3?'':{a:'甲',b:'乙',official:'官'}[k],icon:{a:4,b:5,official:6}[k]}));
 const cargo=Object.keys(l.goods).map(k=>({id:k,name:l.goods[k].name,value:s.cargoById[k]||0,icon:l.goods[k].icon,asset:k==='cloth'?'cloth':null}));
 const load=E.weight(s,l),panel={title:l.nodes.find(n=>n.id===s.nodeId).name,meta:'',steppers:[],choices:[],preview:'',buttons:[],kind:'travel'};
 const stepper=(key,label,value,max)=>({key,label,value,minus:key+'-',plus:key+'+',minDisabled:value<=0,maxDisabled:value>=max});
 if(!s.departed){
  panel.kind='exchange';panel.title='货仓 · '+(s.exchanged?'准备出发':'兑换交子');panel.meta='随身 '+load+' / '+l.capacity+' · 拟装载 '+s.preparation.iron+' / '+l.capacity;
  if(!s.exchanged){const r=E.transition(s,{type:'exchange',amount:ui.x},l);panel.steppers=[Object.assign(stepper('x',ui.x+' 铁钱 → '+(ui.x-l.exchange.fee)+' 交子',ui.x,s.warehouseIron),{minDisabled:ui.x<=2})];panel.preview=r.ok?'兑换后拟装载 '+r.state.preparation.iron+' / '+l.capacity+' 格 · 手续费 '+l.exchange.fee:r.message;panel.buttons.push(button('exchange','确认兑换',false,!r.ok));}
  else panel.preview='待携带 '+paymentText(s.preparation.iron,s.preparation.notesByIssuer);
  panel.buttons.push(button('depart','确认出发',!s.exchanged,s.preparation.iron>l.capacity));
 }else if(t){
  panel.kind=t.type;panel.title=l.nodes.find(n=>n.id===s.nodeId).name+' · '+({buy:'购买'+l.goods[t.cargo]?.name,sell:'出售'+l.goods[t.cargo]?.name,swap:'换票',redeem:'兑付'}[t.type]);panel.meta=tradeRule(t,l);
  let a={type:t.type,transactionId:t.id};
  if(t.type==='buy'){
   a.iron=ui.payIron;a.notes=t.issuer?{[t.issuer]:ui.payNote}:{};
   panel.steppers=[stepper('p','铁钱',ui.payIron,Math.min(t.price,s.iron))];if(t.issuer)panel.steppers.push(stepper('n',currency(t.issuer),ui.payNote,Math.min(t.price,s.notesByIssuer[t.issuer]||0)));
   panel.meta=tradeRule(t,l);
  }else if(t.type==='sell'){a.receive=ui.receive;panel.choices=[{id:'receive-iron',label:'收 '+t.price+' 铁钱',selected:ui.receive==='iron'},{id:'receive-note',label:'收 '+t.price+' 交子',selected:ui.receive===t.issuer}];}
  else if(t.type==='redeem'){a.amount=ui.amount;panel.steppers=[Object.assign(stepper('amount','兑付数量',ui.amount,Math.min(t.limit,s.notesByIssuer[t.issuer]||0)),{minDisabled:ui.amount<=1})];}
  const r=E.transition(s,a,l);panel.preview=r.ok?'交易后 '+paymentText(r.state.iron,r.state.notesByIssuer)+' · 负重 '+E.weight(r.state,l)+' / '+l.capacity:r.message;panel.buttons=[button('transact','确认'+({buy:'购买',sell:'出售',swap:'换票',redeem:'兑付'}[t.type]),false,!r.ok)];panel.action=a;
 }else if(s.nodeId===l.goal){panel.kind='delivery';panel.preview=E.ready(s,l)?'货物已备齐，可以交付。':'还没有买齐委托货物。';panel.buttons=[button('deliver','交付货物',false,!E.ready(s,l))];}
 else panel.preview=E.ready(s,l)?'前往交付商行':'选择下一站';
 const total=s.iron+Object.values(s.notesByIssuer).reduce((a,b)=>a+b,0);
 const ledger=s.events.filter(e=>['exchange','buy','sell','swap','redeem'].includes(e.type)||e.type==='move'&&e.fee).map((e,i)=>({id:i,text:eventText(e,l)}));
 const fee=s.events.reduce((sum,e)=>sum+(e.fee||0),0);
 const review=l.reviews&&l.reviews.find(r=>s.routeHistory.includes(r.node));
 const purchases=s.events.filter(e=>e.type==='buy').map(e=>l.goods[e.cargo].name);
 const routeReview=review?review.text:l.nodes.some(n=>n.toll)?(s.events.some(e=>e.type==='move'&&e.fee)?'这一趟走得快，开销也多些。':'多走几步，留下了一份钱。'):'采购顺序：'+purchases.join(' → ');
 return {s,level:l,resources,cargo,weight:load,canUndo:session.canUndo,slots:Array.from({length:l.capacity},(_,i)=>({id:i,kind:i<load?(i<s.iron?'iron':'cloth'):'empty'})),panel,
 nodes:l.nodes.map(n=>Object.assign({},n,{current:n.id===s.nodeId,reachable:s.departed&&s.status==='playing'&&E.adjacent(s.nodeId,n.id,l),style:'left:'+n.x+'%;top:'+n.y+'%;'})),edges:l.edges,
 pathText:s.routeHistory.map(id=>l.nodes.find(n=>n.id===id).name).join(' → '),total,ledger,fee,remainingText:paymentText(s.iron,s.notesByIssuer),
 resultText:s.status==='won'?l.outro[1]:s.failureReason,ending:s.status==='won'?(l.ending||''):'',
 routeReview,
 rules:[...(l.exchange?[['仓库兑换',l.initial.warehouseIron+' 铁钱在仓库，出发前可兑换一次：投入 X 铁钱，获得 X−'+l.exchange.fee+' 交子；X 至少为 '+l.exchange.min+'。兑换后剩余铁钱全部携带，拟装载不超过 '+l.capacity+' 格才能出发。']]:[]),['钱袋与行动','铁钱每单位占 1 格，交子不占负重。钱袋上限 '+l.capacity+' 格。只有沿相邻道路移动耗步，最多 '+l.maxSteps+' 步。每次进入收费地点都需支付标示铁钱。'],...l.transactions.map(t=>[l.nodes.find(n=>n.id===t.nodeId).name,tradeRule(t,l)]),['交付与撤销','买齐委托货物后到商行交付。购买先扣款再装货；出售先卸货再收款。撤销恢复上一完整状态，重试不会丢失已解锁章节。']]};
}
return {view,tradeRule,eventText,paymentText,button,currency};
});
