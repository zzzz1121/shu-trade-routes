(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('../core/engine'));else root.ShuStoryView = factory(root.ShuEngine);
})(this, function (E) {
  function decorate(v) {
    v.menuItems = [{
      label: '本次委托',
      action: 'commission',
      icon: '◇'
    }, {
      label: '账簿',
      action: 'ledger',
      icon: '▤'
    }, {
      label: '查看规则',
      action: 'rules',
      icon: '≡'
    }, {
      label: '向阿禾求助',
      action: 'hint',
      icon: '?'
    }, {
      label: '声音设置',
      action: 'sounds',
      icon: '♪'
    }, {
      label: '重新挑战',
      action: 'retry',
      icon: '↶'
    }, {
      label: '返回章节选择',
      action: 'chapters',
      icon: '⌂'
    }];
    if (v.story && v.story.version >= 36) v.menuItems.splice(2, 0, {
      label: '史实补记',
      action: 'history-note',
      icon: '卷'
    });
    if (!v.story) return v;
    const s = v.s,
      st = v.story;
    if (st.version === 37) {
      v.storyEnded = st.phase === 'settled';
      v.storyMap = true;
      v.storyRoom = false;
      v.v36Explore = ['briefing', 'explore'].includes(st.phase);
      v.v36Background = './miniapp/assets/art-v34/warehouse-counter.webp';
      v.storyMoney = {
        iron: s.iron,
        note: Object.values(s.notesByIssuer).reduce((a, b) => a + b, 0),
        cloth: s.cargoById.cloth || 0
      };
      v.storyPayment = {
        ok: false,
        message: ''
      };
      v.storySteppers = [];
      v.storyPhase = st.phase;
      if (v.modal && v.modal.kind === 'history-note') v.historyPage = v.historyNote.pages[v.modal.page];
      const current = st.phase === 'settled' ? 3 : st.phase === 'record' ? 2 : s.departed ? 1 : 0;
      v.questSteps = ['接下委托', v.level.mission, '核账与回访'].map((text, i) => ({
        id: i,
        text,
        current: i === current,
        done: i < current
      }));
      return v;
    }
    v.storyRoom = st.version !== 36 && s.nodeId === 'warehouse' && ['counter', 'coin', 'box'].includes(st.phase);
    v.v36Explore = st.version === 36 && ['gate', 'entry', 'frontdesk', 'counter', 'prepare'].includes(st.phase);
    v.v36Background = './miniapp/assets/art-v34/' + (['counter', 'prepare'].includes(st.phase) ? 'warehouse-counter' : st.phase === 'frontdesk' ? 'merchant-room' : 'market-lane') + '.webp';
    if (v.modal && v.modal.kind === 'history-note') v.historyPage = v.historyNote.pages[v.modal.page];
    v.roomObjects = [{
      id: 'money',
      label: '钱袋'
    }, {
      id: 'ledger',
      label: '账簿'
    }, {
      id: 'hook',
      label: '挂钩'
    }, {
      id: 'water',
      label: '水碗'
    }, ...(st.phase === 'coin' ? [{
      id: 'coin',
      label: '柜底铁钱'
    }] : []), ...(st.phase === 'box' ? [{
      id: 'box',
      label: '旧木匣'
    }] : [])].map(o => Object.assign(o, {
      active: v.storyObjects.some(a => a.id === o.id),
      action: 'object:' + o.id,
      primary: o.id === {
        counter: 'money',
        coin: 'coin',
        box: 'box'
      }[st.phase],
      hint: {
        money: '钱袋 · 备货款',
        coin: '拾起铁钱',
        box: '托住旧匣'
      }[o.id] || o.label
    }));
    v.storyEnded = st.phase === 'settled';
    v.storyMap = s.status === 'playing' || s.status === 'won' && !v.storyEnded;
    v.storyMoney = {
      iron: s.departed ? s.iron : s.warehouseIron,
      note: s.notesByIssuer.a || 0,
      cloth: s.cargoById.cloth || 0
    };
    v.paymentVisible = st.phase === 'payment' && st.paymentOpen;
    v.storyPayment = E.transition(s, {
      type: 'buy',
      transactionId: 'buy-cloth',
      iron: v.storyPayIron,
      notes: {
        a: v.storyPayNote
      }
    }, v.level);
    v.storySteppers = [{
      key: 'p',
      label: '铁钱',
      value: v.storyPayIron,
      max: Math.min(s.iron, 6 - v.storyPayNote)
    }, {
      key: 'n',
      label: '交子',
      value: v.storyPayNote,
      max: Math.min(s.notesByIssuer.a || 0, 6 - v.storyPayIron)
    }].map(x => Object.assign(x, {
      minus: x.key + '-',
      plus: x.key + '+',
      minDisabled: x.value === 0,
      maxDisabled: x.value >= x.max
    }));
    const stage = st.flags.endingSeen ? 5 : ['record', 'ending', 'settled', 'stay'].includes(st.phase) ? 4 : s.cargoById.cloth || st.phase === 'delivery' ? 3 : ['road', 'cloth', 'payment', 'return'].includes(st.phase) ? 2 : st.phase === 'entry' ? 0 : 1;
    v.questSteps = ['拜访掌柜', '整理货款', '布铺取货', '送到前堂', '交付记账'].map((label, i) => ({
      id: i,
      label,
      current: i === stage,
      done: i < stage,
      text: i === stage ? v.storyGoal : label
    }));
    v.storyBubble = st.bubble && st.bubble.text;
    v.storyPhase = st.phase;
    return v;
  }
  return {
    decorate
  };
});