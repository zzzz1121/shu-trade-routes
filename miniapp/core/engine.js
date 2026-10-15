(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./level'));else root.ShuEngine=factory(root.ShuLevel);})(this,function(defaultLevel){
'use strict';
function clone(s){return JSON.parse(JSON.stringify(s));}
function initial(l){l=l||defaultLevel;return {location:l.start,iron:l.initialIron,note:0,cloth:0,bought:false,exchanged:false,departed:false,steps:0,path:[l.start],status:'playing'};}
function weight(s,l){return s.iron+s.cloth*(l||defaultLevel).goods.weight;}
function adjacent(a,b,l){return (l||defaultLevel).edges.some(function(e){return e[0]===a&&e[1]===b||e[1]===a&&e[0]===b;});}
function apply(state,action,l){
l=l||defaultLevel;var s=clone(state);function bad(message){return {ok:false,state:state,message:message};}
if(!action||typeof action.type!=='string')return bad('操作无效。');
if(s.status!=='playing')return bad('本次挑战已结束，可以撤销或重新挑战。');
switch(action.type){
case 'exchange':
 if(s.departed||s.location!==l.start||s.exchanged)return bad('只能在首次出发前兑换一次。');
 if(!Number.isInteger(action.amount)||action.amount<2||action.amount>s.iron||action.amount<=l.exchangeFee)return bad('兑换数量须为至少 2 的整数，且不能超过铁钱余额。');
 s.iron-=action.amount;s.note+=action.amount-l.exchangeFee;s.exchanged=true;break;
case 'depart':
 if(s.departed)return bad('已经出发。');
 if(weight(s,l)>l.capacity)return bad('钱袋超重，请先兑换以减轻负重。');
 s.departed=true;break;
case 'move':
 if(!s.departed)return bad('请先整理钱袋并确认出发。');
 if(!adjacent(s.location,action.to,l))return bad('只能前往道路直接相连的地点。');
 if(s.steps>=l.maxSteps)return bad('行动步数已用尽。');
 var node=l.nodes.find(function(n){return n.id===action.to;});
 if(!node)return bad('地点不存在。');
 if(s.iron<(node.toll||0))return bad('进入收费桥需要 1 铁钱。');
 s.iron-=node.toll||0;s.location=action.to;s.steps++;s.path.push(action.to);
 if(s.steps===l.maxSteps&&!(s.location===l.goal&&s.bought))s.status='failed';
 break;
case 'buy':
 if(!s.departed||s.location!==l.shop)return bad('请先到布铺交易。');
 if(s.bought)return bad('本关只需购买一份布料，不能重复购买。');
 if(!Number.isInteger(action.iron)||!Number.isInteger(action.note)||action.iron<0||action.note<0)return bad('付款数量必须是非负整数。');
 if(action.iron+action.note!==l.goods.price)return bad('付款总额必须恰好为 '+l.goods.price+'。');
 if(action.iron<l.goods.minIron)return bad('布铺至少收取 '+l.goods.minIron+' 铁钱。');
 if(action.iron>s.iron||action.note>s.note)return bad('钱袋余额不足。');
 s.iron-=action.iron;s.note-=action.note;s.cloth++;s.bought=true;
 if(weight(s,l)>l.capacity)return bad('购买后超重，请调整付款组合。');
 break;
case 'deliver':
 if(s.location!==l.goal||!s.bought||s.cloth<1)return bad('需携带布料到交付点才能交付。');
 s.cloth--;s.status='won';break;
default:return bad('未知操作。');
}
return {ok:true,state:s,message:s.status==='failed'?'步数已用尽，尚未带着布料抵达交付点。可以撤销。':'操作完成。'};
}
function createSession(l){l=l||defaultLevel;var s=initial(l),history=[];return {get state(){return clone(s);},get canUndo(){return history.length>0;},act:function(a){var r=apply(s,a,l);if(r.ok){history.push(clone(s));s=r.state;}return r;},undo:function(){if(!history.length)return false;s=history.pop();return true;},reset:function(){s=initial(l);history=[];}};}
return {initial:initial,weight:weight,adjacent:adjacent,apply:apply,createSession:createSession};
});
