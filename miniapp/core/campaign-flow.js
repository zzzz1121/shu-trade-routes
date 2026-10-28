(function (r, f) {
  if (typeof module === 'object' && module.exports) module.exports = f(require('./engine'), require('./presenter'), require('./campaign'));else r.ShuCampaignFlow = f(r.ShuEngine, r.ShuPresenter, r.ShuCampaign);
})(this, function (E, P, C) {
  'use strict';

  const clone = x => JSON.parse(JSON.stringify(x)),
    READ = 'shu-story-read-v1',
    MEMORY = 'shu-campaign-memory-v1';
  function create(host, storage = {}) {
    let history = [],
      read = {},
      memory = {
        version: 1,
        chapters: {}
      },
      returnModal = null;
    try {
      const m = storage.read && storage.read(MEMORY);
      if (m && m.version === 1 && m.chapters && typeof m.chapters === 'object' && !Array.isArray(m.chapters)) {
        memory.chapters = Object.fromEntries(Object.entries(m.chapters).filter(([id, v]) => /^l0[1-6]$/.test(id) && v && v.flags && typeof v.flags === 'object' && v.start && typeof v.start === 'object'));
      }
    } catch (_ignored) {}
    try {
      const m = storage.read && storage.read(READ);
      if (m && Array.isArray(m.ids)) read = Object.fromEntries(m.ids.filter(x => typeof x === 'string').map(x => [x, true]));
    } catch (_ignored2) {}
    const ui = host.ui,
      st = () => ui.story,
      cfg = () => C.chapters[host.session.level.id],
      active = () => !!(st() && st().version === 37),
      saveMemory = () => {
        try {
          storage.write && storage.write(MEMORY, memory);
        } catch (_ignored3) {}
      };
    function inherit(id) {
      if (memory.chapters[id]) return clone(memory.chapters[id].start || {});
      const result = {};
      for (const [chapter, data] of Object.entries(memory.chapters)) if (chapter < id) {
        for (const [k, v] of Object.entries(data.flags || {})) result['prior.' + chapter + '.' + k] = v;
      }
      return result;
    }
    function record(id, flags, start = {}) {
      memory.chapters[id] = {
        flags: clone(Object.fromEntries(Object.entries(flags).filter(([k]) => !k.startsWith('prior.')))),
        start: clone(start)
      };
      saveMemory();
    }
    function mark(line) {
      if (!line) return;
      read[line.id] = true;
      try {
        storage.write && storage.write(READ, {
          version: 1,
          ids: Object.keys(read).slice(-12000)
        });
      } catch (_ignored4) {}
    }
    function show() {
      const m = ui.modal,
        l = m.lines[m.cursor];
      m.line = clone(l);
      m.title = l.speaker;
      m.body = l.text;
      m.startedAt = Date.now();
      m.readyAt = m.startedAt + l.text.length * 18;
      m.revealed = false;
      m.canSkipRead = !!read[l.id];
      st().active = {
        id: m.scene,
        cursor: m.cursor
      };
      const last = ui.backlog[ui.backlog.length - 1];
      if (!last || last.id !== l.id) ui.backlog.push(clone(l));
      if (ui.backlog.length > 6000) ui.backlog.shift();
    }
    function open(id, cursor = 0) {
      const ev = C.event(id, st().flags);
      if (!ev) return;
      ui.error = false;
      ui.message = '';
      ui.modal = {
        kind: 'story',
        source: 'v4',
        scene: id,
        background: ev.background,
        lines: ev.lines,
        choices: ev.choices,
        cursor: Math.min(cursor, ev.lines.length - 1)
      };
      show();
    }
    function begin(id) {
      host.begin(id);
      history = [];
      returnModal = null;
      const start = inherit(id);
      ui.story = {
        version: 37,
        chapter: id,
        phase: 'briefing',
        flags: clone(start),
        startMemory: clone(start),
        previousMemory: clone(memory.chapters[id] || null),
        previouslyCompleted: host.completed(id),
        seenEvents: {},
        active: null,
        tradeOpen: false
      };
      ui.screen = 'play';
      ui.skip = true;
      open(cfg().opening);
    }
    function complete() {
      const m = ui.modal,
        ev = C.event(m.scene, st().flags);
      mark(m.line);
      if (m.choices.length) return;
      st().seenEvents[m.scene] = true;
      st().active = null;
      ui.modal = null;
      if (ev.done.phase) st().phase = ev.done.phase;
      if (ev.done.complete) {
        st().flags.endingSeen = true;
        for (const clue of cfg().clues) st().flags['clue.' + clue] = true;
        record(host.session.level.id, st().flags, st().startMemory);
        host.completeLevel();
      }
      if (ev.done.next) open(ev.done.next);
    }
    function advance() {
      const m = ui.modal;
      if (!m || m.source !== 'v4') return;
      if (!m.revealed && Date.now() < m.readyAt) {
        m.revealed = true;
        return;
      }
      mark(m.line);
      if (m.cursor < m.lines.length - 1) {
        m.cursor++;
        show();
      } else complete();
    }
    function commit(action) {
      const before = {
          session: host.session.snapshot(),
          ui: clone(ui)
        },
        result = host.session.act(action);
      if (!result.ok) {
        ui.error = true;
        ui.message = result.message;
        return false;
      }
      history.push(before);
      if (history.length > 100) history.shift();
      ui.modal = null;
      ui.error = false;
      ui.message = host.eventText(result.event);
      host.defaults();
      st().tradeOpen = false;
      if (result.state.status === 'failed') {
        st().phase = 'failed';
        return true;
      }
      if (action.type === 'depart') {
        st().phase = 'road';
        return true;
      }
      if (action.type === 'move') {
        st().phase = 'road';
        const scene = cfg().arrivals[result.state.nodeId];
        if (scene && !st().seenEvents[scene]) open(scene);
        return true;
      }
      if (action.type === 'deliver') {
        st().phase = 'record';
        open(cfg().ending);
        return true;
      }
      if (['buy', 'sell', 'swap', 'redeem'].includes(action.type)) {
        if (action.type === 'sell') st().flags.receive = action.receive;
        const scene = cfg().trades[action.transactionId];
        if (scene) open(scene);
      }
      return true;
    }
    function handle(id) {
      if (!active() || ui.screen !== 'play') return false;
      const m = ui.modal,
        s = host.session.state;
      if (st().tradeOpen && !['trade-close', 'transact', 'receive-iron', 'receive-note'].includes(id) && !/^(p|n|amount)[+-]$/.test(id)) return true;
      if (id === 'home' || id === 'chapters') {
        ui.screen = id === 'home' ? 'home' : 'chapters';
        ui.modal = null;
        return true;
      }
      if (id === 'story-retry' || id === 'retry') {
        begin(host.session.level.id);
        return true;
      }
      if (id === 'backlog') {
        if (m && m.kind === 'backlog') return true;
        returnModal = clone(m);
        ui.modal = {
          kind: 'backlog',
          title: '对话回看'
        };
        return true;
      }
      if (m && m.kind === 'backlog') {
        if (id === 'backlog-return' || id === 'close') {
          ui.modal = returnModal;
          returnModal = null;
        }
        return true;
      }
      if (m && m.source === 'v4') {
        if (id === 'sounds') {
          ui.modal = {
            kind: 'sound',
            returnCampaign: clone(m)
          };
          return true;
        }
        if (id === 'dialogue-next' || id === 'close') {
          advance();
          return true;
        }
        if (id === 'story-skip-read') {
          while (ui.modal && ui.modal.source === 'v4' && ui.modal.canSkipRead && !(ui.modal.cursor === ui.modal.lines.length - 1 && ui.modal.choices.length)) {
            ui.modal.revealed = true;
            advance();
          }
          return true;
        }
        if (id.startsWith('choice:') && m.cursor === m.lines.length - 1 && (m.revealed || Date.now() >= m.readyAt)) {
          const c = m.choices.find(c => c.id === id.slice(7));
          if (c) {
            mark(m.line);
            Object.assign(st().flags, c.effects);
            ui.backlog.push({
              id: m.scene + ':choice:' + c.id,
              speaker: '你',
              expression: 'neutral',
              pose: 'idle',
              text: c.label
            });
            st().seenEvents[m.scene] = true;
            open(c.next);
          }
          return true;
        }
        return true;
      }
      if (m && m.kind === 'sound') {
        if (id === 'close') ui.modal = m.returnCampaign ? clone(m.returnCampaign) : null;
        return true;
      }
      if (m && m.kind === 'history-note') {
        if (id === 'close') ui.modal = null;else if (id === 'history-note-next' || id === 'history-note-prev') {
          m.page = Math.max(0, Math.min(C.history(host.session.level.id).pages.length - 1, m.page + (id.endsWith('next') ? 1 : -1)));
          try {
            const data = storage.read && storage.read('shu-history-read-v1') || {
              version: 1
            };
            data[host.session.level.id] = m.page;
            storage.write && storage.write('shu-history-read-v1', data);
          } catch (_ignored5) {}
        }
        return true;
      }
      if (m && m.kind === 'menu') {
        if (['commission', 'ledger', 'rules', 'hint', 'sounds', 'undo', 'history-note'].includes(id)) ui.modal = null;else if (id === 'close') ui.modal = null;else return true;
      } else if (m) {
        if (id === 'close') {
          ui.modal = null;
          return true;
        }
        if (!(m.kind === 'move' && id === 'confirm-move') && !(m.kind === 'rules' && id === 'history') && !['rule-next', 'rule-prev', 'hint-next', 'history-prev', 'history-next'].includes(id)) return true;
      }
      if (id === 'history-note') {
        if (host.completed(host.session.level.id)) ui.modal = {
          kind: 'history-note',
          page: 0
        };else {
          ui.message = '本章故事结束后开放史实补记。';
          ui.error = true;
        }
        return true;
      }
      if (id === 'undo') {
        const previous = history.pop();
        if (previous) {
          if (st().flags.endingSeen) {
            if (!st().previouslyCompleted) host.revokeLevel();
            if (st().previousMemory) memory.chapters[host.session.level.id] = clone(st().previousMemory);else delete memory.chapters[host.session.level.id];
            saveMemory();
          }
          host.session = E.restoreSession(previous.session);
          Object.assign(ui, clone(previous.ui));
          ui.modal = null;
          ui.error = false;
          ui.message = '已撤回上一项行动。';
        }
        return true;
      }
      if (id.startsWith('object:')) {
        const key = id.slice(7);
        if (key === 'start' && st().phase === 'explore') {
          st().phase = 'road';
          ui.modal = null;
        } else if (key === 'trade' && st().phase === 'road' && s.status === 'playing' && P.view(host.session, ui).panel.action) {
          st().tradeOpen = true;
          ui.modal = null;
        } else if (key === 'deliver' && st().phase === 'road' && s.status === 'playing') commit({
          type: 'deliver'
        });else if (cfg().investigations.some(([k]) => k === key) && st().phase === 'explore') open(cfg().prefix + '_' + key);
        return true;
      }
      if (id === 'trade-close') {
        st().tradeOpen = false;
        return true;
      }
      if (id === 'confirm-move') {
        if (m && m.kind === 'move' && m.canMove && s.departed && !st().tradeOpen) commit({
          type: 'move',
          to: m.nodeId
        });
        return true;
      }
      if (id === 'transact') {
        if (!st().tradeOpen) return true;
        const p = P.view(host.session, ui).panel;
        if (p.action) commit(p.action);
        return true;
      }
      if (id === 'deliver' || id === 'depart' || id === 'exchange' || id === 'play' || id === 'skip-intro' || id === 'replay') return true;
      const a = /^(p|n|amount)([+-])$/.exec(id);
      if (a) {
        if (!st().tradeOpen) return true;
        const t = host.session.level.transactions.find(t => t.id === ui.tradeId);
        if (!t) return true;
        const key = {
            p: 'payIron',
            n: 'payNote',
            amount: 'amount'
          }[a[1]],
          min = key === 'amount' ? 1 : 0,
          max = key === 'amount' ? Math.min(t.limit, s.notesByIssuer[t.issuer] || 0) : key === 'payIron' ? Math.min(s.iron, t.price - ui.payNote) : Math.min(s.notesByIssuer[t.issuer] || 0, t.price - ui.payIron);
        if (Number.isFinite(max) && max >= min) ui[key] = Math.max(min, Math.min(max, ui[key] + (a[2] === '+' ? 1 : -1)));
        return true;
      }
      return false;
    }
    function decorate(v) {
      if (!active()) return v;
      const c = cfg(),
        s = host.session.state;
      v.story = clone(st());
      v.campaign = c;
      v.historyNote = C.history(v.level.id);
      v.historyUnlocked = host.completed(v.level.id);
      v.canUndo = history.length > 0;
      v.storyStats = {
        steps: s.stepsUsed
      };
      v.storyGoal = st().phase === 'explore' ? '备好货单，出发' : s.status === 'won' ? '听完今日的故事' : E.ready(s, host.session.level) ? '将货送回罗记前堂' : host.session.level.mission;
      v.storyObjects = st().phase === 'explore' ? [...c.investigations.map(([id, label]) => ({
        id,
        label,
        action: 'object:' + id
      })), {
        id: 'start',
        label: '出发',
        action: 'object:start'
      }] : s.status === 'playing' ? v.panel.action ? [{
        id: 'trade',
        label: '进铺交谈与交易',
        action: 'object:trade'
      }] : s.nodeId === v.level.goal ? [{
        id: 'deliver',
        label: '核货并交付',
        action: 'object:deliver',
        disabled: !E.ready(s, host.session.level)
      }] : [] : [];
      v.level = Object.assign({}, v.level, {
        nodes: v.level.nodes.map(n => Object.assign({}, n, {
          name: c.names[n.id] || n.name
        }))
      });
      v.nodes = v.nodes.map(n => Object.assign({}, n, {
        name: c.names[n.id] || n.name
      }));
      v.pathText = s.routeHistory.map(id => v.level.nodes.find(n => n.id === id).name).join(' → ');
      v.paymentVisible = st().tradeOpen;
      v.panel.steppers = v.panel.steppers.map(x => {
        var _v$panel$action, _host$session$level$t, _host$session$level$t2;
        return Object.assign({}, x, {
          maxDisabled: x.value >= (x.key === 'p' ? Math.min(s.iron, ((_v$panel$action = v.panel.action) === null || _v$panel$action === void 0 ? void 0 : _v$panel$action.type) === 'buy' ? host.session.level.transactions.find(t => t.id === ui.tradeId).price - ui.payNote : 0) : x.key === 'n' ? Math.min(s.notesByIssuer[(_host$session$level$t = host.session.level.transactions.find(t => t.id === ui.tradeId)) === null || _host$session$level$t === void 0 ? void 0 : _host$session$level$t.issuer] || 0, host.session.level.transactions.find(t => t.id === ui.tradeId).price - ui.payIron) : Math.min(((_host$session$level$t2 = host.session.level.transactions.find(t => t.id === ui.tradeId)) === null || _host$session$level$t2 === void 0 ? void 0 : _host$session$level$t2.limit) || 0, s.notesByIssuer[host.session.level.issuer] || 0))
        });
      });
      return v;
    }
    function snapshot() {
      return {
        version: 3,
        session: host.session.snapshot(),
        ui: clone(ui),
        history: clone(history)
      };
    }
    function validate(data) {
      try {
        if (!data || data.version !== 3 || !C.chapters[data.session.levelId] || !Array.isArray(data.history) || data.history.length > 100) return false;
        function valid(u) {
          if (!u || !u.story || u.story.version !== 37 || u.story.chapter !== data.session.levelId || !u.story.flags || !u.story.seenEvents || !['briefing', 'explore', 'road', 'record', 'settled', 'failed'].includes(u.story.phase) || !Array.isArray(u.backlog) || u.backlog.length > 6000 || !['payIron', 'payNote', 'amount'].every(k => Number.isInteger(u[k]) && u[k] >= 0 && u[k] <= 100)) return false;
          const a = u.story.active;
          return !a || typeof a.id === 'string' && a.id.startsWith(C.chapters[data.session.levelId].prefix + '_') && C.event(a.id, u.story.flags) && Number.isInteger(a.cursor) && a.cursor >= 0 && a.cursor < C.event(a.id, u.story.flags).lines.length;
        }
        if (!valid(data.ui)) return false;
        E.restoreSession(data.session);
        for (const h of data.history) {
          if (h.session.levelId !== data.session.levelId || !valid(h.ui)) return false;
          E.restoreSession(h.session);
        }
        return true;
      } catch (_ignored6) {
        return false;
      }
    }
    function restore(data) {
      if (!validate(data)) return false;
      host.session = E.restoreSession(data.session);
      Object.assign(ui, clone(data.ui));
      history = clone(data.history);
      ui.screen = 'play';
      if (st().active) open(st().active.id, st().active.cursor);else ui.modal = null;
      return true;
    }
    return {
      begin,
      handle,
      decorate,
      snapshot,
      validate,
      restore,
      record,
      reset() {
        history = [];
        returnModal = null;
        delete ui.story;
      },
      resetRead() {
        read = {};
        memory = {
          version: 1,
          chapters: {}
        };
      },
      get active() {
        return active();
      },
      get canResume() {
        return active();
      }
    };
  }
  return {
    create,
    MEMORY
  };
});