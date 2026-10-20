(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('../core/engine'));else root.ShuStoryView=factory(root.ShuEngine);})(this,function(E){
function decorate(v){if(!v.story)return v;const s=v.s,st=v.story;
v.storyRoom=s.nodeId==='warehouse'&&['counter','coin','box'].includes(st.phase);
v.roomObjects=[{id:'money',label:'钱袋'},{id:'ledger',label:'账簿'},{id:'hook',label:'挂钩'},{id:'water',label:'水碗'},...(st.phase==='coin'?[{id:'coin',label:'柜底铁钱'}]:[]),...(st.phase==='box'?[{id:'box',label:'旧木匣'}]:[])].map(o=>Object.assign(o,{active:v.storyObjects.some(a=>a.id===o.id),action:'object:'+o.id,primary:o.id===({counter:'money',coin:'coin',box:'box'}[st.phase]),hint:({money:'钱袋 · 备货款',coin:'拾起铁钱',box:'托住旧匣'})[o.id]||o.label}));
v.storyEnded=st.phase==='settled';v.storyMap=s.status==='playing'||s.status==='won'&&!v.storyEnded;
v.storyMoney={iron:s.departed?s.iron:s.warehouseIron,note:s.notesByIssuer.a||0,cloth:s.cargoById.cloth||0};
v.paymentVisible=st.phase==='payment'&&st.paymentOpen;
v.storyPayment=E.transition(s,{type:'buy',transactionId:'buy-cloth',iron:v.storyPayIron,notes:{a:v.storyPayNote}},v.level);
v.storySteppers=[{key:'p',label:'铁钱',value:v.storyPayIron,max:Math.min(s.iron,6-v.storyPayNote)},{key:'n',label:'交子',value:v.storyPayNote,max:Math.min(s.notesByIssuer.a||0,6-v.storyPayIron)}].map(x=>Object.assign(x,{minus:x.key+'-',plus:x.key+'+',minDisabled:x.value===0,maxDisabled:x.value>=x.max}));
v.storyBubble=st.bubble&&st.bubble.text;v.storyPhase=st.phase;return v;}
return {decorate};
});
