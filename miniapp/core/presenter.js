(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./engine'),require('./level'));else root.ShuPresenter=factory(root.ShuEngine,root.ShuLevel);})(this,function(E,L){
function view(session,x,p){var s=session.state,ex=E.apply(s,{type:'exchange',amount:x}),buy=E.apply(s,{type:'buy',iron:p,note:L.goods.price-p});return {s:s,level:L,weight:E.weight(s),canUndo:session.canUndo,x:x,p:p,payNote:L.goods.price-p,
exchangeText:ex.ok?'兑换后：'+ex.state.iron+' 铁钱 · '+ex.state.note+' 交子 · 负重 '+E.weight(ex.state)+' / '+L.capacity:ex.message,
exchangeOk:ex.ok,buyOk:buy.ok,buyText:buy.ok?'付款后：'+buy.state.iron+' 铁钱 · '+buy.state.note+' 交子 · 含布料负重 '+E.weight(buy.state)+' / '+L.capacity:buy.message,
pathText:s.path.map(function(id){return L.nodes.find(function(n){return n.id===id;}).name;}).join(' → '),
nodes:L.nodes.map(function(n){return Object.assign({},n,{current:n.id===s.location,reachable:s.departed&&s.status==='playing'&&E.adjacent(s.location,n.id),style:'left:'+n.x+'%;top:'+n.y+'%;'});}),
edges:L.edges.map(function(e){var a=L.nodes.find(function(n){return n.id===e[0];}),b=L.nodes.find(function(n){return n.id===e[1];});return {key:e.join('-'),style:'left:'+Math.min(a.x,b.x)+'%;top:'+Math.min(a.y,b.y)+'%;width:'+(a.x===b.x?0:Math.abs(a.x-b.x))+'%;height:'+(a.y===b.y?0:Math.abs(a.y-b.y))+'%;',kind:a.x===b.x?'vertical':'horizontal'};})};}
return {view:view,rules:'初始 8 铁钱，钱袋最多 5 格。出发前可兑换一次：投入 X 铁钱获得 X−1 交子（X≥2），交子不占负重；剩余铁钱须全部携带。布料价 6、重 2，至少付 2 铁钱，可混合支付。先扣款再装货。道路双向相邻通行，每次进入桥收 1 铁钱。只有移动耗步，最多 4 步；带布料到交付点后点击交付。兑换、交易、交付不耗步。撤销恢复上一次操作的完整状态。数值是抽象游戏单位，不代表宋代真实兑换比例。'};
});
