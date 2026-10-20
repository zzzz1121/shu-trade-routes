(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('../core/engine'));else root.ShuStoryView=factory(root.ShuEngine);})(this,function(E){
function decorate(v){if(!v.story)return v;const s=v.s,st=v.story;
v.storyEnded=st.phase==='settled';v.storyMap=s.status==='playing'||s.status==='won'&&!v.storyEnded;
v.storyMoney={iron:s.departed?s.iron:s.warehouseIron,note:s.notesByIssuer.a||0,cloth:s.cargoById.cloth||0};
v.paymentVisible=st.phase==='payment'&&st.paymentOpen;
v.storyPayment=E.transition(s,{type:'buy',transactionId:'buy-cloth',iron:v.storyPayIron,notes:{a:v.storyPayNote}},v.level);
v.storySteppers=[{key:'p',label:'铁钱',value:v.storyPayIron,max:Math.min(s.iron,6-v.storyPayNote)},{key:'n',label:'交子',value:v.storyPayNote,max:Math.min(s.notesByIssuer.a||0,6-v.storyPayIron)}].map(x=>Object.assign(x,{minus:x.key+'-',plus:x.key+'+',minDisabled:x.value===0,maxDisabled:x.value>=x.max}));
v.storyBubble=st.bubble&&st.bubble.text;v.storyPhase=st.phase;return v;}
return {decorate};
});
