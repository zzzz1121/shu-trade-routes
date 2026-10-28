function campaignPlay(v) {
  const st = v.story;
  const indoors = st.phase === 'explore' || st.phase === 'briefing';
  return `<section class="story-game campaign-game"><header class="story-hud"><button class="chapter-button" data-action="commission"><strong class="campaign-title">${esc(v.level.title)}</strong></button><div class="hud-counts"><span><small>行程</small><b>${v.s.stepsUsed}<i>/${v.level.maxSteps} 步</i></b></span><span><small>负重</small><b>${v.weight}<i>/${v.level.capacity} 格</i></b></span></div><button class="text-button notebook-toggle" data-action="menu" aria-label="行商手记"></button></header>${indoors ? '<img class="v36-location" src="./miniapp/assets/art-v34/warehouse-counter.webp" alt="备货柜台">' : mapView(v)}${questTrack(v)}<section class="story-dock campaign-dock">${campaignWallet(v)}${!st.tradeOpen ? `<div class="v36-investigations">${v.storyObjects.map(o => btn(o.label, o.action, o.id === 'start' || o.id === 'deliver' || o.id === 'trade' ? 'primary' : 'text-button', o.disabled)).join('')}</div>` : ''}</section>${v.error && v.message ? `<div class="story-toast" role="alert">${esc(v.message)}</div>` : ''}</section>${st.tradeOpen ? campaignTrade(v) : ''}`;
}
function campaignWallet(v) {
  return `<button class="purse-button" data-action="wallet" aria-label="查看钱袋">${v.resources.map(r => `<span>${icon(r)}<b>${r.value || 0}</b> ${esc(r.name.replace('仓库', ''))}</span>`).join('')}<span class="purse-open">钱袋</span></button>`;
}
function campaignTrade(v) {
  var _ShuCampaign$Script$v;
  const t = v.level.transactions.find(t => {
      var _v$panel$action;
      return t.id === ((_v$panel$action = v.panel.action) === null || _v$panel$action === void 0 ? void 0 : _v$panel$action.transactionId);
    }),
    who = (t === null || t === void 0 ? void 0 : t.type) === 'swap' || (t === null || t === void 0 ? void 0 : t.type) === 'redeem' ? '许掌柜' : v.s.nodeId === 'grain_shop' ? '陈伯' : v.s.nodeId === 'medicine_shop' ? '闵娘子' : /cloth|east_market/.test(v.s.nodeId) && v.level.id !== 'l05' ? '沈娘子' : '阿禾';
  return `<div class="modal-backdrop campaign-trade-backdrop"><img class="campaign-trade-scenery" src="${ShuStoryScenes.background(((_ShuCampaign$Script$v = ShuCampaign.Script[v.campaign.arrivals[v.s.nodeId]]) === null || _ShuCampaign$Script$v === void 0 ? void 0 : _ShuCampaign$Script$v.background) || 'merchant-room')}" alt="商铺柜台"><section class="rules-dialog campaign-trade" role="dialog" aria-modal="true" aria-label="${esc(v.panel.title)}"><div class="row"><h2>${esc(v.panel.title)}</h2>${btn('先收起', 'trade-close', 'text-button')}</div><div class="trade-npc">${portrait(ShuNarrative.actor(who, './miniapp/assets'), 'trade-portrait')}<p>${esc(v.panel.meta)}</p></div><p class="trade-balance">现有 ${esc(v.remainingText)} · 负重 ${v.weight}/${v.level.capacity}</p>${panel(v)}${v.error ? `<p role="alert">${esc(v.message)}</p>` : ''}</section></div>`;
}
function campaignResult(v) {
  const won = v.s.status === 'won';
  return `<section class="story-result settled-scene campaign-result"><img class="result-scenery" src="./miniapp/assets/art-v34/ending-town.webp" alt="收市后的商镇"><span class="eyebrow">第 ${v.level.number} 章 ${won ? '· 完' : ''}</span><h1>${esc(won ? v.level.title : '这趟，再想想')}</h1><div class="result-body"><div class="closing-quote"><p>${esc(won ? v.campaign.closing : v.resultText)}</p></div><div class="account-summary">${won ? `<p>已交付：${Object.entries(v.level.target.cargo).map(([id, n]) => esc(v.level.goods[id].name) + ' × ' + n).join('、')}</p>` : ''}<p>${esc(v.pathText)}</p><p>${v.s.stepsUsed} / ${v.level.maxSteps} 步 · 费用 ${v.fee}</p><p>剩余 ${esc(v.remainingText)}</p></div><div class="result-actions">${won ? btn('读一段史实', 'history-note') : btn('撤销上一步', 'undo', 'primary', !v.canUndo)}${btn(v.level.number === 6 ? '返回行商六记' : '继续旅程', 'chapters', 'secondary')}${won ? btn('撤回交付', 'undo', 'text-button', !v.canUndo) : ''}${btn('重看本章', 'story-retry', 'text-button')}</div></div></section>`;
}