(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./v36-script'));else root.ShuChapterOne = factory(root.ShuV36Script);
})(this, function (Script) {
  'use strict';

  // V4.0 supplied script. Pure narrative data; money and roads remain in engine/level.
  const VERSION = 36,
    emotions = {
      平常: 'neutral',
      平静: 'neutral',
      微笑: 'smile',
      满意: 'smile',
      释然: 'smile',
      认真: 'firm',
      严肃: 'firm',
      思索: 'thinking',
      无奈: 'thinking',
      担忧: 'worried',
      为难: 'worried'
    };
  function initial() {
    return {
      version: 36,
      phase: 'gate',
      flags: {},
      seenEvents: {},
      routeVisited: [],
      draftEnabled: true,
      paymentOpen: true,
      active: null,
      bubble: null
    };
  }
  function valid(s) {
    return !!s && s.version === 36 && ['gate', 'entry', 'frontdesk', 'counter', 'prepare', 'road', 'payment', 'return', 'delivery', 'record', 'ending', 'settled', 'stay', 'failed'].includes(s.phase) && s.flags && typeof s.flags === 'object' && s.seenEvents && Array.isArray(s.routeVisited);
  }
  const row = (speaker, text, emotion = '平常', pose = 'idle') => ({
    speaker,
    text,
    expression: emotions[emotion] || 'neutral',
    pose
  });
  const a = (text, emotion = '平常') => row('阿禾', text, emotion),
    luo = (text, emotion = '平静') => row('罗掌柜', text, emotion),
    shen = (text, emotion = '平常') => row('沈娘子', text, emotion),
    you = text => row('你', text),
    n = text => row('旁白', text);
  const choice = (id, label, next, effects = {}) => ({
    id,
    label,
    next,
    effects
  });
  function event(id, s, stats = {}) {
    const raw = Script[id];
    if (!raw) return null;
    const e = JSON.parse(JSON.stringify(raw)),
      route = stats.bridge ? 'bridge' : 'alley';
    e.id = id;
    e.lines = e.lines.filter(l => !l.route || l.route === route);
    if (!e.lines.length) e.lines = [{
      id: 'v36:' + id + ':pause',
      speaker: '旁白',
      text: ' ',
      expression: 'neutral',
      pose: 'idle'
    }];
    return e;
  }
  function stats(s) {
    const buys = s.events.filter(e => e.type === 'buy'),
      exchangeFee = s.events.filter(e => e.type === 'exchange').reduce((v, e) => v + e.fee, 0),
      tollFee = s.events.filter(e => e.type === 'move').reduce((v, e) => v + (e.fee || 0), 0);
    return {
      payment: buys.reduce((v, e) => v + e.iron + Object.values(e.notes || {}).reduce((a, b) => a + b, 0), 0),
      exchangeFee,
      tollFee,
      balance: s.iron + Object.values(s.notesByIssuer).reduce((a, b) => a + b, 0),
      bridge: s.routeHistory.includes('bridge'),
      steps: s.stepsUsed
    };
  }
  function objects(st, s) {
    const obj = (id, label) => ({
        id,
        label,
        disabled: false
      }),
      p = st.phase;
    if (p === 'gate') return [obj('sign', '罗记招牌'), obj('crates', '门边货箱'), obj('porters', '街上脚夫'), obj('enter', '走进罗记')];
    if (p === 'frontdesk') return [obj('order-investigate', '委托单'), obj('sample', '布样'), obj('ledger', '账簿边角'), obj('warehouse', '跟阿禾去后仓')];
    if (p === 'counter' || p === 'prepare') return [obj('money', '铁钱木盘'), obj('bag', '随身钱袋'), obj('exchange-desk', '兑换柜台'), obj('order', '货单')];
    if (p === 'payment') return [obj('inspect-cloth', '看看针脚'), obj('pay', '与沈娘子交易'), obj('order', '货单')];
    if (p === 'delivery' && s.cargoById.cloth) return [obj('deliver-now', '交付布匹')];
    if (p === 'return') return [obj('way-back', '问问阿禾')];
    return [];
  }
  function goal(st, s) {
    return {
      gate: '走进罗记',
      entry: '结识阿禾',
      frontdesk: '跟阿禾去后仓',
      counter: '查看货款，办好兑换',
      prepare: s.exchanged ? '货款已备，确认出发' : '到柜台兑换交子',
      payment: '核货，付清六份布钱',
      return: '送布到罗记前堂',
      delivery: '确认交付布匹',
      record: '听罗掌柜把话说完',
      ending: '收市之后，和阿禾聊聊',
      settled: '布已交到，账还没有说完。'
    }[st.phase] || '前往沈家布铺';
  }
  return {
    VERSION,
    initial,
    valid,
    event,
    stats,
    objects,
    goal,
    emotions
  };
});