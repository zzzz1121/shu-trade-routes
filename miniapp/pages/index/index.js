const Scene=require('../../ui/scene');
const E=require('../../core/engine');const P=require('../../core/presenter');
Page({data:{screen:'home',rules:false,rulePage:0,ruleTitle:'钱袋与兑换',ruleBody:'铁钱每单位占1格，交子不占负重。出发前可兑换一次：投入X铁钱，得到X−1交子，X至少为2。剩余铁钱全部携带，超重不能出发。',rulesText:P.rules,x:3,p:2,message:'',error:false},
onLoad:function(){this.session=E.createSession();this.refresh();},
refresh:function(){this.setData(Scene.decorate(P.view(this.session,this.data.x,this.data.p)));},
onAction:function(e){const a=e.currentTarget.dataset.action;
if(a==='intro'||a==='play'){this.setData({screen:a});return;}
if(a==='rules'){this.setData({rules:!this.data.rules,rulePage:0});this.showRule();return;}
if(a==='rule-prev'||a==='rule-next'){this.setData({rulePage:Math.max(0,Math.min(2,this.data.rulePage+(a==='rule-next'?1:-1)))});this.showRule();return;}
if(a==='x-'||a==='x+'){this.setData({x:Math.max(2,Math.min(this.session.state.iron,this.data.x+(a==='x+'?1:-1)))});}
else if(a==='p-'||a==='p+'){this.setData({p:Math.max(0,Math.min(this.data.level.goods.price,this.data.p+(a==='p+'?1:-1)))});}
else if(a==='retry'){this.session.reset();this.setData({x:3,p:2,message:'',error:false});}
else if(a==='undo'){this.session.undo();this.setData({message:'已撤销',error:false});}
else {this.act(a==='exchange'?{type:a,amount:this.data.x}:a==='buy'?{type:a,iron:this.data.p,note:this.data.level.goods.price-this.data.p}:{type:a});return;}
this.refresh();},
showRule:function(){const pages=[['钱袋与兑换','铁钱每单位占1格，交子不占负重。出发前可兑换一次：投入X铁钱，得到X−1交子，X至少为2。剩余铁钱全部携带，超重不能出发。'],['买布与商路','布料价值6、重量2格，至少付2铁钱，其余可用交子。先扣钱，再装货。每段相邻道路消耗1步，每次进桥扣1铁钱。街巷路线免费。'],['交付与撤销','最多移动4步。买到布料并抵达交付商行，点击交付完成委托。兑换、买布和交付不耗步。撤销恢复完整状态。']];this.setData({ruleTitle:pages[this.data.rulePage][0],ruleBody:pages[this.data.rulePage][1]});},
onMove:function(e){if(this.data.rules)return;const to=e.currentTarget.dataset.node||e.currentTarget.dataset.building;if(to===this.session.state.location){this.setData({message:'当前位于'+this.data.locationName,error:false});return;}this.act({type:'move',to:to});},
act:function(a){const before=this.session.state,r=this.session.act(a);this.setData({message:Scene.feedback(r,a,before,this.data.level),error:!r.ok});this.refresh();}
});
