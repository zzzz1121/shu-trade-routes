function v36Play(v) {
  const st = v.story,
    indoors = ['gate', 'entry', 'frontdesk', 'counter', 'prepare'].includes(st.phase),
    bg = ['counter', 'prepare'].includes(st.phase) ? 'warehouse-counter' : st.phase === 'frontdesk' ? 'merchant-room' : 'market-lane';
  const objects = v.storyObjects.filter(o => o.id !== 'pay');
  return `<section class="story-game v36-game ${indoors ? 'v36-explore' : ''} ${v.s.nodeId === 'shop' && st.phase === 'payment' && !st.tradeMap ? 'is-trading' : ''}"><header class="story-hud"><button class="chapter-button" data-action="commission"><strong><img src="./miniapp/assets/title-v36/opening-calligraphy.webp" alt="布匹之约"></strong></button><div class="hud-counts"><span><small>行程</small><b>${v.s.stepsUsed}<i>/4 步</i></b></span><span><small>负重</small><b>${v.weight}<i>/5 格</i></b></span></div><button class="text-button notebook-toggle" data-action="menu" aria-label="行商手记"></button></header>${indoors ? `<img class="v36-location" src="./miniapp/assets/art-v34/${bg}.webp" alt="${st.phase === 'gate' ? '罗记门前' : '罗记商行'}">` : v.s.nodeId === 'shop' && st.phase === 'payment' && !st.tradeMap ? shopScene(v) : mapView(v)}${questTrack(v)}<section class="story-dock v36-dock">${indoors ? '' : storyWallet(v)}${v.paymentVisible ? storyPay(v) : ''}<div class="v36-investigations">${objects.map(o => btn(o.label, o.action, ['enter', 'warehouse', 'exchange-desk', 'deliver-now'].includes(o.id) ? 'primary' : 'text-button', o.disabled)).join('')}</div>${st.phase === 'payment' && !st.paymentOpen ? btn('与沈娘子交易', 'object:pay') : ''}${st.phase === 'prepare' ? btn(v.s.exchanged ? '整理钱袋，准备出发' : '到柜台办兑换', 'wallet') : ''}</section>${v.error && v.message ? `<div class="story-toast" role="alert">${esc(v.message)}</div>` : ''}</section>`;
}
function v36Prepare(v) {
  const d = v.draft,
    s = v.s;
  return `<div class="prepare-panel"><p>仓库货款 8 铁钱 · 钱袋最多承重 5 格</p>${!s.exchanged ? `<div class="stepper">${btn('−', 'x-', 'small', v.storyDraftX <= 2)}<span>存入 ${v.storyDraftX} 铁钱</span>${btn('+', 'x+', 'small', v.storyDraftX >= 8)}</div>` : ''}<dl class="draft-summary"><div><dt>兑换手续费</dt><dd>${d.fee} 铁钱</dd></div><div><dt>${s.exchanged ? '已装好' : '确认后携带'}</dt><dd>${d.iron} 铁钱 · ${d.note} 交子</dd></div><div><dt>负重</dt><dd>${d.load} / 5 格</dd></div></dl><p class="draft-warning">${esc(d.problem || '布铺至少收 2 铁钱，过桥还需另留 1 铁钱。')}</p>${s.exchanged ? btn('确认出发', 'prepare-depart', 'primary', !d.canDepart) : btn('确认兑换', 'exchange-confirm', 'primary', !d.canDepart)}</div>`;
}
function v36Result(v) {
  return `<section class="story-result settled-scene"><img class="result-scenery" src="./miniapp/assets/art-v34/ending-town.webp" alt="收市后的商镇"><span class="eyebrow">第一章 · 完</span><h1>布匹之约</h1><div class="result-body"><div class="closing-quote"><p>布已交到，账还没有说完。</p></div><div class="account-summary"><p>${esc(v.pathText)}</p><p>${v.storyStats.steps} 步 · 桥费 ${v.storyStats.tollFee} · 兑换费 ${v.storyStats.exchangeFee}</p><p>剩余 ${esc(v.remainingText)}</p></div><div class="result-actions">${btn('读一段史实', 'history-note')}${btn('返回旅程', 'chapters', 'secondary')}${btn('重看完整故事', 'story-retry', 'text-button')}${btn('撤回交付', 'undo', 'text-button', !v.canUndo)}</div></div></section>`;
}
function v36History(v) {
  const m = v.modal,
    h = v.historyNote,
    p = h.pages[m.page];
  return `<div class="modal-backdrop history-note-backdrop"><section class="rules-dialog history-note" role="dialog" aria-modal="true" aria-label="史实补记"><div class="row"><span class="eyebrow">史实补记 ${m.page + 1} / ${h.pages.length}</span>${btn('合上补记', 'close', 'text-button')}</div><h2>${esc(p.title)}</h2><div class="history-note-copy">${esc(p.body)}</div><details><summary>资料来源</summary>${h.sources.map(s => `<p><span>${esc(s.name)}</span></p>`).join('')}</details><div class="dialog-controls">${btn('上一页', 'history-note-prev', 'secondary', m.page === 0)}${m.page === h.pages.length - 1 ? btn('合上补记', 'close') : btn('下一页', 'history-note-next')}</div></section></div>`;
}