const E=require('../../core/engine');const P=require('../../core/presenter');
Page({data:{screen:'home',rules:false,rulesText:P.rules,x:3,p:2,message:'先在货仓整理钱袋，再挑选商路。',error:false},
onLoad:function(){this.session=E.createSession();this.refresh();},
refresh:function(){this.setData(P.view(this.session,this.data.x,this.data.p));},
onAction:function(e){const a=e.currentTarget.dataset.action;
if(a==='intro'||a==='play'){this.setData({screen:a});return;}
if(a==='rules'){this.setData({rules:!this.data.rules});return;}
if(a==='x-'||a==='x+'){this.setData({x:Math.max(2,Math.min(this.session.state.iron,this.data.x+(a==='x+'?1:-1)))});}
else if(a==='p-'||a==='p+'){this.setData({p:Math.max(0,Math.min(6,this.data.p+(a==='p+'?1:-1)))});}
else if(a==='retry'){this.session.reset();this.setData({x:3,p:2,message:'重新整理钱袋，试一条新商路。',error:false});}
else if(a==='undo'){this.session.undo();this.setData({message:'已恢复上一次操作前的完整状态。',error:false});}
else {this.act(a==='exchange'?{type:a,amount:this.data.x}:a==='buy'?{type:a,iron:this.data.p,note:6-this.data.p}:{type:a});return;}
this.refresh();},
onMove:function(e){this.act({type:'move',to:e.currentTarget.dataset.node});},
act:function(a){const r=this.session.act(a);this.setData({message:r.message,error:!r.ok});this.refresh();}
});
