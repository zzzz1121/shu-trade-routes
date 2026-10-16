const session=ShuEngine.createSession();
let screen='home',x=3,p=2,message='',error=false,rules=false,rulePage=0;
const root=document.querySelector('#app');
const rulePages=[['钱袋与兑换','铁钱每单位占1格，交子不占负重。出发前可兑换一次：投入X铁钱，得到X−1交子；X至少为2。剩余铁钱全部携带，超重不能出发。'],['买布与商路','布料价值6、重量2格，至少付2铁钱，其余可用交子。先扣钱，再装货。每段相邻道路消耗1步；每次进收费桥扣1铁钱，免费路线不收费。'],['交付与撤销','最多移动4步。买到布料并抵达交付商行后，点击交付即可完成。兑换、买布和交付不耗步。撤销恢复上一操作的完整状态。']];
function btn(label,action,cls='primary',disabled=false){return `<button class="${cls}" data-action="${action}" ${disabled?'disabled':''}>${label}</button>`;}
function icon(name){return `<img class="resource-icon" src="/miniapp/assets/generated/${name}.png" alt="">`;}
function mapView(v){
 const atlas='/miniapp/assets/approved/town-atlas.png';
 const tiles=items=>items.map(t=>`<div class="scene-tile" style="${t.style}"><img src="${atlas}" style="${t.imageStyle}" alt="" draggable="false"></div>`).join('');
 return `<div class="map-stage"><div class="scene-continuation" aria-hidden="true"><div class="continuation-frame"><img class="continuation-art" src="/miniapp/assets/approved/town-extended.png" alt="" draggable="false"></div></div><div class="map reference-map" aria-label="商路地图">
 <div class="scene-art"><div class="scene-terrain" aria-hidden="true">${tiles(v.terrainTiles)}</div>
 <div class="scene-buildings" aria-hidden="true">${tiles(v.artRegions)}</div></div>
 <div class="road-layer" aria-hidden="true">${v.routeSegments.map(e=>`<div class="route route-dash" data-edge="${e.edge}" style="${e.style}"></div>`).join('')}</div>
 <div class="art-hit-layer">${v.artRegions.map(n=>`<button class="atlas-building-hit" style="${n.style}" data-building="${n.id}" aria-label="前往${n.name}建筑"></button>`).join('')}</div>
 <div class="interaction-layer">${v.nodes.map(n=>`<button class="node scene-node ${n.current?'current':''} ${n.reachable?'reachable':''}" style="${n.style}" data-node="${n.id}" aria-label="前往${n.name}${n.current?'，当前所在地':''}"><span class="scene-placard">${n.name}</span><span class="scene-pin"><i></i></span>${n.current?'<span class="you-marker">所在</span>':''}</button>`).join('')}</div>
 </div></div>`;
}
function render(){const v=ShuScene.decorate(ShuPresenter.view(session,x,p)),s=v.s,L=v.level;let html='';
 if(screen==='home')html=`<section class="cover"><span class="eyebrow">北宋蜀地 · 行商札记</span><h1 class="cover-title">蜀地钱路</h1><p class="cover-copy">钱有轻重，路有取舍。</p><div class="cover-art approved-cover"><img src="/miniapp/assets/approved/town-atlas.png" alt="蜀地商路：货仓、石桥、布铺与商行"></div><div class="cover-bottom"><span class="chapter">第一关 · ${L.title}</span>${btn('开始游戏','intro')}</div></section>`;
 else if(screen==='intro')html=`<section class="intro-screen"><div class="eyebrow">今日委托</div><h1 class="cover-title">一车铁钱</h1><p class="cover-copy">买一份布，送往商行。<br>你只有 ${L.maxSteps} 步，钱袋只能承重 ${L.capacity} 格。</p><img class="intro-art" src="/miniapp/assets/generated/cloth.png" alt="布料"><div class="brief-rules"><p><b>轻装出发</b><span>8 铁钱在货仓，先兑换交子减重。</span></p><p><b>混合付款</b><span>布价 ${L.goods.price}，至少付 ${L.goods.minIron} 铁钱。</span></p><p><b>选择商路</b><span>桥路收1铁钱，街巷免费但多走一步。</span></p></div>${btn('整理钱袋 →','play')}</section>`;
 else if(s.status!=='playing')html=`<section class="result-screen"><span class="eyebrow">${s.status==='won'?'委托完成':'再试一次'}</span><h2 class="cover-title">${s.status==='won'?'布已送达':'行程未成'}</h2><img class="result-art" src="/miniapp/assets/generated/${s.status==='won'?'delivery':'warehouse'}.png" alt=""><p>${s.status==='won'?'这一程，钱与路都安排妥当。':'步数已用尽，尚未携布抵达商行。'}</p><div class="result-stats"><span>行动 <b>${s.steps} / ${L.maxSteps}</b></span><span>剩余资金 <b>${s.iron+s.note}</b></span></div><p class="muted">${s.iron} 铁钱 · ${s.note} 交子</p><p class="path">${v.pathText}</p><div class="result-buttons">${btn('重新挑战','retry')}${btn('撤销上一步','undo','secondary',!v.canUndo)}</div></section>`;
 else{
 html=`<div class="panel-terrain" aria-hidden="true"><img src="/miniapp/assets/approved/town-extended.png" alt="" draggable="false"></div><header class="topbar"><div class="row"><div><h1 class="brand">蜀地钱路</h1><span class="chapter">第一关 · ${L.title}</span></div>${btn('规则','rules','menu-button')}</div><div class="mission"><span>${s.bought?'将布料送至交付商行':'购买布料，送至商行'}</span><span class="steps"><b>${s.steps}</b> / ${L.maxSteps} 步</span></div></header>${mapView(v)}
 <section class="dock"><div class="wallet"><div class="walletitem">${icon('iron')}<div><span class="label">${s.departed?'铁钱':'货仓铁钱'}</span><b>${s.iron}</b></div></div><div class="walletitem">${icon('note')}<div><span class="label">交子</span><b>${s.note}</b></div></div><div class="walletitem">${icon('cloth')}<div><span class="label">布料</span><b>${s.cloth}</b></div></div><div class="load ${v.weight>L.capacity?'over':''}"><span class="label">${s.departed?'负重':'待装载'}</span><b>${v.weight} / ${L.capacity}</b><div class="capacity" aria-label="随身负重 ${v.bagWeight} / ${L.capacity}">${v.slots.map(slot=>`<i class="slot ${slot.kind}"></i>`).join('')}</div></div></div>
 <div class="feedback ${error?'error':''}" role="status">${message}</div><div class="action-panel">`;
 if(!s.departed)html+=`<div class="row"><strong>货仓 · ${s.exchanged?'准备出发':'兑换交子'}</strong><span class="muted">${s.exchanged?'已兑换一次':'手续费 '+L.exchangeFee}</span></div>${!s.exchanged?`<div class="stepper">${btn('−','x-','small',x<=2)}<span class="stepper-value">${x} 铁钱 <em>→</em> ${x-L.exchangeFee} 交子</span>${btn('+','x+','small',x>=s.iron)}</div><div class="preview">${v.exchangeText}</div><div class="action-buttons">${btn('确认兑换','exchange','primary',!v.exchangeOk)}${btn('确认出发','depart','secondary',v.weight>L.capacity)}</div>`:`<p class="ready-copy">${v.preparationText}</p>${btn('确认出发','depart','primary',v.weight>L.capacity)}`}`;
 else if(s.location===L.shop&&!s.bought)html+=`<div class="row"><strong>布铺 · 购买布料</strong><span class="muted">价 ${L.goods.price} · 重 ${L.goods.weight}</span></div><div class="stepper">${btn('−','p-','small',p<=0)}<span class="stepper-value">${p} 铁钱 <em>+</em> ${v.payNote} 交子</span>${btn('+','p+','small',p>=L.goods.price)}</div><p class="preview">${v.buyText}</p>${btn('确认购买布料','buy','primary',!v.buyOk)}`;
 else if(s.location===L.goal)html+=`<strong>交付商行</strong><p class="ready-copy">${s.bought?'布料已备齐，可以交付了。':'尚未购得布料，请先前往布铺。'}</p>${btn('交付布料 · 完成委托','deliver','primary',!s.bought)}`;
 else html+=`<div class="travel-copy"><span class="eyebrow">${v.locationName}</span><strong>${s.bought?'带上布料，送往商行':'选择你的下一站'}</strong></div>`;
 html+=`</div><div class="controls">${btn('撤销','undo','text-button',!v.canUndo)}${btn('重试','retry','text-button')}</div></section>`;
 }
 if(rules)html+=`<div class="modal-backdrop"><section class="rules-dialog" role="dialog" aria-modal="true" aria-label="行商须知"><div class="row"><strong>行商须知</strong>${btn('关闭','rules','text-button')}</div><span class="chapter">${rulePage+1} / ${rulePages.length}</span><h2>${rulePages[rulePage][0]}</h2><p>${rulePages[rulePage][1]}</p><div class="dialog-controls">${btn('上一页','rule-prev','secondary',rulePage===0)}${btn(rulePage===2?'返回游戏':'下一页',rulePage===2?'rules':'rule-next','primary')}</div></section></div>`;
 root.innerHTML=html;
 if(rules)root.querySelector('.rules-dialog button').focus({preventScroll:true});
}
function move(to){if(rules)return;if(to===session.state.location){message='当前位于'+ShuScene.decorate(ShuPresenter.view(session,x,p)).locationName;error=false;render();return;}act({type:'move',to});}
root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled)return;if(b.dataset.node||b.dataset.building){move(b.dataset.node||b.dataset.building);return;}const a=b.dataset.action;
 if(a==='intro'||a==='play')screen=a;
 else if(a==='x-')x=Math.max(2,x-1);else if(a==='x+')x=Math.min(session.state.iron,x+1);
 else if(a==='p-')p=Math.max(0,p-1);else if(a==='p+')p=Math.min(ShuLevel.goods.price,p+1);
 else if(a==='rules'){rules=!rules;rulePage=0;}
 else if(a==='rule-prev')rulePage=Math.max(0,rulePage-1);else if(a==='rule-next')rulePage=Math.min(2,rulePage+1);
 else if(a==='retry'){session.reset();x=3;p=2;message='';error=false;screen='play';rules=false;}
 else if(a==='undo'){session.undo();message='已撤销';error=false;}
 else{act(a==='exchange'?{type:a,amount:x}:a==='buy'?{type:a,iron:p,note:ShuLevel.goods.price-p}:{type:a});return;}render();
});
root.addEventListener('keydown',e=>{if(!rules)return;if(e.key==='Escape'){rules=false;render();return;}if(e.key==='Tab'){const buttons=[...root.querySelectorAll('.rules-dialog button:not(:disabled)')],i=buttons.indexOf(document.activeElement);e.preventDefault();buttons[(i+(e.shiftKey?-1:1)+buttons.length)%buttons.length].focus();}});
function act(a){const before=session.state,r=session.act(a);error=!r.ok;message=ShuScene.feedback(r,a,before,ShuLevel);render();}render();
