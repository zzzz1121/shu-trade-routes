(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();else root.ShuDialogue = factory();
})(this, function () {
  'use strict';

  // Replace these scenes with the supplied script. Stable IDs keep choices and saves portable.
  const expressions = ['neutral', 'smile', 'thinking', 'puzzled', 'worried', 'firm'];
  function line(id, speaker, text, expression = 'neutral', pose = 'idle') {
    return {
      id,
      speaker,
      text,
      expression,
      pose
    };
  }
  function scenes(level, rules) {
    const prefix = level.id + ':';
    return {
      opening: {
        id: prefix + 'opening',
        lines: (level.intro[1].match(/[^。！？；，]+[。！？；，]?/g) || []).map((text, i) => line(prefix + 'opening:' + i, level.intro[0], text, i ? 'firm' : 'neutral', i ? 'explain' : 'idle')),
        choices: [{
          id: 'purse',
          label: '问清钱袋',
          next: 'purse'
        }, {
          id: 'shops',
          label: '核对铺子规矩',
          next: 'shops'
        }, {
          id: 'leave',
          label: '这就启程',
          next: null
        }]
      },
      purse: {
        id: prefix + 'purse',
        lines: [line(prefix + 'purse', '阿禾', rules.find(r => r[0] === '钱袋与行动')[1], 'thinking', 'explain')],
        choices: [{
          id: 'shops',
          label: '再看看铺子',
          next: 'shops'
        }, {
          id: 'leave',
          label: '记下了，启程',
          next: null
        }]
      },
      shops: {
        id: prefix + 'shops',
        lines: level.transactions.map((t, i) => line(prefix + 'shop:' + t.id, t.type === 'redeem' || t.type === 'swap' ? '许掌柜' : '阿禾', level.nodes.find(n => n.id === t.nodeId).name + '：' + rules.find(r => r[0] === level.nodes.find(n => n.id === t.nodeId).name)[1], i ? 'firm' : 'thinking', 'explain')),
        choices: [{
          id: 'purse',
          label: '再问问钱袋',
          next: 'purse'
        }, {
          id: 'leave',
          label: '记下了，启程',
          next: null
        }]
      }
    };
  }
  const lessonExpressions = {
    money: 'puzzled',
    exchange: 'thinking',
    route: 'thinking',
    shop: 'firm',
    grain_shop: 'firm',
    medicine_shop: 'firm',
    tea_shop: 'thinking',
    xu_exchange: 'worried',
    west_market: 'firm'
  };
  function teaching(level, id) {
    const source = level.lessons[id];
    return source ? line(level.id + ':lesson:' + id, source[0], source[1], lessonExpressions[id] || 'neutral', 'explain') : null;
  }
  // Optional personal aims expose existing route tradeoffs. They never gate delivery.
  function approach(l, s, plan) {
    const fast = [3, 3, 2, 4, 2, 4][l.number - 1],
      tolls = s.events.filter(e => e.type === 'move').reduce((n, e) => n + (e.fee || 0), 0),
      spent = s.events.filter(e => e.type === 'buy').reduce((n, e) => n + e.iron + Object.values(e.notes || {}).reduce((a, b) => a + b, 0), 0);
    const economical = l.number === 2 ? '交付后留 1 铁钱' : l.number === 3 ? '货款不超过 4' : l.number === 5 ? '货款不超过 5' : '不付通行费';
    const met = plan === 'speed' ? s.stepsUsed <= fast : l.number === 2 ? s.iron >= 1 : l.number === 3 ? spent <= 4 : l.number === 5 ? spent <= 5 : tolls === 0;
    return {
      speed: fast + ' 步内送达',
      economy: economical,
      selected: plan,
      label: plan === 'speed' ? fast + ' 步内送达' : economical,
      met: s.status === 'won' && !!plan && met
    };
  }
  return {
    scenes,
    line,
    teaching,
    expressions,
    approach
  };
});