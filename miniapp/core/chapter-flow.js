(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./engine'), require('./chapter-one'), require('./history-note'));else root.ShuChapterFlow = factory(root.ShuEngine, root.ShuChapterOne, root.ShuHistoryNote);
})(this, function (E, S, H) {
  'use strict';

  const READ_KEY = 'shu-story-read-v1',
    clone = o => JSON.parse(JSON.stringify(o));
  function create(host, storage = {}) {
    let history = [],
      read = {},
      legacyPending = false;
    try {
      const old = storage.read && storage.read('shu-trade-run-v1');
      legacyPending = !!(old && (!old.session || old.session.levelId === 'l01') && old.ui && old.ui.story && old.ui.story.version !== 36);
    } catch (_ignored) {}
    try {
      const data = storage.read && storage.read(READ_KEY);
      if (data && data.version === 1 && Array.isArray(data.ids)) read = Object.fromEntries(data.ids.filter(x => typeof x === 'string').slice(-1500).map(x => [x, true]));
    } catch (_ignored2) {}
    const state = () => host.ui.story,
      stats = () => S.stats(host.session.state);
    function remember(line) {
      const ui = host.ui,
        last = ui.backlog.at ? ui.backlog.at(-1) : ui.backlog[ui.backlog.length - 1];
      if (!last || last.id !== line.id) ui.backlog.push(clone(line));
      if (ui.backlog.length > 1500) ui.backlog.shift();
    }
    function markRead(line) {
      if (!line) return;
      read[line.id] = true;
      try {
        if (storage.write) storage.write(READ_KEY, {
          version: 1,
          ids: Object.keys(read).slice(-1500)
        });
      } catch (_ignored3) {}
    }
    function checkpoint() {
      history.push({
        session: host.session.snapshot(),
        ui: clone(host.ui)
      });
      if (history.length > 100) history.shift();
    }
    function showLine() {
      const ui = host.ui,
        m = ui.modal,
        line = m.lines[m.cursor];
      m.startedAt = Date.now();
      m.readyAt = m.startedAt + line.text.length * 18;
      m.revealed = false;
      m.line = clone(line);
      m.title = line.speaker;
      m.body = line.text;
      m.canSkipRead = !!read[line.id];
      state().active = {
        id: m.scene,
        cursor: m.cursor
      };
      remember(line);
    }
    function open(id, cursor = 0) {
      host.ui.error = false;
      host.ui.message = '';
      const ev = S.event(id, state(), stats());
      if (!ev) return;
      host.ui.modal = {
        kind: 'story',
        source: 'v4',
        scene: id,
        lines: ev.lines,
        choices: ev.choices,
        cursor: Math.min(cursor, ev.lines.length - 1)
      };
      state().bubble = null;
      showLine();
    }
    function effects(effect) {
      if (effect.flags) Object.assign(state().flags, effect.flags);
      if (effect.phase) state().phase = effect.phase;
    }
    function complete() {
      const ui = host.ui,
        m = ui.modal,
        ev = S.event(m.scene, state(), stats());
      markRead(m.line);
      if (m.choices.length) return;
      const meaningful = ev.done.flags || ev.done.phase;
      effects(ev.done);
      if (ev.done.complete) host.completeLevel();
      state().seenEvents[m.scene] = true;
      if (ev.terminal) state().seenEvents[ev.sceneId] = true;
      state().active = null;
      ui.modal = null;
      if (ev.done.next) open(ev.done.next);else if (ev.done.wallet) ui.modal = {
        kind: 'wallet',
        title: '整理钱袋'
      };
    }
    function advance() {
      const m = host.ui.modal;
      if (!m || m.source !== 'v4') return;
      if (!m.revealed && Date.now() < m.readyAt) {
        m.revealed = true;
        return;
      }
      m.revealed = true;
      markRead(m.line);
      if (m.cursor < m.lines.length - 1) {
        m.cursor++;
        showLine();
      } else complete();
    }
    function prop(id, title, body, actions = [], asset = '') {
      host.ui.error = false;
      host.ui.message = '';
      host.ui.modal = {
        kind: 'prop',
        id,
        title,
        body,
        actions,
        asset
      };
    }
    function notice(text) {
      state().bubble = {
        id: 'notice:' + text,
        text
      };
      host.ui.error = false;
      host.ui.message = '';
    }
    function packing() {
      const paid = host.session.state;
      if (paid.exchanged) {
        const iron = paid.preparation.iron,
          note = paid.preparation.notesByIssuer.a || 0;
        return {
          x: 8 - iron,
          iron,
          note,
          fee: 1,
          load: iron,
          canDepart: iron <= 5 && iron >= 2,
          problem: iron < 2 ? '布铺至少收 2 铁钱。' : ''
        };
      }
      const x = state().draftEnabled ? host.ui.x : 0,
        iron = 8 - x,
        note = x ? x - 1 : 0,
        problem = iron > 5 ? '超过钱袋容量，请再兑换一些铁钱。' : iron < 2 ? '布铺至少收 2 铁钱，请少兑换一些。' : '';
      return {
        x,
        iron,
        note,
        fee: x ? 1 : 0,
        load: iron,
        canDepart: !problem,
        problem
      };
    }
    function begin(id) {
      if (id === 'l01') legacyPending = false;
      host.begin(id);
      delete host.ui.feedbackMemory;
      if (host.session.level.id !== 'l01') {
        host.ui.screen = 'intro';
        return;
      }
      history = [];
      host.ui.story = S.initial();
      host.ui.story.flags.previouslyCompleted = host.completed('l01');
      host.ui.screen = 'play';
      host.ui.modal = null;
      host.ui.payIron = 0;
      host.ui.payNote = 0;
      host.ui.x = 3;
      open('P00_01_GATE');
    }
    function commit(action) {
      const ui = host.ui,
        before = {
          session: host.session.snapshot(),
          ui: clone(ui)
        },
        r = host.session.act(action);
      if (!r.ok) {
        ui.message = r.message;
        ui.error = true;
        return false;
      }
      history.push(before);
      ui.error = false;
      ui.message = host.eventText(r.event);
      host.defaults();
      ui.payIron = 0;
      ui.payNote = 0;
      if (r.state.status === 'failed') {
        state().phase = 'failed';
        state().active = null;
        ui.modal = null;
        return true;
      }
      if (action.type === 'move') {
        state().flags.actual_route = r.state.routeHistory.includes('bridge') ? 'bridge' : r.state.routeHistory.includes('street') ? 'alley' : null;
        state().tradeMap = false;
        state().phase = r.state.nodeId === 'shop' ? 'payment' : r.state.nodeId === 'delivery' ? 'delivery' : state().phase === 'return' ? 'return' : 'road';
        if (!state().routeVisited.includes(r.state.nodeId)) state().routeVisited.push(r.state.nodeId);
        const event = {
          bridge: 'P01_04_BRIDGE',
          street: 'P01_04_STREET',
          alley: 'P01_04_BACK_ALLEY',
          shop: 'P01_05_SHEN_SHOP'
        }[r.state.nodeId];
        if (event && !state().seenEvents[event]) open(event);else {
          ui.modal = null;
          if (r.state.nodeId === 'street') notice('这头多走一段，不过有檐，雨天好走。');else if (r.state.nodeId === 'alley') notice('前头左转就是布铺。');else if (r.state.nodeId === 'delivery') notice('回来了。把布放到货台上，再核一遍。');
        }
      }
      if (action.type === 'buy') {
        state().paymentOpen = false;
        open('P01_06_BOUGHT');
      }
      if (action.type === 'deliver') {
        state().phase = 'record';
        open('P01_08_DELIVERED');
      }
      return true;
    }
    function object(id) {
      const st = state(),
        ui = host.ui,
        s = host.session.state;
      const routes = {
        sign: ['gate', 'P00_01_GATE:HOTSPOT_SIGN'],
        crates: ['gate', 'P00_01_GATE:HOTSPOT_CRATES'],
        porters: ['gate', 'P00_01_GATE:HOTSPOT_ROAD'],
        'order-investigate': ['frontdesk', 'P00_04_FRONT_DESK:HOTSPOT_ORDER'],
        sample: ['frontdesk', 'P00_04_FRONT_DESK:HOTSPOT_SAMPLE'],
        ledger: ['frontdesk', 'P00_04_FRONT_DESK:HOTSPOT_LEDGER'],
        money: [['counter', 'prepare'], 'P01_01_WAREHOUSE:HOTSPOT_IRON_TRAY'],
        bag: [['counter', 'prepare'], 'P01_01_WAREHOUSE:HOTSPOT_BAG'],
        'inspect-cloth': ['payment', 'P01_05_SHEN_SHOP:HOTSPOT_CLOTH'],
        'way-back': ['return', 'P01_07_DELIVERY_APPROACH']
      };
      if (routes[id]) {
        const [phase, event] = routes[id];
        if ([].concat(phase).includes(st.phase)) open(event);
        return;
      }
      if (id === 'enter' && st.phase === 'gate') {
        st.phase = 'entry';
        open('P00_02_AHE');
        return;
      }
      if (id === 'warehouse' && st.phase === 'frontdesk') {
        open('P01_01_WAREHOUSE');
        return;
      }
      if (id === 'exchange-desk' && ['counter', 'prepare'].includes(st.phase)) {
        st.phase = 'prepare';
        if (!st.seenEvents.P01_02_EXCHANGE_INTRO) open('P01_02_EXCHANGE_INTRO');else ui.modal = {
          kind: 'wallet',
          title: '整理钱袋'
        };
        return;
      }
      if (id === 'order') {
        prop('order', '罗记货单', '青布一批 · 罗记\n货款 6 · 货重 2 格\n至少付 2 铁钱，其余可付交子。', [], 'order');
        return;
      }
      if (id === 'pay' && st.phase === 'payment') {
        st.paymentOpen = true;
        ui.modal = null;
        return;
      }
      if (id === 'deliver-now' && st.phase === 'delivery' && s.cargoById.cloth) {
        st.flags.deliveryReady = true;
        commit({
          type: 'deliver'
        });
        return;
      }
    }
    function handle(id) {
      const ui = host.ui;
      if (id === 'opening-start' && ui.screen === 'opening') {
        ui.screen = 'play';
        if (state() && state().active) open(state().active.id, state().active.cursor);else open('P00_01_GATE');
        return true;
      }
      if (id.startsWith('chapter-open:')) {
        const target = id.slice(13);
        if (target === 'l01' && legacyPending) {
          ui.modal = {
            kind: 'legacy',
            title: '第一关剧本已更新',
            body: '旧版局面无法接入 V3.6。请重新开始本关，已完成章节保留。'
          };
          return true;
        }
        if (!host.unlocked(target)) return true;
        const saved = host.resume;
        handle('enter:' + target);
        if (target === 'l01' && !(saved && saved.session.levelId === target) && state()) ui.screen = 'play';
        if (ui.screen === 'opening') ui.modal = null;
        return true;
      }
      if (id.startsWith('enter:')) {
        const target = id.slice(6);
        if (!host.unlocked(target)) return true;
        const saved = host.resume;
        if (saved && saved.version === 2 && !validate(saved)) {
          ui.modal = {
            kind: 'legacy',
            title: '第一关剧本已更新',
            body: '本次更新采用 V3.6 剧本，请重新开始本关。已完成章节保留。'
          };
          return true;
        }
        if (saved && saved.version === 2 && saved.session.levelId === target) {
          restore(saved);
        } else if (saved && saved.version === 1 && saved.session.levelId === target && target === 'l01') {
          ui.modal = {
            kind: 'legacy',
            title: '第一关已更新',
            body: '旧版中途记录无法接入新版剧情。已通关章节会保留；重新开始本关后进入新版剧情。'
          };
        } else begin(target);
        return true;
      }
      if (id === 'legacy-restart' && ui.modal && ui.modal.kind === 'legacy') {
        begin('l01');
        return true;
      }
      if (id === 'resume' && host.resume && host.resume.version === 2) {
        restore(host.resume);
        return true;
      }
      if (!state() || ui.screen !== 'play') return false;
      const m = ui.modal,
        st = state();
      if (id === 'history-note') {
        if (m && m.source === 'v4') return true;
        if (host.completed('l01')) ui.modal = {
          kind: 'history-note',
          page: 0
        };else {
          ui.message = '本章故事结束后开放史实补记。';
          ui.error = true;
        }
        return true;
      }
      if (m && m.kind === 'history-note') {
        if (id === 'history-note-next' || id === 'history-note-prev') {
          m.page = Math.max(0, Math.min(H.pages.length - 1, m.page + (id === 'history-note-next' ? 1 : -1)));
          try {
            storage.write && storage.write('shu-history-read-v1', {
              version: 1,
              l01: m.page
            });
          } catch (_ignored4) {}
        } else if (id === 'close') ui.modal = null;
        return true;
      }
      if (id === 'undo') {
        if (m && m.source === 'v4') return true;
        if (ui.screen !== 'play') return true;
        const revoke = st.flags.endingSeen && !st.flags.previouslyCompleted;
        const current = JSON.stringify(host.session.snapshot());
        let index = history.length - 1;
        while (index >= 0 && JSON.stringify(history[index].session) === current) index--;
        if (index < 0) index = history.length - 1;
        const previous = index >= 0 ? history[index] : null;
        if (previous) {
          if (revoke && host.revokeLevel) host.revokeLevel();
          history.length = index;
          host.session = E.restoreSession(previous.session);
          Object.assign(ui, clone(previous.ui));
          ui.screen = 'play';
          ui.error = false;
          ui.message = '已撤回上一项行动。';
        }
        return true;
      }
      if (id === 'retry' || id === 'story-retry') {
        begin('l01');
        return true;
      }
      if (m && m.source === 'v4') {
        if (id === 'dialogue-next' || id === 'close') {
          advance();
          return true;
        }
        if (id === 'story-skip-read') {
          while (ui.modal && ui.modal.source === 'v4' && ui.modal.canSkipRead && !(ui.modal.cursor === ui.modal.lines.length - 1 && ui.modal.choices.length)) {
            advance();
          }
          return true;
        }
        if (id.startsWith('choice:') && m.cursor === m.lines.length - 1) {
          if (!m.revealed && Date.now() < m.readyAt) return true;
          const c = m.choices.find(c => c.id === id.slice(7));
          if (c) {
            markRead(m.line);
            Object.assign(st.flags, c.effects || {});
            st.seenEvents[m.scene] = true;
            st.active = null;
            ui.modal = null;
            if (c.next) open(c.next);
          }
          return true;
        }
        if (id === 'sounds') {
          ui.modal = {
            kind: 'sound',
            returnStory: clone(st.active)
          };
          return true;
        }
        if (!['home', 'backlog', 'backlog-return'].includes(id)) return true;
      }
      if (m && m.kind === 'sound' && id === 'close' && m.returnStory) {
        open(m.returnStory.id, m.returnStory.cursor);
        return true;
      }
      if (m && m.kind === 'prop' && id === 'close') {
        ui.modal = null;
        return true;
      }
      if (m && m.kind === 'wallet' && st.phase === 'prepare') {
        if (id === 'close') {
          ui.modal = null;
          return true;
        }
        if (!['x+', 'x-', 'draft-enable', 'draft-mode:exchange', 'draft-mode:iron', 'prepare-depart', 'exchange-confirm', 'wallet', 'object:order', 'object:note', 'object:old-question'].includes(id)) return true;
      }
      if (m && m.kind === 'prop' && !id.startsWith('object:') && id !== 'inspect-confirm') return true;
      if (m && !['lesson', 'prop', 'move'].includes(m.kind) && !(m.kind === 'wallet' && st.phase === 'prepare')) return false;
      if (id.startsWith('object:')) {
        object(id.slice(7));
        return true;
      }
      if (id === 'inspect-confirm' && st.flags.needsInspection) {
        open('delivery-check');
        return true;
      }
      if (id === 'wallet') {
        if (['counter', 'prepare'].includes(st.phase)) {
          object('exchange-desk');
        } else ui.modal = {
          kind: 'wallet',
          title: '随身钱袋'
        };
        return true;
      }
      if (id === 'bubble-close') {
        st.bubble = null;
        return true;
      }
      if (id === 'shop-enter' && host.session.state.nodeId === 'shop') {
        st.tradeMap = false;
        ui.modal = null;
        return true;
      }
      if (id === 'trade-map') {
        if (st.phase === 'payment') st.paymentOpen = false;
        st.tradeMap = true;
        ui.modal = null;
        return true;
      }
      if (id === 'trade-close') {
        st.paymentOpen = false;
        ui.modal = null;
        return true;
      }
      if (id === 'draft-enable') {
        st.draftEnabled = !st.draftEnabled;
        return true;
      }
      if (id === 'draft-mode:exchange' || id === 'draft-mode:iron') {
        if (st.phase === 'prepare') {
          st.draftEnabled = id === 'draft-mode:exchange';
          ui.message = '';
          ui.error = false;
        }
        return true;
      }
      if (id === 'exchange-info') {
        open('P01_02_EXCHANGE_INTRO');
        return true;
      }
      if (id === 'exchange-confirm' && st.phase === 'prepare') {
        if (host.session.state.exchanged) return true;
        const d = packing();
        if (!d.canDepart || !st.draftEnabled) {
          ui.error = true;
          ui.message = d.problem || '先选择兑换数量。';
          return true;
        }
        checkpoint();
        const r = host.session.act({
          type: 'exchange',
          amount: ui.x
        });
        if (!r.ok) {
          history.pop();
          ui.error = true;
          ui.message = r.message;
          return true;
        }
        ui.modal = null;
        open('P01_02_EXCHANGE_DONE');
        return true;
      }
      if (id === 'prepare-depart' && st.phase === 'prepare') {
        if (!host.session.state.exchanged) {
          ui.error = true;
          ui.message = '先在柜台确认兑换。';
          return true;
        }
        if (commit({
          type: 'depart'
        })) {
          st.phase = 'road';
          open('P01_03_ROAD_FORK');
        }
        return true;
      }
      if (id === 'confirm-move') {
        const before = ui.modal;
        if (before && before.kind === 'move' && before.canMove && ['road', 'return', 'delivery', 'payment'].includes(st.phase)) {
          commit({
            type: 'move',
            to: before.nodeId
          });
        }
        return true;
      }
      if (id === 'transact') {
        if (st.phase !== 'payment' || !st.flags.clothSelected) {
          ui.error = true;
          ui.message = '先对照货单核好罗记的青布。';
          return true;
        }
        commit({
          type: 'buy',
          transactionId: 'buy-cloth',
          iron: ui.payIron,
          notes: {
            a: ui.payNote
          }
        });
        return true;
      }
      if (id === 'deliver') {
        if (!st.flags.deliveryReady) {
          ui.message = '先在货台核货，再确认交付。';
          ui.error = true;
          return true;
        }
        commit({
          type: 'deliver'
        });
        return true;
      }
      if (id === 'replay') return true;
      if (id === 'stay' && st.flags.endingSeen) {
        st.phase = 'stay';
        ui.screen = 'play';
        ui.modal = null;
        return true;
      }
      if (['exchange', 'depart', 'play', 'skip-intro', 'next'].includes(id)) return true;
      const adjust = /^(x|p|n)([+-])$/.exec(id);
      if (adjust) {
        const s = host.session.state,
          key = {
            x: 'x',
            p: 'payIron',
            n: 'payNote'
          }[adjust[1]],
          delta = adjust[2] === '+' ? 1 : -1,
          min = key === 'x' ? 2 : 0,
          max = key === 'x' ? 8 : key === 'payIron' ? Math.min(s.iron, 6 - ui.payNote) : Math.min(s.notesByIssuer.a, 6 - ui.payIron);
        if (key === 'x' && (st.phase !== 'prepare' || s.exchanged) || key !== 'x' && st.phase !== 'payment') return true;
        ui[key] = Math.max(min, Math.min(max, ui[key] + delta));
        ui.message = '';
        ui.error = false;
        return true;
      }
      return false;
    }
    function decorate(v) {
      if (!state()) return v;
      v.story = clone(state());
      v.historyNote = H;
      v.historyUnlocked = host.completed('l01');
      v.storyObjects = S.objects(state(), host.session.state).map(o => Object.assign(o, {
        action: 'object:' + o.id
      }));
      v.storyGoal = S.goal(state(), host.session.state);
      v.storyStats = stats();
      v.canUndo = history.length > 0;
      v.storyPayIron = host.ui.payIron;
      v.storyPayNote = host.ui.payNote;
      v.storyDraftX = host.ui.x;
      v.level = Object.assign({}, v.level, {
        nodes: v.level.nodes.map(n => Object.assign({}, n, {
          name: n.id === 'warehouse' ? '罗记后仓' : n.id === 'delivery' ? '罗记前堂' : n.name
        }))
      });
      v.nodes = v.nodes.map(n => Object.assign({}, n, {
        name: n.id === 'warehouse' ? '罗记后仓' : n.id === 'delivery' ? '罗记前堂' : n.name
      }));
      if (v.modal && v.modal.kind === 'move') v.modal.title = v.level.nodes.find(n => n.id === v.modal.nodeId).name;
      v.pathText = host.session.state.routeHistory.map(id => v.level.nodes.find(n => n.id === id).name).join(' → ');
      if (state().phase === 'prepare') v.draft = packing();
      return v;
    }
    function snapshot() {
      return {
        version: 2,
        session: host.session.snapshot(),
        ui: clone(host.ui),
        history: clone(history)
      };
    }
    function validate(data) {
      try {
        const validUI = u => u && S.valid(u.story) && ['x', 'payIron', 'payNote', 'hint'].every(k => Number.isInteger(u[k]) && u[k] >= 0 && u[k] <= 100) && u.x >= 2 && u.x <= 8 && u.payIron + u.payNote <= 6 && u.hint <= 2 && Array.isArray(u.backlog) && u.backlog.length <= 1500 && u.backlog.every(l => l && typeof l.text === 'string' && typeof l.speaker === 'string') && (!u.story.active || typeof u.story.active.id === 'string' && Number.isInteger(u.story.active.cursor) && u.story.active.cursor >= 0 && S.event(u.story.active.id, u.story) && u.story.active.cursor < S.event(u.story.active.id, u.story).lines.length);
        if (!data || data.version !== 2 || data.session.levelId !== 'l01' || !data.ui || !validUI(data.ui) || !Array.isArray(data.history) || data.history.length > 100) return false;
        E.restoreSession(data.session);
        for (const h of data.history) {
          if (!h.session || h.session.levelId !== 'l01' || !h.ui || !validUI(h.ui)) return false;
          E.restoreSession(h.session);
        }
        return true;
      } catch (_ignored5) {
        return false;
      }
    }
    function restore(data) {
      if (!validate(data)) return;
      host.session = E.restoreSession(data.session);
      Object.assign(host.ui, clone(data.ui));
      history = clone(data.history);
      host.ui.screen = data.ui.screen === 'opening' ? 'opening' : 'play';
      if (state().active) open(state().active.id, state().active.cursor);else host.ui.modal = null;
    }
    return {
      handle,
      decorate,
      snapshot,
      validate,
      restore,
      reset() {
        history = [];
        delete host.ui.story;
      },
      resetRead() {
        read = {};
      },
      get active() {
        return !!state();
      },
      get canResume() {
        return !!state() && (host.session.state.status === 'playing' || !state().flags.endingSeen || state().phase === 'stay');
      }
    };
  }
  return {
    create,
    READ_KEY
  };
});